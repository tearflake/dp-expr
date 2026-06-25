# QDBP-Expressions Informal Outline

**QDBP-Expressions** (QDBP) is a tree notation framework that combines two complementary ways of expressing hierarchical structure:

* **Quested-Depth Expressions (QD)** — hierarchy is perceived through explicit depth levels using visible indentation markers.
* **Boundary-Packed Expressions (BP)** — hierarchy is perceived through explicit subtree boundaries using ordinary S-expressions.

Both notations represent the same underlying tree and may freely coexist within the same source file.

---

# Motivation

Most tree-oriented syntaxes choose one of two approaches:

## Boundary-Oriented

Traditional S-expressions encode structure using explicit boundaries.

```text
(package
    shapes

    (module
        math

        (fn
            square
            (lambda (x)
                (* x x)))))
```

The reader understands hierarchy by locating matching opening and closing parentheses.

---

## Depth-Oriented

Indentation-sensitive languages encode structure using depth.

```text
package
    shapes
    module
        math
        fn
            square
```

The reader understands hierarchy by observing changes in nesting level.

---

Both approaches have strengths.

Boundary notation is excellent for compact local structure and computation-heavy expressions.

Depth notation is excellent for large-scale organization and hierarchical navigation.

QDBP aims to combine both.

---

# The Two Building Blocks

QDBP treats trees as having two complementary views.

## Boundary-Packed Expressions (BP)

BP expressions are ordinary S-expressions.

```text
(lambda (x)
    (* x x))
```

They are especially suitable for local computations and dense nested structures.

Boundaries are defined using parenthesized notation, independent of formatting whitespace.

Indentation may be used purely for readability.

The reader answers:

> What belongs together?

---

## Quested-Depth Expressions (QD)

QD expressions describe hierarchy through explicit depth levels.

```text
package
.   shapes

.   module
.   .   math

.   .   fn
.   .   .   square
```

A sequence of leading dots specifies the depth level associated with the current element.

Unlike indentation-sensitive languages, the structural information is part of the token stream itself and is independent of formatting whitespace.

Indentation may be used purely for readability.

The reader answers:

> Where does this belong?

---

Neither approach is considered superior.

Different tree shapes often benefit from different representations.

Thus, QD may be nested within BP expressions, exactly like BP may be nested within QD expressions.

---

# Side by Side Comparison

These two expressions are equivalent:

* BP expression:

```text
(add
    (mul 2 3)
    (mul 4 5))
```

* QD expression:

```text
add
.   mul
.   .   2
.   .   3
.   mul
.   .   4
.   .   5
```

---

# Mixed Usage

The primary design goal is not replacing S-expressions.

Instead, QDBP allows each notation to be used where it is most natural.

For example:

```text
package
.   shapes

.   module
.   .   math

.   .   fn
.   .   .   square
.   .   .   (lambda (x)
                (* x x))

.   .   fn
.   .   .   distance
.   .   .   (lambda (x y)
                (sqrt (+ (* x x) (* y y))))
```

Here:

* the package/module/function hierarchy is represented using QD notation,
* executable expressions remain ordinary BP expressions.

The organizational structure and computational structure are expressed using different visual mechanisms.

---

# Design Principles

## Trees First

QDBP is intended for tree-oriented data and programs.

The notation is designed around explicit hierarchical structure rather than textual layout.

---

## Mixed Representation

Boundary and depth representations may appear side by side.

Users should be able to choose the most readable representation for each subtree.

---

## Whitespace Independence

Structural information belongs to the notation itself.

Indentation is optional and may be freely adjusted without changing semantics.

---

## Direct Translation

Every valid QDBP document corresponds to a plain S-expression tree.

A parser may transform QDBP into a conventional tree representation before evaluation or further processing.

---

# When To Use Which Notation

## Prefer QD For

* package hierarchies
* module systems
* configuration trees
* AST construction
* document structures
* long hierarchical chains

Example:

```text
server
.   database
.   .   postgres
.   .   localhost
.   .   5432

.   cache
.   .   redis
.   .   6379
```

---

## Prefer BP For

* function calls
* arithmetic
* local computations
* macro expansions
* expression-dense code

Example:

```text
(map
    (lambda (x)
        (+ (* x x) 1))
    values)
```

---

# Summary

QDBP is based on the observation that hierarchical structures can be perceived in at least two fundamentally different ways:

* through **boundaries**
* through **depth relationships**

Traditional S-expressions focus exclusively on boundaries.

Indentation-based systems focus primarily on depth.

QDBP allows both perspectives to coexist within a single notation system, letting authors choose the representation that best communicates the structure at hand.

Rather than replacing S-expressions, QDBP treats them as one of the two primary views of the same underlying tree.

