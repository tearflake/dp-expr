// sexpression.js
// (c) tearflake, 2025
// MIT License

"use strict"

var QDBP = (
    function (obj) {
        return {
            compile: obj.compile
        };
    }
) (
    (function () {
        "use strict"
        
        function compile(str) {
            let [result, pos] = convert(str, 0, 0)
            return result.join(" ");
        }

        function convert(str, pos, rec) {
            let result = [];
            let first = true;
            let [token, currPos] = nextToken(str, pos);
            while (token !== null && token.val !== ")") {
                let currDepth = token.depth;

                if (rec === 0 && !first && currDepth === 0)
                    throw new Error(`Only one top level expression allowed\nat ${errBack (str, currPos)}`);
                
                if (first && currDepth > 0)
                    throw new Error(`First expression depth in sequence has to be 0\nat ${errBack (str, currPos)}`);
                    
                let value = null;
                if (token.val === "(") {
                    [value, currPos] = convert(str, currPos, rec + 1);
                }
                else if (token.val !== ")") {
                    value = token.val;
                }
                
                [token, currPos] = nextToken(str, currPos);
                let nextDepth = (token === null || token.val === ")" ? 0 : token.depth)
                if (nextDepth > currDepth + 1)
                    throw new Error(`Only one level depth shift at the time allowed\nat ${errBack (str, currPos)}`)
                
                if (nextDepth > currDepth) {
                    let tmp = 0;
                    while (tmp < nextDepth - currDepth) {
                        result.push("(");
                        tmp++;
                    }
                }
                
                if (value !== null) {
                    if (!Array.isArray(value)) {
                        result.push(value);
                    }
                    else {
                        result.push("(");
                        for (let i = 0; i < value.length; i++) {
                            result.push(value[i]);
                        }
                        result.push(")");
                    }
                }
                
                if (nextDepth < currDepth) {
                    let tmp = 0;
                    while (tmp < currDepth - nextDepth) {
                        result.push(")");
                        tmp++;
                    }
                }

                first = false;
            }
            
            if (rec > 0 && token === null)
                throw new Error(`Unexpected end of file\nat ${errBack (str, currPos)}`);
                
            if (rec === 0 && token !== null)
                throw new Error(`Unexpected characters\nat ${errBack (str, currPos)}`);

            if (rec === 0 && result.length === 0)
                throw new Error(`Empty file`);
            
            return [result, currPos];
        }
        
        function nextToken(str, start) {
            while (start < str.length && "\n\r\t ".indexOf (str.charAt(start)) > -1) {
                start++;
            }
            
            if (start >= str.length) {
                return [null, start];
            }
            
            let end = start;
            let depth = 0
            while (end < str.length && str.charAt(end) === ".") {
                end++;
                depth++;
                while (end < str.length && "\n\r\t ".indexOf (str.charAt(end)) > -1) {
                    end++;
                }
            }
            
            start = end;
            if (start < str.length && str.charAt(start) === '"' || str.charAt(start) === "'") {
                let [value, len] = parseString(str, start);
                return [{depth: depth, val: value}, start + len];
            }

            while (end < str.length && "\n\r\t(). ".indexOf (str.charAt(end)) === -1) {
                end++;
            }
            
            if (start == end && end < str.length && str.charAt(end) === "(") {
                return [{depth: depth, val: "("}, end + 1];
            }

            if (start == end && end < str.length && str.charAt(end) == ")") {
                if(depth === 0) {
                    return [{depth: 0, val: ")"}, end + 1];
                }
                else {
                    let c = getCoords (str, end);
                    throw new Error(`Missing atom or opening paren after depth marker\nat ${"(" + c.row + ", " + c.column + ")"}`);
                }
            }
            
            return [{depth: depth, val: str.substring(start, end)}, end];
        }
        
        function getCoords (text, offset) {
            var i, ch, row = 1, col = 1;
            if (text.length > 0)
                for (i = 0; i < offset; i += 1) {
                    ch = text.charCodeAt(i);
                    if (ch === 13 || ch === 10) {
                        if (ch === 13 && text.charCodeAt (i + 1) === 10)
                            i += 1;

                        row += 1;
                        col = 1;
                        
                    } else
                      col += 1;
                }
            
            return {row: row, column: col};
        }

        function errBack(text, pos) {
            pos--;
            let braces = 0;
            while (braces > 0 || " \n\r\t.".indexOf (text.charAt(pos)) === -1) {
                pos--;
                if (text.charAt(pos) === "(")
                    braces--;
                    
                if (text.charAt(pos) === ")")
                    braces++;
            }
            
            let c = getCoords (text, pos + 1);
            return "(" + c.row + ", " + c.column + ")";
        }
        
        function parseString (input, pos) {
            let tmpPos = pos;
            // strings (single, double, or repeated)
            let ch = input.charAt(pos);
            if (ch === '"' || ch === "'") {
              let quoteChar = ch;
              let count = 0;
              while (input.charAt(pos + count) === quoteChar) count++;
              pos += count;
              let escaped = false;
              if (count === 1 || count % 2 === 0) {
                let value = "";
                let success = false;
                while (pos < input.length) {
                  if (input[pos] === '\n') {
                    let c = getCoords (input, tmpPos);
                    throw new Error(`String not terminated\nat ${"(" + c.row + ", " + c.column + ")"}`);
                  }
                  
                  if(!escaped) {
                      if(input[pos] == quoteChar) {
                        success = true;
                        pos++;
                        break;
                      }
                      
                      if (input[pos] === '\\')
                        escaped=true;
                  }
                  else
                    escaped = false;

                  value += input[pos];
                  pos++;
                }
                
                if (!success) {
                  let c = getCoords (input, tmpPos);
                  throw new Error(`String not terminated\nat ${"(" + c.row + ", " + c.column + ")"}`);
                }
                
                return [JSON.stringify(value), value.length + 2];
                
              } else {
                let c = getCoords (input, tmpPos);
                throw new Error(`Multiline strings not supported\nat ${"(" + c.row + ", " + c.column + ")"}`);
              }
            }
        }
        
        return {
            compile: compile
        }
    }) ()
);

var isNode = new Function ("try {return this===global;}catch(e){return false;}");

if (isNode ()) {
    // begin of Node.js support

    module.exports = QDBP;
    
    function escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    function replaceAll(str, match, replacement){
       return str.replace(new RegExp(escapeRegExp(match), 'g'), ()=>replacement);
    }

    if(typeof String.prototype.replaceAll === "undefined") {
        String.prototype.replaceAll = function (match, replace) {return replaceAll (this.valueOf (), match, replace);};
    }

    // end of Node.js support
}

