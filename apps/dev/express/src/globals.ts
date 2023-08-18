import path from "path";
import { fileURLToPath } from "url";

export var __filename = fileURLToPath(import.meta.url);
export var __dirname = path.dirname(__filename);

if (!global.__filename) {
 global.__filename = __filename;
}

if (!global.__dirname){
  global.__dirname = __dirname;
}
