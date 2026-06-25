# QDBP-Compiler Formal Specification

---

## Construction Rules

QDBP compiles to S-Expressions. Given a stream of input tokens, we construct a plain S-Expression from this stream. We consecutively insert opening parens, token values, and closing parens in the following way:

```
* for each element in each s-expr list:
    * c = current element depth (zero if not specified)
    * n = next element depth (zero if not specified)
    * if `n > c` then open `n - c` groups
    * emit element value
    * if `n < c` then close `c - n` groups
```

More detailed specification algorithm would look like:

```
* function qdbp2sexpr(`lst`: `list<(depth, value)>` ending with `EOF`, `idx`: `integer`, `rec`: `integer`): `(list, integer)`
    * declare `result` as empty list
    * declare `tok` as `(depth, value)` tuple
    * `tok` = `lst[idx]`
    * `nd` = `0`
    * `first` = `true`
    * while `tok.value` != `)` and `tok.value` != `EOF`
        * `cd` = `nd`
        * `val` = `null`
        * if `tok.value` == `(` then
            * `(val, idx)` = `qdbp2sexpr(lst, idx + 1, rec + 1)`
        
        * if `tok.value` != `(` and `tok.value` != `)` then
            * `val` = `tok.value`
        
        * `idx` = `idx + 1`
        * `tok` = `lst[idx]`
        * `nd` = (iff `tok.value` == `)` or `tok.value` == `EOF` then `0` else `tok.depth`)
        
        * if `rec` == `0` and not first and `cd` == `0` then fail
        * if `first` and `cd` > `0` then fail
        * if `nd` > `cd + 1` then fail
        
        * if `nd` > `cd` then push `nd - cd` opening parens to `result`
        
        * if `val` is not `null`
            * if `val` is atom then
                * push `val` to `result`
                
            * if `val` is list then
                * push opening paren to `result`
                * push all `val` elements to `result`
                * push closing paren to `result`
        
        * if `nd` < `cd` then push `cd - nd` closing parens to `result`
        
        * `first` = `false`

    * if `rec` > `0` and `tok` == `EOF` then fail
    * if `rec` == `0` and `tok` != `EOF` then fail
    * if `rec` == `0` and `result.length` == `0` then fail

    * return `(result, idx)`
```

---

## Example

QDBP source:

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
            
.   module
.   .   square
        
.   .   fn
.   .   .   area
.   .   .   (lambda (a)
                (math/square a))
            
.   .   fn
.   .   .   diagonal
.   .   .   (lambda (a)
                (math/distance a a))
```

expands to:

```text
(package
    shapes

    (module
        math

        (fn
            square
            (lambda (x)
                (* x x)))
            
        (fn
            distance
            (lambda (x y)
                (sqrt (+ (* x x) (* y y))))))
            
    (module
        square
        
        (fn
            area
            (lambda (a)
                (math/square a)))
            
        (fn
            diagonal
            (lambda (a)
                (math/distance a a)))))
```

