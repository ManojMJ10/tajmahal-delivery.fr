export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#f6eee3] px-6 text-stone-900">
      <section className="w-full max-w-2xl rounded-[2rem] border border-stone-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">404</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-stone-950">Page not found</h1>
        <p className="mt-4 text-stone-600">
          The requested Taj Mahal page does not exist.
        </p>
      </section>
    </main>
  );
}
