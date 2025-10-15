import { read } from "$app/server";
import { files, paths } from "$lib/data";

export async function GET() {
  return read(files[paths[Math.floor(Math.random() * paths.length)]]);
}
