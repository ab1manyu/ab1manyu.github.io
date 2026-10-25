import { useState, useEffect } from "react";
import { GALLERY_ITEMS } from "./data/galleryData";
import GalleryCard from "./components/GalleryCard";
import GalleryModal from "./components/GalleryModal";

export default function GalleryCore() {
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // Intersection Observer for glass-panels
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".glass-panel").forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition =
        "opacity 0.6s ease, transform 0.6s ease, border-color 0.3s ease";
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [selectedItem]);

  return (
    <>
      <div className="dot-grid"></div>

      <main className="pt-24 pb-12 px-4 md:px-6 max-w-7xl mx-auto min-h-screen relative z-10 transition-opacity duration-500">
        <div className="flex justify-between items-end mb-8 border-defense-border pb-4">
          <div>
            <div className="font-mono text-xs text-defense-accent mb-2">
              PERSPECTIVES_CAPTURED
            </div>
            <h1 className="text-4xl font-bold text-white uppercase tracking-tight">
              Photography
            </h1>
            <p className="text-md text-gray-500 tracking-tight max-w-2xl mt-2">
              A showcase containing the experiences that I have captured
              throughout my travel and daily life. Click on any image to view it
              in full resolution and learn the history behind it.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALLERY_ITEMS.map((item) => (
            <GalleryCard
              key={item.id}
              item={item}
              onClick={() => setSelectedItem(item)}
            />
          ))}
        </div>
      </main>

      {selectedItem && (
        <GalleryModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </>
  );
}
