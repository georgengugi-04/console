import { handleSubmission } from "@/lib/handleSubmission";
import { claimEnquirySchema } from "@/lib/validation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function POST(request: Request) {
  return handleSubmission(request, "claim", claimEnquirySchema);
}
