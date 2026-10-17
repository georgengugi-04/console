import { handleSubmission } from "@/lib/handleSubmission";
import { quoteSchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return handleSubmission(request, "quote", quoteSchema);
}
