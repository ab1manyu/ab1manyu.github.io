import { useScrollToTop } from "@/shared/hooks";
import { DartScoreCore } from "@/features/darts";

export default function DartScore() {
  useScrollToTop();

  return (
    <div className="w-full min-h-screen pt-16 flex flex-col items-center">
      <DartScoreCore />
    </div>
  );
}
