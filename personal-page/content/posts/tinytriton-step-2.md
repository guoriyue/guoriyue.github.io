---
title: Step 2. Execute the instructions on the CPU
date: 2026-10-16
description: Build a NumPy interpreter for tile IR. Connect descriptions to runtime values and explain pointer arithmetic, parameter binding, masked loads, and stores.
label: AI Systems
series: TinyTriton
part: 2
---

[Series overview](/blog/tinytriton-series/) · Lesson 2 of 15 · [Previous lesson](/blog/tinytriton-step-1/)

The first lesson constructed a description of a computation. This lesson gives
that description an execution meaning. We will read the existing IR and use
NumPy to perform each recorded operation on the CPU.

The interpreter has two responsibilities. It associates IR names with actual
runtime values, then evaluates instructions in dependency order. A store has a
side effect on memory rather than a result that another instruction can use.

The input language and IR records remain unchanged. No GPU is needed. The CPU
interpreter will also provide a reference when later lessons generate GPU code.

## 1. Separate a value description from its contents

Consider the IR result that the first lesson called `%4`.

```python
Value("%4", "int", (4,))
```

The record describes four integers but contains none of those integers. During
execution of program 1 with `BLOCK=4`, the corresponding contents will be a
NumPy array containing `[4,5,6,7]`.

The interpreter therefore needs another dictionary. The first lesson's `env`
connects source names to IR descriptions. The new `values` dictionary connects
IR names to actual runtime contents.

| Table | Lookup | Meaning |
|---|---|---|
| `self.env` | `env["offsets"]` | The Value describing `%4` |
| `self.values` | `values["%4"]` | The actual array of offsets |
| `self.arguments` | `arguments["x"]` | The array supplied for this invocation |

The Value's `name` field connects the first two tables. Lowering uses source
names to construct instructions. Execution uses IR names to find the contents
that those instructions require.

<figure class="lesson-figure">
<a href="/blog/tinytriton-step-2/01-descriptions-and-values.svg" target="_blank" rel="noopener">
<picture>
<source data-theme-dark srcset="/blog/tinytriton-step-2/01-descriptions-and-values-dark.svg" media="all" />
<img src="/blog/tinytriton-step-2/01-descriptions-and-values.svg" alt="Figure 1. IR names connect descriptions to runtime contents" loading="lazy" width="960" height="590" />
</picture>
</a>
<figcaption>Figure 1. IR names connect descriptions to runtime contents. Open the figure to enlarge it.</figcaption>
</figure>

## 2. Distinguish pointer arithmetic from array arithmetic

Suppose a NumPy array contains three numbers.

```python
import numpy as np

x = np.array([10, 20, 30])
print(x + 1)
```

The result is `[11,21,31]`. NumPy performs numeric addition at each position and
produces a new array. It does not express moving from the first element to the
second element while leaving the stored numbers unchanged.

Pointer arithmetic describes that change of location. Our interpreter represents
a pointer using a pair of an array name and an element index.

```python
arguments = {"x": np.array([10, 20, 30])}
pointer = ("x", 0)

base, index = pointer
advanced = (base, index + 1)

base, index = advanced
print(arguments[base][index])  # 20
```

The pair `("x", 1)` refers to the second element of the array stored under `"x"`.
It does not contain the number 20. Reading the array at that location obtains 20.

An array is suitable for storing the data. The additional pointer representation
lets the interpreter distinguish changing a location from changing a numeric
value. This pair is a convention of the exercise rather than a universal
requirement for interpreters.

<figure class="lesson-figure">
<a href="/blog/tinytriton-step-2/02-pointer-and-data.svg" target="_blank" rel="noopener">
<picture>
<source data-theme-dark srcset="/blog/tinytriton-step-2/02-pointer-and-data-dark.svg" media="all" />
<img src="/blog/tinytriton-step-2/02-pointer-and-data.svg" alt="Figure 2. Moving a pointer changes a location rather than stored numbers" loading="lazy" width="960" height="610" />
</picture>
</a>
<figcaption>Figure 2. Moving a pointer changes a location rather than stored numbers. Open the figure to enlarge it.</figcaption>
</figure>

For a tile, the index can itself be an array. The pointer
`("x", np.array([4,5,6,7]))` describes four candidate element locations.
The base remains `"x"` while address arithmetic changes the indices.

## 3. Bind inputs to one invocation

The interpreter receives the `Program` produced by `lower`, an argument
dictionary containing actual arrays and numbers, and an integer grid size.
The sample invocation uses six valid elements and eight output slots.

