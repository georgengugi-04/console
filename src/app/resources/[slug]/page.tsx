import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CtaBand } from "@/components/sections/CtaBand";
import { getResource, resources } from "@/content/resources";

type Params = { slug: string };

export function generateStaticParams() {
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const r = getResource(slug);
  if (!r) return {};
  return { title: r.title, description: r.excerpt, alternates: { canonical: `/resources/${r.slug}` } };
}

export default async function ResourcePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const r = getResource(slug);
  if (!r) notFound();
  const related = r.related.map(getResource).filter((x): x is NonNullable<typeof x> => Boolean(x));

  return (
    <>
      <article className="atmosphere pt-36">
        <div className="container-x max-w-3xl pb-20">
          <Link href="/resources" className="inline-flex min-h-11 items-center gap-2 text-sm text-fg-2 transition hover:text-fg">
            <ArrowLeft size={16} aria-hidden /> All resources
          </Link>
          <p className="eyebrow mt-8">{r.category}</p>
          <h1 className="h1 mt-4 text-balance">{r.title}</h1>
          <p className="mt-4 text-sm text-fg-muted">{r.readingMinutes} min read</p>

          {r.status === "draft" && (
            <p className="mt-8 rounded-xl border border-dashed border-brand/50 bg-brand-soft p-4 text-sm text-brand">
              Draft content — general information pending review by CONSOLE. Not advice, and not a statement of any
              insurer&apos;s terms.
            </p>
          )}

          <div className="prose-console mt-10">
            {r.body.map((line, i) =>
              line.startsWith("## ") ? <h2 key={i}>{line.slice(3)}</h2> : <p key={i}>{line}</p>,
            )}
          </div>

          {related.length > 0 && (
            <aside aria-label="Related guides" className="mt-16 border-t border-line pt-8">
              <h2 className="font-display text-lg">Related</h2>
              <ul className="mt-4 space-y-2">
                {related.map((x) => (
                  <li key={x.slug}>
                    <Link href={`/resources/${x.slug}`} className="text-brand underline underline-offset-4">
                      {x.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}
        </div>
      </article>
      <CtaBand title="Have a question this didn't answer?" body="Send it to the team and we'll reply." />
    </>
  );
}
