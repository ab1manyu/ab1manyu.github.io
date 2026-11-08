import { useScrollToTop } from "@/shared/hooks";
import { DiyaCard } from "@/features/diwali";

export default function Diwali() {
  useScrollToTop();
  return (
    <main className="min-h-screen pt-28 pb-16 px-4 relative z-10">
      <h1 className="text-center font-mono text-2xl sm:text-4xl text-orange-300 mb-2">
        Happy Diwali, Harini
      </h1>
      <p className="text-center text-sm text-gray-400 mb-8">
        A little light, made of text — just for you.
      </p>
      <DiyaCard />
    </main>
  );
}