```python
x = np.arange(6, dtype=np.float32)
y = np.full(6, 10, dtype=np.float32)
out = np.full(8, -99, dtype=np.float32)
arguments = {"x": x, "y": y, "out": out, "n": 6}
```

Step 1 describes `x` with `Value("x", "ptr")`. Step 2 binds that declaration to
its runtime representation by setting `values["x"]` to `("x", 0)`. The actual
array stays in `arguments["x"]`.

Scalar parameters need no location representation. The input `n` is bound
directly to the supplied integer six.

| Parameter description | Entry in the runtime value table |
|---|---|
| `Value("x", "ptr")` | `"x"` maps to `("x", 0)` |
| `Value("y", "ptr")` | `"y"` maps to `("y", 0)` |
| `Value("out", "ptr")` | `"out"` maps to `("out", 0)` |
| `Value("n", "int")` | `"n"` maps to `6` |

`BLOCK` is not another runtime parameter. The earlier call to
`lower(function, block=4)` already recorded the required constant in the IR.
The interpreter executes that constant instruction without consulting the
source annotation or resolving `BLOCK` again.

<figure class="lesson-figure">
<a href="/blog/tinytriton-step-2/03-runtime-binding.svg" target="_blank" rel="noopener">
<picture>
<source data-theme-dark srcset="/blog/tinytriton-step-2/03-runtime-binding-dark.svg" media="all" />
<img src="/blog/tinytriton-step-2/03-runtime-binding.svg" alt="Figure 3. Pointer inputs and scalar inputs have different runtime representations" loading="lazy" width="960" height="650" />
</picture>
</a>
<figcaption>Figure 3. Pointer inputs and scalar inputs have different runtime representations. Open the figure to enlarge it.</figcaption>
</figure>

The compiler caller can know both the array length and the chosen width. The
important distinction is which values are passed into lowering and which are
passed into execution. Lowering received the width but did not receive these
arrays or this invocation's length.

## 4. Run the same IR for each program instance

With `n=6` and `BLOCK=4`, two program instances cover the input. Program 0 has
offsets `[0,1,2,3]`. Program 1 has offsets `[4,5,6,7]`.

The supplied `run` method loops over integer program IDs and executes the same
IR for each one.

```python
    def run(self, program, arguments, grid):
        for program_id in range(grid):
            self.execute(program, arguments, program_id)
```

Each call to `execute` creates a fresh runtime value table. The arrays in
`arguments` remain shared, so the two programs can write different positions
of the same output array. This CPU execution is sequential. It does not model
GPU scheduling or introduce threads.

<figure class="lesson-figure">
<a href="/blog/tinytriton-step-2/04-program-instances.svg" target="_blank" rel="noopener">
<picture>
<source data-theme-dark srcset="/blog/tinytriton-step-2/04-program-instances-dark.svg" media="all" />
<img src="/blog/tinytriton-step-2/04-program-instances.svg" alt="Figure 4. Programs share arrays and keep separate intermediate values" loading="lazy" width="960" height="650" />
</picture>
</a>
<figcaption>Figure 4. Programs share arrays and keep separate intermediate values. Open the figure to enlarge it.</figcaption>
</figure>

`run` returns no output array. The invocation's result is the change made to the
supplied `out` array. After both programs execute, its first six entries should
contain `[10,11,12,13,14,15]`. The remaining two entries should still contain `-99`.

## 5. Execute instructions through name lookup

