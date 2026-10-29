import { useScrollToTop } from "@/shared/hooks";
import { KaiCardsCore } from "@/features/kai-cards";

export default function KaiCards() {
  useScrollToTop();
  return <KaiCardsCore />;
}
