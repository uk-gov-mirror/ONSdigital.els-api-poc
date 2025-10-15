import { read } from "$app/server";

// Make Vite import the JSON files in this directory into the build
export const files = import.meta.glob("./*.json", {
  query: "?url",
  import: "default",
  eager: true
});
export const paths = Object.keys(files);

// Read a JSON data file from disk or return cached version
const cache = {};
export default async function(key) {
  const path = paths.find(p => p.endsWith(`/${key}.json`));
  if (!path) return {error: 404, message: "File not found"};

  if (cache[key]) return cache[key];

  const file = read(files[path]);
  const data = await file.json();
  cache[key] = data;

  return data;
}
