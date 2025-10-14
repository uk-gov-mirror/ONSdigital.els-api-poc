import { json } from "@sveltejs/kit";
import readData from "$lib/data";

export async function GET({ params }) {
  const file = params.file;

  const data = await readData(file);
  return json(data);
}
