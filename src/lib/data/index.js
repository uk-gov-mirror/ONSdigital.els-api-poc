import { readFileSync } from "fs";
import { join } from "path";

// Make Vite import the JSON files in this directory into the build
const files = import.meta.glob("./*.json", {
  query: "?url",
  import: "default",
  eager: true,
});

// Read a JSON data file from disk or return cached version
const cache = {};
export default async function(key) {
  key = key.split(".")[0];
  if (cache[key]) return cache[key];

  const path = `./${key}.json`;
  if (!files[path]) return {error: 404, message: "File not found"};

  return {path: join(process.cwd(), files[path])};

  const data = JSON.parse(readFileSync(join(process.cwd(), files[path])));
  cache[key] = data;
  return data;
}
