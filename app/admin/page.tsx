import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-[#f7f1e8] px-4 py-12 text-stone-900">
      <section className="mx-auto max-w-4xl rounded-[2rem] border border-stone-200 bg-white p-8 shadow-sm md:p-10">
        <p className="text-sm font-black uppercase tracking-[0.3em] text-stone-500">Admin</p>
        <h1 className="mt-3 font-serif text-4xl font-bold text-stone-950 md:text-5xl">
          Taj Mahal Admin
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-stone-600">
          This is your admin entry route. You can keep this page as a protected gateway for
          staff tools, menu controls, and order operations.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            href="/"
            className="rounded-full border border-stone-300 bg-white px-5 py-3 text-center font-semibold text-stone-800 transition-colors hover:bg-stone-50"
          >
            Open Public Site
          </Link>
          <Link
            href="/kiosk"
            className="rounded-full bg-stone-900 px-5 py-3 text-center font-semibold text-white transition-colors hover:bg-stone-800"
          >
            Open Kiosk Site
          </Link>
        </div>
      </section>
    </main>
  );
}
