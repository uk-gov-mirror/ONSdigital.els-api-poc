import { json, error } from "@sveltejs/kit";
import readData from "$lib/data";

export async function GET({ params }) {
  const file = params.file;

  try {
    const data = await readData(file);
    return json(data);
  }
  catch(err) {
    error(500, err);
  }
}
