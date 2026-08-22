import { useLayoutEffect } from "react";
import DartScoreCore from "../darts/DartScoreCore";

export default function DartScore() {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="w-full min-h-screen pt-16 flex flex-col items-center">
      <DartScoreCore />
    </div>
  );
}
