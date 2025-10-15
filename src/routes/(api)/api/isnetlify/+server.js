import { text } from "@sveltejs/kit";

export async function GET() {
  return text(process.env.IS_NETLIFY ? "This is Netlify" : "This is not Netlify");
}
