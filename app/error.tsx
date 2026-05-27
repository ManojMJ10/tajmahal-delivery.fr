"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f6eee3] text-stone-900">
        <main className="mx-auto grid min-h-screen max-w-3xl place-items-center px-6">
          <section className="w-full rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
              Something went wrong
            </p>
            <h1 className="mt-3 font-serif text-4xl font-semibold text-stone-950">
              The page could not load
            </h1>
            <p className="mt-4 text-stone-600">
              {error.message || "An unexpected error occurred while rendering this route."}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 rounded-full bg-stone-900 px-5 py-3 font-semibold text-white hover:bg-stone-800"
            >
              Try again
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}

