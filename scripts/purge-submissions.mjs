#!/usr/bin/env node
/**
 * Deletes enquiries older than SUBMISSION_RETENTION_DAYS (default 180) from the LOCAL development store
 * (.data/submissions.jsonl). That file only exists when ALLOW_LOCAL_SUBMISSION_STORE=true on a non-production
 * server. Enquiries delivered to your CRM / webhook receiver must be purged by that system's own retention rules.
 *
 *   node scripts/purge-submissions.mjs [--dry-run] [--file .data/submissions.jsonl]
 */
import { existsSync, readFileSync, renameSync, writeFileSync } from "node:fs";

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const fileFlag = args.indexOf("--file");
const file = fileFlag >= 0 ? args[fileFlag + 1] : ".data/submissions.jsonl";
const days = Number(process.env.SUBMISSION_RETENTION_DAYS ?? 180);

if (!Number.isFinite(days) || days <= 0) {
  console.error("SUBMISSION_RETENTION_DAYS must be a positive number.");
  process.exit(1);
}
if (!existsSync(file)) {
  console.log(`Nothing to purge: ${file} does not exist.`);
  process.exit(0);
}

const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
const lines = readFileSync(file, "utf8").split("\n").filter(Boolean);
const keep = [];
let removed = 0;
for (const line of lines) {
  let receivedAt = NaN;
  try {
    receivedAt = Date.parse(JSON.parse(line).receivedAt);
  } catch {
    /* unreadable line: treated as expired so malformed personal data never lingers */
  }
  if (Number.isFinite(receivedAt) && receivedAt >= cutoff) keep.push(line);
  else removed++;
}

console.log(`${dryRun ? "[dry run] would remove" : "Removing"} ${removed} of ${lines.length} record(s) older than ${days} days.`);
if (!dryRun && removed > 0) {
  const tmp = `${file}.tmp`;
  writeFileSync(tmp, keep.length ? keep.join("\n") + "\n" : "", { mode: 0o600 });
  renameSync(tmp, file);
}
