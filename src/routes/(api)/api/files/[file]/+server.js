import { read } from "$app/server";
import { error } from "@sveltejs/kit";
import { files, paths } from "$lib/data";

export async function GET({ params }) {
  const file = params.file;

  const path = paths.find(p => p.endsWith(`/${file}`));
  if (!path) error(404, "File not found");

  return read(files[path]);
}
