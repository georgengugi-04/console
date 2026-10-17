import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="atmosphere grid min-h-[80svh] place-items-center px-6 pt-24 text-center">
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="h1 mt-4">This page has moved on.</h1>
        <p className="lead mx-auto mt-5">The page you were looking for isn&apos;t here. Let&apos;s get you back on track.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link href="/" className={buttonClass("primary")}>
            Back to home
          </Link>
          <Link href="/contact" className={buttonClass("ghost")}>
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
