# QDBP Use Instructions

Download this repository and include `src/qdbp.js` in your HTML.

Use API as:

```
let strCode = `
package
    .shapes

    .module
        ..math

        ..fn
            ...square
            ...(lambda (x)
                (* x x))
`
let strSExpr = QDBP.compile (strCode);
```