The exercise is in
[problems/step02.py](https://github.com/guoriyue/TinyTriton/blob/main/problems/step02.py).
Its compiler inherits the first lesson's compiler. The `run` method is supplied.
The implementations of `execute` and `evaluate` are left as TODOs, including
their loops and conditions.

| Method | Responsibility |
|---|---|
| `run` | Execute all program instances |
| `execute` | Bind inputs and traverse one instance's instructions |
| `evaluate` | Perform one operation on actual runtime operands |

At the start of `execute`, initialize three fields.

| Field | Contents |
|---|---|
| `self.arguments` | The invocation's actual arrays and numbers |
| `self.program_id` | The current instance's integer ID |
| `self.values` | A fresh mapping from IR names to runtime contents |

After binding parameters, traverse `program.body`. Each instruction's `args`
contain Value descriptions rather than the actual operands. Lookup converts
those descriptions to their runtime contents.

```python
operands = [self.values[value.name] for value in instr.args]
result = self.evaluate(instr, operands)
```

For `%2 = mul(%0, %1)`, the inputs are Values named `%0` and `%1`. If the value
table associates them with 1 and 4, the operand list is `[1,4]`. Evaluation
returns 4, which is then stored under the result name `%2`.

<figure class="lesson-figure">
<a href="/blog/tinytriton-step-2/05-execute-one-instruction.svg" target="_blank" rel="noopener">
<picture>
<source data-theme-dark srcset="/blog/tinytriton-step-2/05-execute-one-instruction-dark.svg" media="all" />
<img src="/blog/tinytriton-step-2/05-execute-one-instruction.svg" alt="Figure 5. Operand lookup precedes operation evaluation and result binding" loading="lazy" width="960" height="650" />
</picture>
</a>
<figcaption>Figure 5. Operand lookup precedes operation evaluation and result binding. Open the figure to enlarge it.</figcaption>
</figure>

An instruction with `result=None` has no result name to bind. The store handler
has already modified memory, so traversal does not add an entry for it.
Keeping lookup in `execute` allows `evaluate` to work with actual operands and
lets later lessons add operations independently of traversal.

## 6. Give each operation an execution meaning

The evaluator receives an `Instr` and a list of runtime operands. The reference
implementation names that list `a`. This local parameter is unrelated to the
kernel's source variable named `a`.

| Operation | Runtime meaning |
|---|---|
| `const` | Return the value stored in the instruction's attributes |
| `program_id` | Return the current instance ID |
| `arange` | Create a NumPy array from the recorded start and end |
| `add` | Add the two actual operands |
| `mul` | Multiply the two actual operands |
| `lt` | Compare the two operands elementwise |
| `addptr` | Preserve the array name and advance its element index |
| `load` | Return data with the required mask and fallback behavior |
| `store` | Write only the selected positions |

NumPy supplies broadcasting for arithmetic. Adding the scalar four to
`np.array([0,1,2,3])` produces `[4,5,6,7]`. Comparing that array with six produces
`[True,True,False,False]`.

Pointer addition needs a separate case because its left operand is a pair.

```python
(base, index), offset = a
return base, index + offset
```

For operands `[("x", 0), np.array([4,5,6,7])]`, unpacking gives the base `"x"`,
the index zero, and the tile offset array. The result is a pair containing
`"x"` and the indices `[4,5,6,7]`. No memory is read by this operation.

## 7. Apply the mask before reading memory

A six element array has no positions six or seven. A masked load must avoid
reading those target addresses. Replacing results after a read is too late.

The following expression is therefore incorrect when the index array contains
out of range positions.

```python
np.where(mask, memory[index], other)
```

Python evaluates `memory[index]` before calling `np.where`. The array access
raises an `IndexError` before selection can occur. `np.where` is not a lazy
conditional that defers evaluating one of its inputs.

The reference implementation instead uses two selections.

```python
safe_index = np.where(mask, index, 0)
loaded = memory[safe_index]
result = np.where(mask, loaded, other)
```

The first selection replaces inactive indices with zero. The second selection
replaces their temporary read values with the fallback. For a nonzero fallback
and an array whose first value is 100, these steps are visibly different.

<figure class="lesson-figure">
<a href="/blog/tinytriton-step-2/06-safe-masked-load.svg" target="_blank" rel="noopener">
<picture>
<source data-theme-dark srcset="/blog/tinytriton-step-2/06-safe-masked-load-dark.svg" media="all" />
<img src="/blog/tinytriton-step-2/06-safe-masked-load.svg" alt="Figure 6. Safe indexing precedes data selection for a masked load" loading="lazy" width="960" height="680" />
</picture>
</a>
<figcaption>Figure 6. Safe indexing precedes data selection for a masked load. Open the figure to enlarge it.</figcaption>
</figure>

The example uses fallback seven to distinguish the returned fallback from the
value at index zero. The vector addition kernel itself uses fallback zero.

This implementation avoids invalid target reads but performs a safe substitute
read at index zero for inactive positions. It should not be described as
performing no read of any kind for those positions. It also assumes that the
backing array has an element at index zero whenever a load instruction executes.
Launching a program that loads from an empty array is outside this reference
implementation's supported cases.

`memory = self.arguments[base].reshape(-1)` provides a flat view of the sample
arrays. The lesson uses ordinary contiguous NumPy arrays. General handling of
arbitrary strided arrays would require additional care because reshaping can
produce a copy rather than a view.

## 8. Store only the selected positions

The store handler selects both the destination indices and the values before
assigning them to memory.

```python
self.arguments[base].reshape(-1)[index[mask]] = value[mask]
```

For program 1, `index[mask]` is `[4,5]` and `value[mask]` is `[14,15]`. The
assignment therefore writes only `out[4]` and `out[5]`.

<figure class="lesson-figure">
<a href="/blog/tinytriton-step-2/07-masked-store.svg" target="_blank" rel="noopener">
<picture>
<source data-theme-dark srcset="/blog/tinytriton-step-2/07-masked-store-dark.svg" media="all" />
<img src="/blog/tinytriton-step-2/07-masked-store.svg" alt="Figure 7. Inactive output positions retain their previous contents" loading="lazy" width="960" height="620" />
</picture>
</a>
<figcaption>Figure 7. Inactive output positions retain their previous contents. Open the figure to enlarge it.</figcaption>
</figure>

The fallback behavior of a load does not authorize a later store to write
inactive positions. Although the computed result tile ends with two zeros,
the output array's last two entries remain `-99`.

A store returns `None` because its effect is the memory update. The outer
instruction loop sees that there is no result Value and skips result binding.

## 9. The complete exercise implementation

Replace the two methods inside the existing `Compiler` class. Keep the supplied
`run` method and the first lesson's implementation. The following code matches
the companion repository's
[reference implementation](https://github.com/guoriyue/TinyTriton/blob/main/solutions/step02.py).
The indentation shown is the class indentation.

### Bind inputs and execute one program

```python
    def execute(self, program, arguments, program_id):
        # Runtime state is separate from the frontend's source-name table.
        self.arguments = arguments
        self.program_id = program_id
        self.values = {}
        for parameter in program.params:
            if parameter.kind == "ptr":
                # Keep the array name and element offset; addptr updates the
                # offset, and load/store find the array in self.arguments.
                value = (parameter.name, 0)
            else:
                value = arguments[parameter.name]
            self.values[parameter.name] = value

        for instr in program.body:
            operands = [self.values[value.name] for value in instr.args]
            result = self.evaluate(instr, operands)
            if instr.result is not None:  # stores change memory, with no result
                self.values[instr.result.name] = result
```

### Evaluate one operation

```python
    def evaluate(self, instr, a):
        """The value of one instruction, given the values of its arguments."""
        op = instr.op
        if op == "const":
            return instr.attrs["value"]
        if op == "program_id":
            return self.program_id
        if op == "arange":
            return np.arange(instr.attrs["start"], instr.attrs["end"])
        if op == "add":
            return a[0] + a[1]
        if op == "mul":
            return a[0] * a[1]
        if op == "lt":
            return a[0] < a[1]
        if op == "addptr":
            (base, index), offset = a
            return base, index + offset
        if op == "load":
            (base, index), mask, other = a
            memory = self.arguments[base].reshape(-1)
            # Inactive lanes read index 0 instead, then take `other`:
            # the mask must stop the read, not just replace the result.
            return np.where(mask, memory[np.where(mask, index, 0)], other)
        if op == "store":
            (base, index), value, mask = a
            self.arguments[base].reshape(-1)[index[mask]] = value[mask]
            return None
        raise NotImplementedError(op)
```

The final `NotImplementedError` preserves a useful failure for an unsupported
operation. Substituting a guessed value would hide the missing operation and
could silently corrupt later results.

## 10. Check the implementation

Install the published exercise dependencies from the companion repository root.
If the repository is already cloned, pull the update before installing.

```bash
git pull
python -m pip install -e '.[dev]'
tinytriton check step02
```

The check includes the first lesson's contracts because the second lesson
inherits its lowering implementation. An unfinished first lesson can therefore
fail before execution reaches the second lesson's TODOs.

To check the supplied reference instead, use the explicit reference option.

```bash
tinytriton check step02 --solution
```

The cases cover full tiles, partial tiles, nonzero load fallbacks, reused IR with
new invocation arguments, and an entirely inactive program. In each memory
case, invalid target indices must not be read and inactive output positions
must remain unchanged.

<figure class="lesson-figure">
<a href="/blog/tinytriton-step-2/08-one-tile-trace.svg" target="_blank" rel="noopener">
<picture>
<source data-theme-dark srcset="/blog/tinytriton-step-2/08-one-tile-trace-dark.svg" media="all" />
<img src="/blog/tinytriton-step-2/08-one-tile-trace.svg" alt="Figure 8. The final tile writes only its two valid positions" loading="lazy" width="960" height="740" />
</picture>
</a>
<figcaption>Figure 8. The final tile writes only its two valid positions. Open the figure to enlarge it.</figcaption>
</figure>

For the sample invocation, execution produces
`[10,11,12,13,14,15,-99,-99]`. That result follows from the IR's computation and
memory rules. The later GPU implementation must preserve the same result while
changing how the work is distributed and executed.
