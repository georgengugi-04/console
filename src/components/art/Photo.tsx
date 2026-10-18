"use client";

import { useEffect, useRef, useState } from "react";
import { Scene } from "@/components/art/Scene";
import { stockPhotos, type PhotoId } from "@/content/imagery";

/**
 * A real photograph with credit. If it cannot load (offline, blocked, removed) the matching illustration is shown, so a
 * section never ends up with a broken-image box.
 */
export function Photo({
  id,
  className = "",
  sizes = "(min-width: 1024px) 50vw, 100vw",
  width = 1200,
  priority = false,
  credit = true,
}: {
  id: PhotoId;
  className?: string;
  sizes?: string;
  width?: number;
  priority?: boolean;
  credit?: boolean;
}) {
  const p = stockPhotos[id];
  const [failed, setFailed] = useState(false);
  const img = useRef<HTMLImageElement>(null);

  // An image that already failed before hydration never fires React's onError
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) return <Scene name={p.fallback} className={`relative ${className}`} />;

  return (
    <figure className={`relative overflow-hidden bg-sunken ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element -- remote CDN image with its own resizing and an onError fallback */}
      <img
        ref={img}
        src={`${p.src}?auto=format&fit=crop&q=70&w=${width}`}
        srcSet={[480, 800, 1200, 1800].map((w) => `${p.src}?auto=format&fit=crop&q=70&w=${w} ${w}w`).join(", ")}
        sizes={sizes}
        alt={p.alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {credit && (
        <figcaption className="absolute bottom-0 right-0 rounded-tl-lg bg-page/85 px-2.5 py-1 text-[0.68rem] text-fg-2 backdrop-blur">
          Photo: <a className="underline underline-offset-2" href={p.page} target="_blank" rel="noopener noreferrer">{p.by}</a> /{" "}
          <a className="underline underline-offset-2" href="https://unsplash.com" target="_blank" rel="noopener noreferrer">Unsplash</a>
        </figcaption>
      )}
    </figure>
  );
}
