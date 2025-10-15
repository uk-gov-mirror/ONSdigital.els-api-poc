import { text } from "@sveltejs/kit";

export async function GET() {
  return text(process.env.NETLIFY ? "This is Netlify" : "This is not Netlify");
}
