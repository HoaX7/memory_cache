const fs = require("fs");
const path = require("path");

const esmDir = path.join(__dirname, "..", "lib", "esm");
const pkgPath = path.join(esmDir, "package.json");

fs.mkdirSync(esmDir, { recursive: true });
fs.writeFileSync(pkgPath, JSON.stringify({ type: "module" }, null, 2) + "\n");
