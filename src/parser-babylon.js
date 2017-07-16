"use strict";

const createError = require("./parser-create-error");

function parse(text) {
  // Inline the require to avoid loading all the JS if we don't use it
  const babylon = require("babylon");

  const babylonOptions = {
    sourceType: "module",
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    plugins: [
      "jsx",
      "flow",
      "doExpressions",
      "objectRestSpread",
      "decorators",
      "classProperties",
      "exportExtensions",
      "asyncGenerators",
      "functionBind",
      "functionSent",
      "dynamicImport",
      "numericSeparator",
      "importMeta"
    ]
  };

  let ast;
  try {
    ast = babylon.parse(text, babylonOptions);
  } catch (originalError) {
    try {
      ast = babylon.parse(
        text,
        Object.assign({}, babylonOptions, { strictMode: false })
      );
    } catch (nonStrictError) {
      throw createError(
        // babel error prints (l:c) with cols that are zero indexed
        // so we need our custom error
        originalError.message.replace(/ \(.*\)/, ""),
        {
          start: {
            line: originalError.loc.line,
            column: originalError.loc.column + 1
          }
        }
      );
    }
  }
  delete ast.tokens;
  return ast;
}

module.exports = parse;
