import { read } from "$app/server";

// Make Vite import the JSON files in this directory into the build
const files = import.meta.glob("./*.json", {
  query: "?url",
  import: "default"
});

// Read a JSON data file from disk or return cached version
const cache = {};
export default async function(key) {
  key = key.split(".")[0];
  if (cache[key]) return cache[key];

  const file = `./${key}.json`;
  if (!files[file]) return {error: 404, message: "File not found"};

  const path = await files[file]();
  const asset = read(path);
  const data = await asset.json();
  cache[key] = data;

  return data;
}
