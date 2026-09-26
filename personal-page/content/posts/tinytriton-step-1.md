---
title: TinyTriton, Step 1: From source code to instructions
date: 2026-09-26
description: Build your first compiler representation in Python. Learn syntax trees, instructions, tiles, and compile-time constants before implementing the exercise.
---

[Series overview](https://guoriyue.github.io/blog/tinytriton-series/) · Lesson 1 of 15

A compiler turns one description of a computation into another. Before it can
choose GPU instructions or make a program faster, it needs to understand what
operations the source asks for and how those operations depend on each other.

In this lesson, we will turn a small array-addition program into a list of
instructions. You need basic Python: functions, lists, dictionaries, and classes.
You do not need a GPU, LLVM, Triton, or previous compiler knowledge.

By the end, you should be able to explain the difference between parsing and
lowering, describe a value without knowing its contents, and connect an expression
to the instructions needed to compute it.

## 1. Describe a calculation before running it

Consider this expression:

```python
answer = (a + b) * 2
```

Executing it requires numbers for `a` and `b`. Describing it does not. We can write
down the work in order:

```text
%0 = add(a, b)
%1 = const(value=2)
%2 = mul(%0, %1)
```

Each line is an **instruction**: a record of one operation. `add` is the operation
name; `a` and `b` are its **operands**, meaning inputs. `%0` names the result. The
percent sign is just part of a label here, not Python's remainder operator.
`const` introduces a known number so other instructions can refer to it.

This list is an **intermediate representation**, or **IR**. It sits between the
source language and the code we will eventually execute. Creating the list does
not perform addition or multiplication. It preserves the recipe.

The source name `answer` refers to `%2`. A dictionary can remember that association.
Assignment itself does not require another arithmetic operation.

**Pause and predict:** for `answer = a + b * 2`, what must be represented before
the final addition? Why is that a different dependency structure?

<details>
<summary>Check your reasoning</summary>

The multiplication uses `b` and the constant `2`; the addition then uses `a` and
the multiplication's result. Parentheses changed which operation depends on which.
Neither translation needs actual numbers for `a` or `b`.

</details>

## 2. Let Python read the syntax

We could write a parser to recognize names, parentheses, and operators. Python
already provides one in its standard-library `ast` module. **AST** stands for
**abstract syntax tree**: a tree that records the structure of source code.

This experiment runs in an ordinary Python session:

```python
import ast

assignment = ast.parse("answer = a + b * 2").body[0]
print(type(assignment).__name__)
print(type(assignment.value).__name__)
print(type(assignment.value.op).__name__)
print(type(assignment.value.right.op).__name__)
```

It prints:

```text
Assign
BinOp
Add
Mult
```

`Assign` describes an assignment. Its `.value` is the expression on the right.
`BinOp` means an operation with two inputs; `.left`, `.right`, and `.op` describe
those inputs and the operator. Here the right input of the addition is itself a
multiplication.

The tree groups syntax; our instruction list names intermediate results and makes
execution dependencies explicit. Translating the tree into that list is called
**lowering**. We will walk from the leaves outward: first names and literals,
then operations that use them. Visiting smaller expressions in the same way is
**recursion**.

## 3. The small language we will compile

Our input is a string containing a function:

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

This is a teaching language using Python syntax. `ast.parse(source)` reads the
string without executing it or evaluating its annotations. You do not need to
import `tl` or define `ptr` to parse it. Our compiler gives those spellings meaning.

The calculation is array addition: `out[i] = x[i] + y[i]`. Instead of describing
one element at a time, the function describes a **tile**: a small group of elements
processed together. `BLOCK` is the tile width. A **program instance** handles one
tile; its program ID identifies that tile. We have not assigned work to hardware
threads yet. A tile position is sometimes called a **lane**; it is not necessarily
one GPU thread.

| Source operation | Meaning in this lesson |
|---|---|
| `tl.program_id(0)` | Which program instance is this, along the one dimension we use? |
| `tl.arange(0, BLOCK)` | Integer positions from zero up to, but excluding, `BLOCK` |
| `x + offsets` | Addresses of elements at those offsets from the start of `x` |
| `offsets < n` | A Boolean value for each position: is it inside the input? |
| `tl.load(..., mask=mask, other=0.0)` | Read valid positions; use zero for invalid ones |
| `tl.store(..., mask=mask)` | Write only valid positions |

A **pointer** is a reference to a location in memory. `ptr` says the parameter
points to 32-bit floating-point elements. Pointer addition counts **elements**:
`x + 2` means the address two elements after `x`, not adding two to the stored
numbers. A load turns an address into a value; a store writes a value to an address.

Take `BLOCK=4` and `n=6`. Program instance 0 describes offsets `[0, 1, 2, 3]`.
Instance 1 describes `[4, 5, 6, 7]`, with mask `[True, True, False, False]`.
Only its first two positions may access the arrays. A mask is how the last tile
handles an input length that is not a multiple of the tile width.

Multiplying the scalar program ID by four gives one number. Adding that number
to `[0, 1, 2, 3]` reuses it at every position. This is **broadcasting**.

At this stage, we record these operations. Their execution comes in the next lesson.

## 4. Why `BLOCK: tl.constexpr` is different

There are two moments when information can become available:

| Information | When our compiler receives it |
|---|---|
| Tile width `BLOCK` | While compiling |
| Array addresses and input length `n` | When the compiled program runs |
| Array contents | When the running program reads memory |

A **compile-time constant** is known while compiling. A **runtime input** is
supplied for execution. `constexpr` abbreviates “constant expression.” In this
language, `tl.constexpr` marks a parameter whose value the compiler must already
know. It is a marker, not the value itself, and not a Python keyword.

The compiler's caller supplies the actual number:

```python
# API example: this works after you implement lower.
function = compiler.parse(source)
program = compiler.lower(function, block=4)
```

This creates a program specialized for width four. It still needs `x`, `y`, `out`,
and `n` at runtime, but not another `BLOCK` argument. Changing the array contents
does not require lowering again; changing the tile width does.

These are language rules we are choosing, not conventions you are expected to
infer from a reference solution.

## 5. Inspect the function before writing the compiler

Using `source` from above, run:

```python
function = ast.parse(source).body[0]
print(type(function).__name__, function.name)
for parameter in function.args.args:
    print(parameter.arg, ast.unparse(parameter.annotation))
```

Expected output:

```text
FunctionDef vector_add
x ptr
y ptr
out ptr
n int
BLOCK tl.constexpr
```

Keep this small reference beside the exercise:

| Python AST field | What it contains |
|---|---|
| `function.name` | The function name as a string |
| `function.args` | An object grouping parameter lists |
| `function.args.args` | The list of ordinary parameters used here |
| `parameter.arg` | A parameter's name, such as `"BLOCK"` |
| `parameter.annotation` | Syntax describing its annotation |
| `ast.unparse(parameter.annotation)` | The annotation rendered as source text |
| `function.body` | Statements in source order |

The repeated `.args.args` comes from two nested objects. It is an interface to
look up, not a compiler concept to memorize. All parameters in our sample are
annotated; this exercise does not implement general Python parameter handling.

## 6. Three records for the output

The starter already defines three Python dataclasses. A **dataclass** is a class
for storing named fields; Python generates its constructor and printable
representation. You do not need to invent these records yourself.

| Record | What it describes | Fields |
|---|---|---|
| `Value` | An input or an operation's result | `name`, `kind`, `shape` |
| `Instr` | One instruction; `Instr` abbreviates **instruction** | `result`, `op`, `args`, `attrs` |
| `Program` | The translated function | `name`, `params`, `body` |

`Value("x", "ptr")` describes a pointer parameter. It does not contain an array.
`Value("sample", "float", (4,))` describes four floating-point values without
knowing their contents. The shape `()` means a scalar; `(4,)` means one dimension
of length four. The comma makes it a Python tuple.

An instruction's `args` are `Value` records, referring to parameters or earlier
results. Its `attrs` are attributes: ordinary Python data already known, such as
`{"value": 2}` or `{"start": 0, "end": 4}`. A store changes memory but produces
no result, so its `result` is `None`.

Run this from the repository root, even before filling in the TODOs:

```python
from problems.step01 import Value, Instr, Program

left = Value("left", "int")
right = Value("right", "int")
sum_value = Value("sum", "int")
instruction = Instr(sum_value, "add", (left, right))
program = Program("example", [left, right], [instruction])
print(program)
```

You have constructed a program containing one addition. No numbers were added.
The class name `Instr` and a variable name such as `instr` both refer to this
notion of a recorded instruction; neither is a special Python keyword.

## 7. The exercise interface

Clone the [companion repository](https://github.com/guoriyue/TinyTriton), which
currently contains only Step 1. With Python 3.10 or newer, run:

```bash
git clone https://github.com/guoriyue/TinyTriton.git
cd TinyTriton
python -m venv .venv
source .venv/bin/activate
python -m pip install -e '.[dev]'
tinytriton check step01
```

On Windows, use `.venv\Scripts\activate` to activate the environment.
The unfinished starter raises `NotImplementedError`. That means you have reached
the exercise. No GPU setup is involved.

Open [problems/step01.py](https://github.com/guoriyue/TinyTriton/blob/main/problems/step01.py). You implement three methods:

| Method | Responsibility |
|---|---|
| `lower(function, block)` | Create fresh compilation state, describe runtime parameters, translate the body, return a `Program` |
| `statement(node)` | Handle assignment or a standalone call; remember assignment names |
| `visit(node)` | Translate an expression and return its `Value`; a store has no result |

The compiler has no custom constructor. `lower` initializes these four fields
for each compilation. They are an explicit contract with the supplied helpers:

| Field | Meaning |
|---|---|
| `self.block` | The integer provided by the caller; used to resolve `BLOCK` |
| `self.program` | A new `Program` owning runtime parameters and instructions |
| `self.body` | The same list as `self.program.body`; helpers append instructions here |
| `self.env` | A fresh dictionary mapping source names to `Value` records |

`env` abbreviates **environment**, here a name lookup table. It contains descriptions,
not runtime array contents. Runtime parameters appear in both the parameter list
and this lookup table. `BLOCK` is resolved through `self.block` instead.

`self.body = self.program.body` shares one list. Copying the list would mean the
helpers append somewhere different from the program you return. The name lookup
and instruction list must also be fresh for every compilation.

The starter supplies these helpers:

| Helper | Contract |
|---|---|
| `parse(text)` | Source string → function AST |
| `emit(op, args, kind, shape, **attrs)` | Append an instruction and return its result `Value` |
| `constexpr(node)` | Literal or `BLOCK` syntax → known Python number |
| `broadcast(*values)` | Determine a scalar or tile result shape |
| `call(name, args, keywords)` | Translate one supported `tl` call from its AST arguments |

For `call`, pass syntax nodes, not already translated values. Its arguments are
the operation name, a list of positional AST arguments, and a dictionary mapping
keyword names to AST expressions. The helper translates those expressions itself.
`**attrs` collects named arguments into a dictionary; `*values` accepts a varying
number of arguments.

The shared `body` field and separate traversal/helper methods leave room for
later lessons to extend the compiler without rewriting everything. The `binary`
dictionary in the starter is just the supported mapping from Python operator
classes to instruction names, not a general registry you need to expand now.

## 8. Build from leaves to expressions

Start with names and constants. A name refers to a parameter, a previously bound
result, or the compile-time `BLOCK`. A literal introduces a constant instruction.
An unknown name should remain an error: a typo must not silently become `BLOCK`.

Then handle arithmetic and comparison. Translate both inputs before recording
the operation that uses them. Numeric addition and pointer-plus-offset have
different meanings, so the IR calls the latter `addptr`. Floating-point arithmetic
produces a float; `<` produces a Boolean; scalar/tile shapes follow broadcasting.
The supported pointer form is pointer plus integer offset.

These are the AST fields you will need:

| Node | Fields |
|---|---|
| `Name` | `id`: the source spelling |
| `Constant` | `value`: the literal number |
| `BinOp` | `left`, `right`, `op` |
| `Compare` | `left`, `comparators[0]`, `ops[0]` for our single comparison |
| `Call` | `func`, `args`, `keywords`; for `tl.load`, `func.attr` is `"load"` |
| `Assign` | `targets[0].id`: destination name; `value`: right-hand expression |
| `Expr` | `value`: a standalone expression, such as the store call |

Each call keyword has `.arg` for its name and `.value` for its expression.
`isinstance(node, ast.Name)` identifies a node class. `type(node.op)` identifies
an operator class such as `ast.Add`.

After translating an assignment's right side, bind its result to the source
name. A standalone store has no name to bind. Finally, connect these pieces in
`lower`: register runtime inputs and visit the function's statements in order.

The supported subset is deliberately small: the sample's annotated parameters,
numeric literals, names, simple assignments, `+`, `*`, a single `<`, and its four
`tl` operations. It does not compile arbitrary Python or validate every malformed
program. In particular, loads have explicit `mask` and `other`; stores have `mask`.

## 9. Inspect your result

After implementing the TODOs, run:

```bash
tinytriton check step01
```

To inspect what you produced:

```python
from problems.step01 import Compiler
from tinytriton import kernels

compiler = Compiler()
program = compiler.lower(compiler.parse(kernels.vector_add), block=4)
print(program.params)
for instruction in program.body:
    print(instruction)
```

Check these properties before comparing with another implementation:

- Runtime parameters are `x`, `y`, `out`, and `n`; the tile width is already fixed.
- Every operand refers to a parameter or a result defined earlier.
- The range has four elements. Adding the scalar program offset keeps that shape.
- Comparing offsets with `n` produces four Booleans.
- Loads produce floating-point tiles; the final store has no result.

The automated checks cover these representation contracts, expression dependencies,
fresh compilation state, and misspelled names. They do **not** execute the IR on
arrays or prove that every possible input is handled. That is the next lesson's
job.

| If you see… | Check… |
|---|---|
| `NotImplementedError` | Whether the named TODO is implemented |
| Missing `block`, `body`, or `env` | Initialization before visiting statements |
| `KeyError: BLOCK` | Compile-time name resolution, separate from runtime inputs |
| A literal where an operand should be | Constants have result `Value` records too |
| An empty returned body | Whether the helpers append to the program's actual list |

**Try a new case:** specialize for `BLOCK=8` while the runtime input length is
six. Which shapes change? Which parameters remain? Sketch the first program's
mask, and explain why lowering does not need to know `n` to describe that mask.

<details>
<summary>Compare after attempting the exercise</summary>

Read [solutions/step01.py](https://github.com/guoriyue/TinyTriton/blob/main/solutions/step01.py), then run:

```bash
tinytriton check step01 --solution
```

Compare the meaning of the records and dependencies. Temporary names need not
match. The reference is one implementation of the contracts introduced above.

</details>

We now have a description of array addition that another program can inspect.
In Step 2, we will write an interpreter: a program that follows these instructions
and computes actual values. That lesson will be published separately.
