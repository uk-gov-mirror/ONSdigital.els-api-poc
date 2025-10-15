import { read } from "$app/server";

const files = import.meta.glob("$lib/data/*.json", {
  query: "?url",
  import: "default",
  eager: true,
});
const paths = Object.keys(files);

export async function GET() {
  return read(files[paths[Math.floor(Math.random() * paths.length)]]);
}
