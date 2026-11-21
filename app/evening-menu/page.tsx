import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Menu de la soirée | Taj Mahal Marina",
  description: "Découvrez le menu de la soirée du restaurant Taj Mahal Marina.",
};

export default function EveningMenuPage() {
  return (
    <main className="flex min-h-screen min-h-[100svh] items-center justify-center bg-[radial-gradient(circle_at_top,#52101e_0%,#20040c_48%,#090205_100%)] px-3 py-4 sm:px-6 sm:py-8">
      <h1 className="sr-only">Menu de la soirée du Taj Mahal Marina</h1>
      <div className="mx-auto w-full max-w-[1086px] overflow-hidden rounded-2xl border border-amber-300/30 bg-[#2b0710] shadow-[0_28px_90px_rgba(0,0,0,0.55)] sm:rounded-[2rem]">
        <Image
          src="/evening-menu/menu-de-la-soiree.jpeg"
          alt="Menu de la soirée du restaurant Taj Mahal Marina à 49 euros"
          width={1086}
          height={1448}
          priority
          sizes="(max-width: 1086px) 100vw, 1086px"
          className="h-auto w-full"
        />
      </div>
    </main>
  );
}
