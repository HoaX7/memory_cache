const fs = require("fs");
const path = require("path");

const esmDir = path.join(__dirname, "..", "lib", "esm");
const pkgPath = path.join(esmDir, "package.json");

fs.mkdirSync(esmDir, { recursive: true });
fs.writeFileSync(pkgPath, JSON.stringify({ type: "module" }, null, 2) + "\n");

const jsFiles = [];

function collectJsFiles(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectJsFiles(fullPath);
    } else if (entry.isFile() && fullPath.endsWith(".js")) {
      jsFiles.push(fullPath);
    }
  }
}

function addJsExtensionToSpecifier(specifier) {
  if (!specifier.startsWith("./") && !specifier.startsWith("../")) {
    return specifier;
  }
  if (specifier.endsWith(".js") || specifier.endsWith(".mjs") || specifier.endsWith(".cjs") || specifier.endsWith(".json")) {
    return specifier;
  }
  return `${specifier}.js`;
}

function rewriteFileImports(filePath) {
  const source = fs.readFileSync(filePath, "utf8");
  const rewritten = source
    .replace(/(from\s+['"])(\.{1,2}\/[^'"]+)(['"])/g, (_, prefix, specifier, suffix) => {
      return `${prefix}${addJsExtensionToSpecifier(specifier)}${suffix}`;
    })
    .replace(/(import\s*\(\s*['"])(\.{1,2}\/[^'"]+)(['"]\s*\))/g, (_, prefix, specifier, suffix) => {
      return `${prefix}${addJsExtensionToSpecifier(specifier)}${suffix}`;
    });

  if (rewritten !== source) {
    fs.writeFileSync(filePath, rewritten);
  }
}

collectJsFiles(esmDir);
for (const filePath of jsFiles) {
  rewriteFileImports(filePath);
}
