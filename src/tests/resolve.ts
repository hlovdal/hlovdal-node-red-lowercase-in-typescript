
// https://dev.to/stephencweiss/what-is-require-resolve-and-how-does-it-work-1ho4
// https://stackoverflow.com/questions/54977743/do-require-resolve-for-es-modules
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
export const resolve = require.resolve;

// Could alternatively use this library: https://github.com/mskelton/isomorphic-resolve
