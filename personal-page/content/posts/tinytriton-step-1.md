---
title: Step 1. From source code to instructions
date: 2026-09-26
description: Translate a small array program into instructions. Explain compile time parameters, name lookup, recursive traversal, and the complete exercise implementation.
label: AI Systems
series: TinyTriton
part: 1
---

[Series overview](https://guoriyue.github.io/blog/tinytriton-series/) · Lesson 1 of 15

A compiler represents a computation before executing it. The representation
records which operations are required, which values they use, and which results
they produce. This lesson constructs that representation for a small array
addition program.

There are two programs to distinguish. The compiler is a Python program that
runs while translating the source. The kernel is the program being translated.
Creating Python objects and updating dictionaries executes the compiler, but
neither action performs the kernel's array addition.

The result of this lesson is a `Program` containing runtime parameters and an
ordered list of instructions. The following lesson will interpret those
instructions. GPU thread assignment and code generation come later.

Basic Python functions, lists, dictionaries, and classes are sufficient for this
lesson. No GPU or previous compiler knowledge is required.

<figure class="lesson-figure">
<a href="/blog/tinytriton-step-1/01-two-programs.svg" target="_blank" rel="noopener">
<picture>
<source data-theme-dark srcset="/blog/tinytriton-step-1/01-two-programs-dark.svg" media="all" />
<img src="/blog/tinytriton-step-1/01-two-programs.svg" alt="Figure 1. The compiler constructs a description before the kernel executes" loading="lazy" width="960" height="570" />
</picture>
</a>
<figcaption>Figure 1. The compiler constructs a description before the kernel executes. Open the figure to enlarge it.</figcaption>
</figure>

## 1. Describe a calculation before running it

Consider a small expression.

```python
answer = (a + b) * 2
```

Executing it requires numbers for `a` and `b`. Describing its operations does
not. We can record the addition, constant, and multiplication in order.

```text
%0 = add(a, b)
%1 = const(value=2)
%2 = mul(%0, %1)
```

Each line is an **instruction**, a record of one operation. `add` is the operation
name. Its operands `a` and `b` are the inputs, and `%0` names the result. The
percent sign is part of a label, rather than Python's remainder operator.
`const` introduces a known number that another instruction can reference.

This list is an **intermediate representation**, or **IR**. Creating the list
does not perform addition or multiplication. It records how to compute the
result when the inputs become available.

The source name `answer` refers to `%2`. A dictionary can store that association.
Assignment itself requires no additional arithmetic instruction.

For `answer = a + b * 2`, the dependencies change. The multiplication must be
represented before the addition because its result is an input to that addition.
The instruction order follows dependencies rather than the order in which
operators appear in the source text.

## 2. Let Python read the syntax

Python's `ast` module parses source text into an **abstract syntax tree**, or
**AST**. The tree records the nested structure of expressions and statements.

The following experiment runs in an ordinary Python session.

```python
import ast

assignment = ast.parse("answer = a + b * 2").body[0]
print(type(assignment).__name__)
print(type(assignment.value).__name__)
print(type(assignment.value.op).__name__)
print(type(assignment.value.right.op).__name__)
```

The output identifies an assignment whose right side is an addition containing
a multiplication.

```text
Assign
BinOp
Add
Mult
```

`Assign.value` contains the expression on the right of the assignment.
`BinOp.left`, `BinOp.right`, and `BinOp.op` describe two inputs and their operator.
The right input to the addition is itself a `BinOp` for multiplication.

Translating this tree into our instruction list is called **lowering**. Our
traversal starts at the leaves, resolves names and literals, and then records
operations that use those values. Applying the same procedure to nested
expressions is recursion.

Lowering is a general translation process. It does not prescribe how every
language must represent constants or parameters. Those choices belong to the
language and compiler being implemented.

<figure class="lesson-figure">
<a href="/blog/tinytriton-step-1/02-ast-to-ir.svg" target="_blank" rel="noopener">
<picture>
<source data-theme-dark srcset="/blog/tinytriton-step-1/02-ast-to-ir-dark.svg" media="all" />
<img src="/blog/tinytriton-step-1/02-ast-to-ir.svg" alt="Figure 2. Nested syntax becomes operations with explicit dependencies" loading="lazy" width="960" height="610" />
</picture>
</a>
<figcaption>Figure 2. Nested syntax becomes operations with explicit dependencies. Open the figure to enlarge it.</figcaption>
</figure>

## 3. The small language we will compile

The compiler receives a string containing a function.

```python
source = """
def vector_add(x: ptr, y: ptr, out: ptr, n: int, BLOCK: tl.constexpr):
    offsets = tl.program_id(0) * BLOCK + tl.arange(0, BLOCK)
    mask = offsets < n
    a = tl.load(x + offsets, mask=mask, other=0.0)
    b = tl.load(y + offsets, mask=mask, other=0.0)
    tl.store(out + offsets, a + b, mask=mask)
"""
```

This teaching language uses Python syntax. `ast.parse(source)` reads the string
without executing the function or evaluating its annotations. Parsing requires
neither an imported `tl` module nor a Python definition of `ptr`. Our compiler
assigns meaning to those spellings.

The kernel computes `out[i] = x[i] + y[i]`. It describes a **tile**, a small group
of elements processed together. `BLOCK` determines the tile width. A program
instance handles one tile, and its program ID identifies that tile. A position
within a tile is sometimes called a lane. Neither a tile position nor a program
instance should be identified with a single GPU thread at this stage.

| Source operation | Meaning in this lesson |
|---|---|
| `tl.program_id(0)` | The program ID along the dimension used by this kernel |
| `tl.arange(0, BLOCK)` | Integer positions from zero up to but excluding `BLOCK` |
| `x + offsets` | Candidate element addresses relative to the start of `x` |
| `offsets < n` | A Boolean indicating whether each position is within the input |
| `tl.load(..., mask=mask, other=0.0)` | Read valid positions and use zero elsewhere |
| `tl.store(..., mask=mask)` | Write only valid positions |

A pointer identifies a location in memory. Here `ptr` describes a pointer to
FP32 elements. Adding two to a pointer advances by two elements. It does not add
two to the numbers stored in the array. Address calculation, reading memory, and
writing memory are separate operations.

### Trace the final tile

Suppose `x=[1,2,3,4,5,6]`, `y=[10,20,30,40,50,60]`, `n=6`, and `BLOCK=4`.
Two program instances cover the input.

| Program ID | Candidate offsets | Mask |
|---|---|---|
| 0 | `[0,1,2,3]` | `[True,True,True,True]` |
| 1 | `[4,5,6,7]` | `[True,True,False,False]` |

<figure class="lesson-figure">
<a href="/blog/tinytriton-step-1/03-tiles-and-mask.svg" target="_blank" rel="noopener">
<picture>
<source data-theme-dark srcset="/blog/tinytriton-step-1/03-tiles-and-mask-dark.svg" media="all" />
<img src="/blog/tinytriton-step-1/03-tiles-and-mask.svg" alt="Figure 3. Two program instances cover six elements with a masked final tile" loading="lazy" width="960" height="550" />
</picture>
</a>
<figcaption>Figure 3. Two program instances cover six elements with a masked final tile. Open the figure to enlarge it.</figcaption>
</figure>

For program 1, multiplying its ID by four gives the scalar four. Adding that
scalar to `[0,1,2,3]` gives `[4,5,6,7]`. Reusing a scalar at each tile position
is **broadcasting**.

The mask prevents reads at offsets six and seven. The two loads produce
`a=[5,6,0,0]` and `b=[50,60,0,0]`. Their sum is `[55,66,0,0]`, but the store
writes only positions four and five. The zeros at invalid positions are not
written to memory.

<figure class="lesson-figure">
<a href="/blog/tinytriton-step-1/04-memory.svg" target="_blank" rel="noopener">
<picture>
<source data-theme-dark srcset="/blog/tinytriton-step-1/04-memory-dark.svg" media="all" />
<img src="/blog/tinytriton-step-1/04-memory.svg" alt="Figure 4. Pointer arithmetic computes addresses before memory is read or written" loading="lazy" width="960" height="680" />
</picture>
</a>
<figcaption>Figure 4. Pointer arithmetic computes addresses before memory is read or written. Open the figure to enlarge it.</figcaption>
</figure>

This trace describes what execution will mean. The first lesson records the
operations without reading these arrays.

<a id="compile-time-inputs"></a>

## 4. Why `BLOCK: tl.constexpr` is different

A value can become available during compilation or during execution. Our
language distinguishes these cases explicitly.

| Information | When it becomes available |
|---|---|
| Tile width `BLOCK` | During compilation |
| Array addresses and input length `n` | At execution |
| Array contents | When execution reads memory |

A **compile time constant** is known during compilation. A **runtime input** is
provided when the generated program executes. `constexpr` abbreviates constant
expression. In this language, the annotation `tl.constexpr` marks a parameter
whose value must be provided during compilation.

### The annotation identifies the category

For each parameter, `lower` obtains its name and annotation from the AST.

```python
parameter_name = arg.arg
annotation = ast.unparse(arg.annotation)
```

For `n`, these strings are `"n"` and `"int"`. For `BLOCK`, they are `"BLOCK"`
and `"tl.constexpr"`. The annotation is the evidence used to classify the
parameter. The compiler does not infer this category from the name `BLOCK` or
from how the parameter is used.

The marker has meaning because our compiler recognizes it. It is not a Python
keyword, and the parser does not assign a value to it.

### The caller supplies the value

After `lower` has been implemented, the caller can request a specialization.

```python
compiler = Compiler()
function = compiler.parse(source)
program = compiler.lower(function, block=4)
```

`lower` saves this choice in `self.block`. The generated program needs `x`, `y`,
`out`, and `n` at execution. It does not need another argument for `BLOCK`
because the width has already been fixed to four.

The distinction is between two interfaces. The compiler interface accepts
`function` and `block`. The generated program interface accepts the runtime
parameters. These interfaces serve different purposes.

Changing array contents does not require another specialization. Changing the
tile width does, because the shapes recorded in the IR depend on that width.

### Skipping means excluding a runtime parameter

The parameter registration loop contains the following condition.

```python
if annotation != "tl.constexpr":
    parameter = Value(parameter_name, annotation)
    self.env[parameter_name] = parameter
    self.program.params.append(parameter)
```

When the loop reaches `n`, the condition is true and the compiler registers a
runtime input. When it reaches `BLOCK`, the condition is false and this block
of code does not execute.

Skipping `BLOCK` here means excluding it from `program.params` and `env` during
runtime parameter registration. It does not mean discarding its value. The
value has already been saved in `self.block` and remains available to the
supplied `constexpr` helper.

```text
lower(function, block=4)
    ↓
self.block = 4
    ↓
BLOCK is excluded from runtime parameter registration
    ↓
visit encounters the source name BLOCK
    ↓
constexpr returns self.block
    ↓
emit records const(value=4) when an IR operand is needed
```

The registration loop therefore handles only one part of parameter processing.
Saving the compilation choice and resolving later uses happen elsewhere.

<figure class="lesson-figure">
<a href="/blog/tinytriton-step-1/05-compile-time.svg" target="_blank" rel="noopener">
<picture>
<source data-theme-dark srcset="/blog/tinytriton-step-1/05-compile-time-dark.svg" media="all" />
<img src="/blog/tinytriton-step-1/05-compile-time.svg" alt="Figure 5. BLOCK is saved during compilation and excluded from runtime inputs" loading="lazy" width="960" height="640" />
</picture>
</a>
<figcaption>Figure 5. BLOCK is saved during compilation and excluded from runtime inputs. Open the figure to enlarge it.</figcaption>
</figure>

### The resolver has a deliberately limited scope

The supplied helper accepts numeric literals and the name `BLOCK`.

```python
def constexpr(self, node):
    if isinstance(node, ast.Constant):
        return node.value
    if isinstance(node, ast.Name):
        if node.id == "BLOCK":
            return self.block
        raise KeyError(node.id)
    raise NotImplementedError(ast.dump(node))
```

Classification uses the annotation, but resolution in this lesson recognizes
only the name `BLOCK`. Supporting another name would require extending the
resolver and the compiler interface. Renaming a parameter alone is insufficient.
A misspelling such as `BLOKC` raises an error rather than receiving the same value.

The helper is not a general evaluator of constant expressions. For example,
it cannot directly resolve `BLOCK * 2` as an argument to `arange`. The ordinary
expression visitor can represent multiplication, but this helper accepts only
the two syntax forms shown above.

These conventions are supplied by the exercise. They are not universal
properties of lowering or rules the learner must derive independently.

## 5. Inspect the function before writing the compiler

Using the earlier source string, inspect the function and its parameters.

```python
function = ast.parse(source).body[0]
print(type(function).__name__, function.name)
for parameter in function.args.args:
    print(parameter.arg, ast.unparse(parameter.annotation))
```

The output shows exactly which annotation the registration loop will inspect.

```text
FunctionDef vector_add
x ptr
y ptr
out ptr
n int
BLOCK tl.constexpr
```

| Python AST field | What it contains |
|---|---|
| `function.name` | The function name |
| `function.args` | An object grouping parameter lists |
| `function.args.args` | The parameter list used by this kernel |
| `parameter.arg` | A parameter name |
| `parameter.annotation` | The annotation as syntax |
| `function.body` | Statements in source order |

The repeated `.args.args` comes from two nested objects. These field names are
part of Python's AST interface. All parameters in the sample have annotations,
so the exercise does not need general handling of missing annotations.

## 6. Three records for the output

The starter defines three dataclasses. A dataclass stores named fields and
provides a generated constructor and printable representation.

| Record | Purpose | Fields |
|---|---|---|
| `Value` | Describe an input or intermediate result | `name`, `kind`, `shape` |
| `Instr` | Record an operation and its dependencies | `result`, `op`, `args`, `attrs` |
| `Program` | Own the translated interface and instructions | `name`, `params`, `body` |

`Value("x", "ptr")` describes a pointer input without containing an array.
`Value("%4", "int", (4,))` describes a tile of four integers without containing
those integers. The shape `()` means a scalar. The shape `(4,)` means a single
dimension of length four.

An instruction's `args` refer to input values or earlier results. Its `attrs`
contain data already known to the compiler. For example, a constant instruction
has a value attribute, while `arange` has start and end attributes. A store
changes memory but produces no result Value, so its `result` is `None`.

<figure class="lesson-figure">
<a href="/blog/tinytriton-step-1/06-records.svg" target="_blank" rel="noopener">
<picture>
<source data-theme-dark srcset="/blog/tinytriton-step-1/06-records-dark.svg" media="all" />
<img src="/blog/tinytriton-step-1/06-records.svg" alt="Figure 6. Program owns instructions that reference Value records" loading="lazy" width="960" height="710" />
</picture>
</a>
<figcaption>Figure 6. Program owns instructions that reference Value records. Open the figure to enlarge it.</figcaption>
</figure>

The following example constructs one addition without executing it.

```python
from problems.step01 import Value, Instr, Program

left = Value("left", "int")
right = Value("right", "int")
sum_value = Value("sum", "int")
instruction = Instr(sum_value, "add", (left, right))
program = Program("example", [left, right], [instruction])
print(program)
```

`Instr` abbreviates instruction. It is a class defined by the project, not a
Python keyword.

<a id="exercise-interface"></a>

## 7. The exercise interface

Clone the [companion repository](https://github.com/guoriyue/TinyTriton) and set
up the CPU exercise dependencies with Python 3.10 or newer.

```bash
git clone https://github.com/guoriyue/TinyTriton.git
cd TinyTriton
python -m venv .venv
source .venv/bin/activate
python -m pip install -e '.[dev]'
tinytriton check step01
```

On Windows, activate the environment with `.venv\Scripts\activate`.
The unfinished exercise raises `NotImplementedError`. That is the expected
starting point.

### What is supplied and what must be written

Open [the starter file](https://github.com/guoriyue/TinyTriton/blob/main/problems/step01.py).
The three exercise methods contain signatures, documentation, TODO comments,
and a `NotImplementedError`. Their executable logic is absent. Even the node
classification conditions in `visit` must be written by the learner.

| Component | Status in the starter |
|---|---|
| `Value`, `Instr`, `Program`, and `binary` | Supplied |
| `parse`, `emit`, `constexpr`, `broadcast`, and `call` | Implemented |
| `lower`, `statement`, and `visit` | Implementation required |

The conditions already present in `call` are part of the supplied helper.
They recognize the supported `tl` operations. The conditions in the reference
`visit` belong to the exercise solution and are not present in the starter.

<figure class="lesson-figure">
<a href="/blog/tinytriton-step-1/08-three-methods.svg" target="_blank" rel="noopener">
<picture>
<source data-theme-dark srcset="/blog/tinytriton-step-1/08-three-methods-dark.svg" media="all" />
<img src="/blog/tinytriton-step-1/08-three-methods.svg" alt="Figure 8. Function and statement traversal delegate expression translation to visit" loading="lazy" width="960" height="650" />
</picture>
</a>
<figcaption>Figure 8. Function and statement traversal delegate expression translation to visit. Open the figure to enlarge it.</figcaption>
</figure>

### Four fields define the compilation state

The compiler has no custom constructor. Each call to `lower` initializes fresh
state that the supplied helpers will use.

| Field | Purpose |
|---|---|
| `self.block` | Save the width provided to the compiler |
| `self.program` | Own runtime parameters and emitted instructions |
| `self.body` | Refer to the current instruction list |
| `self.env` | Map source names to Value records |

`self.body = self.program.body` makes both fields refer to one list. Appending
through `self.body` therefore updates the program being constructed. Copying
the list would break this relationship.

### Why a parameter appears in both params and env

The two containers answer different questions. `program.params` describes the
inputs that execution must supply. `env` supports name lookup while translating
the source.

For the parameter `n`, registration creates one Value and stores a reference to
it in both containers.

```python
parameter = Value("n", "int")
self.program.params.append(parameter)
self.env["n"] = parameter

assert self.program.params[-1] is self.env["n"]
```

This example assumes the state fields have been initialized. The assertion
shows that both entries refer to the same object. No integer data is copied,
and the compiler still does not know the runtime value of `n`.

After registering all runtime parameters, the state has the following form.

```text
program.params = [Value("x", "ptr"), Value("y", "ptr"),
                  Value("out", "ptr"), Value("n", "int")]

env = {"x": the Value for x,
       "y": the Value for y,
       "out": the Value for out,
       "n": the Value for n}

self.block = 4
```

<figure class="lesson-figure">
<a href="/blog/tinytriton-step-1/07-params-and-env.svg" target="_blank" rel="noopener">
<picture>
<source data-theme-dark srcset="/blog/tinytriton-step-1/07-params-and-env-dark.svg" media="all" />
<img src="/blog/tinytriton-step-1/07-params-and-env.svg" alt="Figure 7. The parameter list and environment reference the same Value" loading="lazy" width="960" height="660" />
</picture>
</a>
<figcaption>Figure 7. The parameter list and environment reference the same Value. Open the figure to enlarge it.</figcaption>
</figure>

When translating `offsets < n`, `visit` uses `env["n"]` to find the input Value.
Later assignments add names such as `offsets`, `mask`, and `a` to `env`, but
those names do not become runtime parameters. They refer to intermediate results
computed by the program itself.

### Contracts of the supplied helpers

| Helper | Contract |
|---|---|
| `parse(text)` | Return a function AST from a source string |
| `emit(op, args, kind, shape, **attrs)` | Append an instruction and return its result Value |
| `constexpr(node)` | Resolve a literal or the supported name `BLOCK` |
| `broadcast(*values)` | Determine the shape of an elementwise result |
| `call(name, args, keywords)` | Translate a supported `tl` call from AST arguments |

`emit` creates a Value, appends its defining instruction, and returns that Value.
It does not execute the recorded operation. `broadcast` computes a shape rather
than copying actual data.

`call` receives syntax nodes rather than translated Values. It decides which
arguments need recursive translation and which require a known compilation
value. For example, `load` visits its pointer expression, while `arange` resolves
its endpoints through `constexpr`.

Separate methods provide extension points for later lessons. The `binary`
dictionary maps the supported AST operator classes to instruction names.
Neither the dictionary nor the helpers need redesigning for this exercise.

## 8. Translate expressions and bind names

The visitor has five cases because the kernel uses five expression forms.
Its length reflects the number of supported forms rather than one long
sequence of operations.

| Expression form | Example | Required action |
|---|---|---|
| `Name` | `n`, `offsets`, `BLOCK` | Find an existing Value or resolve the compilation constant |
| `Constant` | `0.0` | Emit a constant instruction |
| `BinOp` | `a + b` | Visit both inputs and emit the operation |
| `Compare` | `offsets < n` | Visit both inputs and emit a Boolean comparison |
| `Call` | `tl.load(...)` | Delegate to the supplied call helper |

### Follow a name through the visitor

For `n`, the visitor finds an entry in `env` and returns the registered input
Value. For `offsets`, it returns the Value bound by an earlier assignment.
For `BLOCK`, no entry exists in `env`, so it calls `constexpr` and emits a
constant with the returned number.

The fallback is intentionally narrow. An unknown name is passed to the resolver,
which rejects names other than `BLOCK`. The fallback does not make every unknown
variable a compilation constant.

### Follow an arithmetic expression recursively

For `a + b * 2`, the visitor first obtains the Value for `a`. It then visits the
nested multiplication, obtains `b`, emits the constant two, and emits the
multiplication. Only then can it emit the outer addition.

```text
visit(a + b * 2)
    visit(a)          returns the existing Value for a
    visit(b * 2)
        visit(b)      returns the existing Value for b
        visit(2)      emits const and returns %0
        emit mul      returns %1
    emit add          returns %2
```

<figure class="lesson-figure">
<a href="/blog/tinytriton-step-1/09-recursive-visit.svg" target="_blank" rel="noopener">
<picture>
<source data-theme-dark srcset="/blog/tinytriton-step-1/09-recursive-visit-dark.svg" media="all" />
<img src="/blog/tinytriton-step-1/09-recursive-visit.svg" alt="Figure 9. Recursive translation defines inputs before operations that use them" loading="lazy" width="960" height="590" />
</picture>
</a>
<figcaption>Figure 9. Recursive translation defines inputs before operations that use them. Open the figure to enlarge it.</figcaption>
</figure>

A visitor call can both append instructions and return a Value. The returned
Value describes the expression's result. It does not contain a computed number.
A simple name lookup may return an existing Value without appending anything.

Numeric addition and pointer addition have different meanings. The latter is
recorded as `addptr`. The supported pointer form has a pointer on the left and
an integer offset on the right. A comparison produces Boolean elements, and
broadcasting determines whether the result is a scalar or a tile.

### Assignment connects source names to results

After translating an assignment's right side, `statement` stores the result in
`env` under the target name. Translating the first kernel statement produces
five instructions and one name binding.

```text
%0 = program_id(axis=0)
%1 = const(value=4)
%2 = mul(%0, %1)
%3 = arange(start=0, end=4)
%4 = add(%2, %3)

env["offsets"] = the Value for %4
```

<figure class="lesson-figure">
<a href="/blog/tinytriton-step-1/10-first-line.svg" target="_blank" rel="noopener">
<picture>
<source data-theme-dark srcset="/blog/tinytriton-step-1/10-first-line-dark.svg" media="all" />
<img src="/blog/tinytriton-step-1/10-first-line.svg" alt="Figure 10. Five instructions describe the first statement without computing its data" loading="lazy" width="960" height="650" />
</picture>
</a>
<figcaption>Figure 10. Five instructions describe the first statement without computing its data. Open the figure to enlarge it.</figcaption>
</figure>

`%2` is a scalar, while `%3` and `%4` have shape `(4,)`. No program ID has been
chosen during lowering, so the compiler does not know the actual contents of
`%4`. When program 1 executes, these instructions produce `[4,5,6,7]`.

The number four appears in two roles. Multiplication uses it as an IR operand
introduced by `const`. The range operation stores it directly as its end
attribute. Both representations refer to the same known compilation choice.

<a id="reference-implementation"></a>

## 9. The complete exercise implementation

<div class="lesson-note">
<p><strong>Implementation scope</strong></p>
<p>Replace only lower, statement, and visit inside the existing Compiler class. The reference below includes the full logic of all three methods. The starter does not supply their conditions or branches.</p>
</div>

The following three methods are taken from the companion repository's
[reference implementation](https://github.com/guoriyue/TinyTriton/blob/main/solutions/step01.py).
Replace the corresponding methods inside `Compiler` in `problems/step01.py`.
The four spaces before each method definition are the indentation required
inside the class. Keep the supplied records and helper methods in place.

This implementation supports the documented kernel subset. It is not a general
Python compiler. Loads require explicit `mask` and `other` arguments, and stores
require `mask`. The comparison case handles a single less than comparison.

### Initialize state and register runtime inputs

`lower` saves the width, creates the output program, and registers parameters
whose annotation is not `tl.constexpr`. It then processes statements in source
order and returns the program.

```python
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
```

### Translate statements

An assignment translates its right side before binding the result to its target
name. A standalone expression is visited without introducing a name. In the
supplied kernel, the standalone expression is the store call.

```python
    def statement(self, node):
        if isinstance(node, ast.Assign):
            # Translate the right-hand expression before binding its name.
            value = self.visit(node.value)
            target_name = node.targets[0].id
            self.env[target_name] = value
        else:
            self.visit(node.value)  # a bare tl.store(...)
```

### Translate expressions

`visit` distinguishes names, literals, arithmetic, comparison, and calls. Each
operation is emitted only after the Values for its inputs have been obtained.
A store returns `None` through the call helper because it produces no result.

```python
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
```

The three methods operate at different syntactic levels. `lower` handles the
function, `statement` handles each statement, and `visit` handles the expressions
inside it. The supplied `call` and `emit` helpers complete the translation.
