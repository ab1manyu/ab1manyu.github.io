import { useScrollToTop } from "@/shared/hooks";
import { GalleryCore } from "@/features/gallery";

export default function Gallery() {
  useScrollToTop();
  return <GalleryCore />;
}
