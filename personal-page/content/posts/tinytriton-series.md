---
title: TinyTriton: Build a GPU compiler, one step at a time
date: 2026-09-26
description: A fifteen-part series for Python programmers with no compiler background, starting with a small array program and growing toward GPU execution and optimization.
---

How does an array expression become something a GPU can execute? Between writing
`a + b` and running a kernel, somebody has to describe the computation, assign work
to threads, choose instructions, and preserve the result while changing how the
work happens.

This series builds a small compiler so we can study those decisions one at a time.
It is for readers who can write Python but have never taken a compiler course.
We will start with lists, dictionaries, and a small piece of source code. GPU
hardware and compiler frameworks enter when we have a concrete reason to use them.

## What we will build

TinyTriton is an educational compiler for a small Triton-style language. A kernel
in this language describes operations on a **tile**, a group of array elements.
The compiler gradually turns that description into work performed by individual
GPU threads.

The first example adds two arrays. Later examples introduce reductions, matrix
multiplication, and attention. Each example gives us a reason to extend the
language or improve the generated code. This is not the official Triton compiler,
and the initial language deliberately supports only a small subset of Python syntax.

A compiler translates a computation between representations. Our route will be:

```text
Source text
    ↓ Read its syntax
Python syntax tree
    ↓ Describe operations and their dependencies
Tile-level instructions
    ↓ Assign elements to threads
Instructions describing each thread's work
    ↓ Use LLVM to generate NVIDIA PTX
GPU executable
```

An **intermediate representation**, or **IR**, is one of those descriptions between
source and execution. LLVM is an existing compiler infrastructure we will use
later. PTX is NVIDIA's low-level instruction language; an additional assembly step
turns it into GPU machine code. You do not need either tool for the first lesson.

We will also build a CPU interpreter that follows our instructions directly.
It gives us a way to check the computation before introducing GPU execution.

## The planned series

Only the overview and Step 1 are published now. The remaining entries are a
roadmap, not links to completed articles. Each lesson will get its own explanation,
exercise, and reference implementation as it is released.

| Step | Question we will answer | What we will build |
|---|---|---|
| [1. Source to instructions](/blog/tinytriton-step-1/) | How can we describe a calculation without executing it? | A syntax-tree traversal and tile-level IR |
| 2. Interpret the instructions | How do those records become actual array values? | A CPU interpreter with masked memory access |
| 3. Assign work to threads | Which thread handles which element? | A second representation describing thread ownership |
| 4. Reach the GPU | How can our compiler use LLVM? | LLVM generation, PTX compilation, and a kernel launch |
| 5. Shared memory | How do threads combine values? | Reductions using shared storage and synchronization |
| 6. Multiple elements per thread | What happens when a tile is larger than the thread group? | Layouts that assign several elements to each thread |
| 7. Warp shuffles | Can nearby threads exchange values more directly? | Register exchange within a warp |
| 8. Loops | How do values evolve across repeated work? | Loop representation and carried state |
| 9. Two-dimensional tiles | How do we describe matrix multiplication? | Matrix shapes, broadcasting, and tiled products |
| 10. Optimization passes | Which changes preserve a program's meaning? | Constant folding, reuse of pure expressions, and dead-code removal |
| 11. Memory access patterns | When can adjacent accesses be combined? | Analysis of contiguity and alignment |
| 12. Software pipelining | Can we prepare the next iteration's data early? | A dependency-aware loop transformation |
| 13. Tensor cores | How do matrix instructions constrain data placement? | Hardware-specific matrix layouts and operations |
| 14. Attention | How can we combine the pieces into a larger kernel? | A tiled attention computation |
| 15. Measurement | Which changes actually helped? | Correctness checks and controlled benchmarks |

## How to work through a lesson

Read the small example, predict its behavior, then inspect the representation.
Each article introduces new terms and the supplied interfaces before asking you
to implement anything. The exercise gives you supporting code so you can focus on
the new idea. Reference implementations are available after the exercise for
comparison.

Passing a check is evidence about the cases it covers. We will also trace inputs
by hand, inspect intermediate results, and ask what happens when a shape, mask,
or compile-time choice changes. These habits matter when optimizations become
more complicated than the original calculation.

For Step 1, Python 3.10 or newer is enough. You need no GPU or Triton installation.
Later GPU lessons will introduce their toolchain requirements separately.

## Begin with one representation

[Step 1: From source code to instructions](/blog/tinytriton-step-1/) starts with
`answer = (a + b) * 2`, then applies the same idea to tiled array addition. Along
the way, we will explain syntax trees, instructions, pointers, and why
`BLOCK: tl.constexpr` is different from an ordinary runtime parameter.

The [companion repository](https://github.com/guoriyue/TinyTriton) contains the
Step 1 tutorial, exercise, reference implementation, and checks. Steps 2–15 will
be added one at a time as their articles are published. Clone the repository to
start; each new lesson will build on the previous release.
