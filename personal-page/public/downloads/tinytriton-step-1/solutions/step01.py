"""Step 1: the Triton IR.

Parameter conventions explained before this code: steps/step01-triton-ir.md#compile-time-inputs

Read lower -> statement -> visit; emit records operations and call handles tl calls.
Lesson checkpoints: steps/step01-triton-ir.md#inspect-your-result
"""

import ast
from dataclasses import dataclass, field


@dataclass(frozen=True)
class Value:
    name: str
    kind: str  # "int", "float", "bool" or "ptr"
    shape: tuple = ()  # () is one number, (4,) is a tile of four lanes


@dataclass
class Instr:
    """An instruction: one recorded operation, not an executed calculation."""

    result: Value | None  # None for a store
    op: str
    args: tuple  # the Values it reads
    attrs: dict = field(default_factory=dict)  # compile-time extras


@dataclass
class Program:
    name: str
    params: list
    body: list = field(default_factory=list)

    def __len__(self):  # the checks measure a program by its length
        return len(self.body)


class Compiler:
    """One compilation's state, initialized by lower().

    block: compile-time integer; program: output Program; body: its current
    instruction list; env: source name -> Value, never actual array contents.
    body and program.body refer to the same instruction list.
    """

    binary = {ast.Add: "add", ast.Mult: "mul"}

    def parse(self, text):
        """Supplied: read one function without executing Python."""
        (function,) = ast.parse(text).body
        return function

    def lower(self, function, block):
        """Translate an ast.FunctionDef into a Program of IR instructions.

        Source annotations classify parameters; block supplies the actual
        compile-time value(s). Neither parsing nor lowering runs the kernel.
        """
        self.block = block
        self.program = Program(function.name, [])
        self.body = self.program.body  # where instructions go
        self.env = {}  # Python name -> the Value holding it
        # function.args wraps the list of ast.arg records in .args.
        for arg in function.args.args:
            parameter_name = arg.arg
            annotation = ast.unparse(arg.annotation)
            # Only runtime inputs become parameters of the generated program.
            if annotation != "tl.constexpr":
                parameter = Value(parameter_name, annotation)
                self.env[parameter_name] = parameter
                self.program.params.append(parameter)
        for node in function.body:
            self.statement(node)
        return self.program

    def statement(self, node):
        if isinstance(node, ast.Assign):
            # Translate the right-hand expression before binding its name.
            value = self.visit(node.value)
            target_name = node.targets[0].id
            self.env[target_name] = value
        else:
            self.visit(node.value)  # a bare tl.store(...)

    def emit(self, op, args=(), kind="int", shape=(), **attrs):
        result = Value(f"%{len(self.body)}", kind, shape)
        self.body.append(Instr(result, op, tuple(args), attrs))
        return result

    def constexpr(self, node):
        """Resolve a literal or the supported compile-time name BLOCK.

        lower() saves the caller's integer in self.block. A misspelled name
        must not silently acquire that value.
        """
        if isinstance(node, ast.Constant):
            return node.value
        if isinstance(node, ast.Name):
            if node.id == "BLOCK":
                return self.block
            raise KeyError(node.id)
        raise NotImplementedError(ast.dump(node))

    def broadcast(self, *values):
        """The shape of an elementwise result: a scalar is reused in every lane."""
        shapes = [v.shape for v in values if v.shape]
        return shapes[0] if shapes else ()

    def visit(self, node):
        if isinstance(node, ast.Name):
            # Parameters and earlier assignments refer to existing IR Values.
            if node.id in self.env:
                return self.env[node.id]
            # constexpr resolves supported compile-time names, or raises.
            constant = self.constexpr(node)
            return self.emit("const", value=constant)
        if isinstance(node, ast.Constant):
            kind = "float" if isinstance(node.value, float) else "int"
            return self.emit("const", kind=kind, value=node.value)
        if isinstance(node, ast.BinOp):
            a, b = self.visit(node.left), self.visit(node.right)
            shape = self.broadcast(a, b)
            if a.kind == "ptr":
                return self.emit("addptr", (a, b), "ptr", shape)
            kind = "float" if "float" in (a.kind, b.kind) else "int"
            return self.emit(self.binary[type(node.op)], (a, b), kind, shape)
        if isinstance(node, ast.Compare):  # the kernels only use <
            a, b = self.visit(node.left), self.visit(node.comparators[0])
            return self.emit("lt", (a, b), "bool", self.broadcast(a, b))
        if isinstance(node, ast.Call):
            keywords = {k.arg: k.value for k in node.keywords}
            return self.call(node.func.attr, node.args, keywords)
        raise NotImplementedError(ast.dump(node))

    def call(self, name, args, keywords):
        if name == "program_id":
            return self.emit("program_id", axis=args[0].value)
        if name == "arange":
            start, end = self.constexpr(args[0]), self.constexpr(args[1])
            return self.emit("arange", shape=(end - start,), start=start, end=end)
        if name == "load":
            pointer = self.visit(args[0])
            mask, other = self.visit(keywords["mask"]), self.visit(keywords["other"])
            return self.emit("load", (pointer, mask, other), "float", pointer.shape)
        if name == "store":
            pointer, value = self.visit(args[0]), self.visit(args[1])
            mask = self.visit(keywords["mask"])
            self.body.append(Instr(None, "store", (pointer, value, mask)))
            return None
        raise NotImplementedError(f"tl.{name}")
