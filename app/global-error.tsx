"use client";

export default function GlobalError({
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
              Application error
            </p>
            <h1 className="mt-3 font-serif text-4xl font-semibold text-stone-950">
              Taj Mahal could not render
            </h1>
            <p className="mt-4 text-stone-600">
              {error.message || "A global rendering error occurred."}
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-6 rounded-full bg-stone-900 px-5 py-3 font-semibold text-white hover:bg-stone-800"
            >
              Reload application
            </button>
          </section>
        </main>
      </body>
    </html>
  );
}

