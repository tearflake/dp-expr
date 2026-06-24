```
// under construction //
```

# QDBP-Compiler

**QDBP (Quested-Depth/Boundary-Perceived Expressions)** is a tree notation framework that allows hierarchical structures to be written using either:

* **explicit boundaries** (ordinary S-expressions)
* **explicit depth relationships** (depth-annotated expressions)

or any mixture of the two.

QDBP is based on a simple observation:

> Trees can be perceived in at least two fundamentally different ways:
>
> * by seeing what belongs together (boundaries)
> * by seeing where something belongs (depth)

Traditional S-expressions emphasize boundaries.

Indentation-based systems emphasize depth.

QDBP treats both as first-class views of the same tree.

---

## A Quick Example

Traditional S-expression:

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

Equivalent QDBP representation:

```text
package
    .shapes

    .module
        ..math

        ..fn
            ...square
            ...(lambda (x)
                (* x x))
```

Both forms describe exactly the same tree.

---

## Implementation

The compiler processes QDBP format to output S-Expression format using API interface.

Resources:

* [Informal Outline](docs/informal-outline.md)
* [Formal Specification](docs/formal-spec.md)
* [Online playground](https://tearflake.github.io/qdbp/playground)
* Compiler Installation Instructions `// under conctruction //`

---

## Status

QDBP is experimental.

The project explores whether boundary-oriented and depth-oriented tree representations can coexist as complementary views of the same underlying structure.

Feedback, criticism, and alternative interpretations are welcome.

```
// under construction //
```

