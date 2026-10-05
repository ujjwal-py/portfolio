"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="status-page">
      <span className="eyebrow">ERROR / SYSTEM</span>
      <h1>
        BUILD
        <br />
        <span>INTERRUPTED.</span>
      </h1>
      <p>Something went wrong while loading this part of the site.</p>
      <button className="button button-blue" onClick={reset}>
        [ TRY AGAIN → ]
      </button>
    </main>
  );
}
