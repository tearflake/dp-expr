# Depth Prefix Expression (DP-Expr)

An alternative surface syntax for symbolic expressions where nesting is encoded by dot-prefixed depth markers instead of parens.

## Motivation

S-Expr is a brilliant format for representing data, but it has its quirks when a greater number of parenthesis repeat. In a quest for a format that solves the endless streams of parenthesis, we approach the structuring problem from a different side. We want the new format to be like "indentation sensitive", but without depending on significant whitespace. We also want expressions to be able to form structures using a single line of code.

The possible solution that meets these constraints may come in a form of significant number of prefixed dots to tokens, not involving parenthesis at all. We name this format the "Depth Prefix Expression" (DP-Expr). S-Exprs and DP-Exprs are interchangeable without exception, meaning that each S-Expr can be expressed by a DP-Expr and each DP-Expr can be expressed by an S-Expr. Comparing to S-Expr format, DP-Expr doesn't promise a shorter code, but using the right kind of indentation and newlines, it may exclude dealing with endless streams of parenthesis, but at the expense of stating explicit depth of each atom.

DP-Expr is not an attempt to replace S-Exprs everywhere. It is an alternative tree notation optimized for vertically presented hierarchies while being fully interchangeable to and from S-Expr format.

## Overview

A DP-Expr document represents exactly one symbolic expression, being an atom or a list. A DP-Expr token represents a point in a tree. The token value is the node content. The dot count is the node depth. The parser reconstructs parenthesized lists by walking between successive depth coordinates.

Each token is prefixed with zero or more dots (`.`). The number of leading dots determines the token's nesting depth. The parser maintains a current nesting depth, placing consecutive tokens with the same depth in the same list. Moving deeper opens lists; moving shallower closes lists.

The converter reads a whitespace-separated sequence of tokens and emits a symbolic expression using parens to represent hierarchy. Although the whitespace use is entirely arbitrary between tokens, and does not affect the list levels, it is recommended to use a proper indentation in separated code lines, corresponding to atom depths at token appearance at beginning of lines.

## Syntax

A token consists of:

* Zero or more leading dots (`.`)
* A value

Examples:

```text
    .parent
        ..child
            ...grandchild
```

Depth is determined by the number of leading dots:

| Token           | Depth | Value        |
| --------------- | ----- | ------------ |
| `.parent`       | 1     | `parent`     |
| `..child`       | 2     | `child`      |
| `...grandchild` | 3     | `grandchild` |

Whitespace (spaces, tabs, newlines) may be used freely between tokens.

## Example

Input:

```text
    .expr
        ..left
        ..right
```

Output:

```text
(expr (left right))
```

## Structural Tokens

A token whose value is empty is called a **structural token**. Structural tokens are required for full S-Expr equivalence. Structural tokens do not emit a value in the output expression; instead, they affect only the nesting structure. They may be used to close one or more lists at once by appearing at a shallower depth, or to create anonymous nested lists by appearing at a deeper depth. This allows grouping to be expressed independently of data values and makes it possible to represent structures that would otherwise require explicit placeholder symbols. For example, the token `..` contributes no atom to the output but may change the current nesting level, while the token `....` may create additional anonymous grouping levels.

## Algorithm

For each token:

1. Let d be its depth.
2. Open (d - currentDepth) groups if d greater than currentDepth.
3. Close (currentDepth - d) groups if d less than currentDepth.
4. Emit the token value if non-empty.
5. Set currentDepth = d.

## More Examples

### Atom

Input:

```text
a
```

Output:

```text
a
```

### Nested Empty List With Structural Token

Input:

```text
...
```

Output:

```text
((()))
```

### Simple Nesting

Input:

```text
    .a
        ..b
            ...c
```

Output:

```text
(a (b (c)))
```

### Multiple Siblings

Input:

```text
    .expr
        ..left
        ..mid
        ..right
```

Output:

```text
(expr (left mid right))
```

### Deep Tree With Sibling Lists

Input:

```text
    .expr
        ..add
            ...mul
            ...a
            ...b
        ..
            ...mul
            ...p
            ...q
```

Output:

```text
(expr (add (mul a b) (mul p q)))
```

## Conclusion

In spite of DP-Expr's very simple implementation algorithm, there are a lot of examples where S-Exprs practically outperform DP-Exprs.

S-exprs encode structure using expression boundaries. DP-Expr encodes structure using depth coordinates. One conclusion may be that boundaries tend to work better in horizontal layouts, while coordinates tend to work better in vertical layouts.

S-exprs may be better for expressing a compact inline notation such as few-liner arithmetic expressions, while DP-Exprs may be better for expressing a depth-oriented notation. The advantage of DP-Exprs become most visible when expressions are laid out vertically and the hierarchy itself is the primary thing being communicated. One of such examples is expressing large tree structures where a number of modules and functions exist in the same file.

Since S-Expr and DP-Expr forms may be made compatible, the future work may include combining S-Expr and DP-Expr to produce a solution where a user would have a possibility to chose where to use S-Exprs, and where DP-Exprs, all within the same source code file.

## Resources

* [DP-Expr playground](https://tearflake.github.io/dp-expr/playground/)
* [DP-Expr pseudocode](./src/dp-expr.pseudo)

## License

MIT

