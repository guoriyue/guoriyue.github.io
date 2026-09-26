"""Step 1: the Triton IR.

The IR records, `emit` and `call` are given. Write: lower, statement, visit.

Before coding, read the parameter conventions, then the state contracts:
    steps/step01-triton-ir.md#compile-time-inputs
    steps/step01-triton-ir.md#exercise-interface

    tinytriton check step01
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
    """Translate a parsed function into the supplied Program/Instr/Value records.

    Your lower() creates these fields for each compilation:
      block: int -- compile-time BLOCK, consumed by constexpr().
      program: Program -- output, including runtime params and instructions.
      body: list[Instr] -- the same list as program.body; emit/call append here.
      env: dict[str, Value] -- source names to IR values, not runtime contents.

    No constructor initializes this state for you. See the Step 1 lesson for
    a runnable AST inspection and a hand-built IR example before the TODOs.
    """

    binary = {ast.Add: "add", ast.Mult: "mul"}

    def parse(self, text):
        """Supplied: read one function without executing Python."""
        (function,) = ast.parse(text).body
        return function

    def lower(self, function, block):
        """Input: ast.FunctionDef and integer block. Output: a Program.

        Inspect function.args.args: each ast.arg has a string `arg` name and
        an AST `annotation`. ast.unparse(arg.annotation) gives "ptr", "int",
        or "tl.constexpr" in the supplied kernel. The last marks BLOCK as a
        compile-time input; its integer value comes from this method's block
        argument, not from the annotation. Skip it in runtime params/env.
        """
        # Walkthrough: steps/step01-triton-ir.md#compile-time-inputs
        # TODO(Step 1): Initialize all four fields described on Compiler above.
        # For each ordinary parameter, create one Value(name, annotation),
        # bind it in self.env, and append it to self.program.params.
        # Visit function.body with self.statement, then return self.program.
        raise NotImplementedError("Step 1: lower")

    def statement(self, node):
        """Input: ast.Assign or ast.Expr. Effect: emit IR and update self.env.

        Assign: node.value is the expression; node.targets[0].id is its name.
        Expr: node.value is the call, here a store with no result to bind.
        """
        # Walkthrough: steps/step01-triton-ir.md#compile-time-inputs
        # TODO(Step 1): An Assign binds its target to self.visit(value); a bare
        # tl.store(...) is just visited.
        raise NotImplementedError("Step 1: statement")

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
        """Input: an AST expression. Output: its IR Value (None for a store).

        Name.id is a source name; Constant.value is a Python literal.
        BinOp has left/right/op; Compare has left/comparators[0].
        Call.func.attr is the tl operation name. Pass its AST args and
        {kw.arg: kw.value for kw in node.keywords} to the supplied call().
        Visit children before emitting the operation that uses their Values.
        """
        # Walkthrough: steps/step01-triton-ir.md#compile-time-inputs
        # TODO(Step 1): One Value per expression. Name: self.env, or a const for BLOCK.
        # Constant: a const. BinOp: addptr if the left side is a pointer, else the
        # op in self.binary. Compare: lt. Call: hand it to self.call.
        raise NotImplementedError("Step 1: visit")

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
