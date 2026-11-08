import { useScrollToTop } from "@/shared/hooks";
import { DiyaCard } from "@/features/diwali";

const Heart = () => (
  <span aria-hidden="true" className="diwali-heart">
    ♥
  </span>
);

export default function Diwali() {
  useScrollToTop();
  return (
    <main className="min-h-screen pt-28 pb-16 px-4 relative z-10">
      <h1 className="text-center font-mono text-2xl sm:text-4xl mb-2">
        <Heart /> <span className="diwali-rainbow">Happy Diwali, Harini</span>{" "}
        <Heart />
      </h1>
      <p className="text-center text-sm mb-8">
        <span className="diwali-rainbow">
          Wishing you a very happy, bright, and warm Diwali.
        </span>{" "}
      </p>
      <DiyaCard />
    </main>
  );
}
