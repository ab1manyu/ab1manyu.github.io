import { useRef, useCallback, useEffect } from "react";
import { Camera, X, Aperture, Sliders } from "lucide-react";
import styles from "./Gallery.module.css";

export default function GalleryModal({ item, onClose }) {
  const zoomLevelRef = useRef(0);
  const imgRectRef = useRef(null);
  const animFrameRef = useRef(null);
  const modalImgRef = useRef(null);

  const resetZoom = useCallback((img) => {
    zoomLevelRef.current = 0;
    imgRectRef.current = null;
    img.style.transform = "scale(1)";
    img.style.transformOrigin = "center center";
    img.style.cursor = "zoom-in";
  }, []);

  const updateOrigin = useCallback((img, clientX, clientY) => {
    const rect = imgRectRef.current;
    if (!rect) return;
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    img.style.transformOrigin = `${x}% ${y}%`;
  }, []);

  const handleImgClick = useCallback(
    (e) => {
      e.stopPropagation();
      const img = modalImgRef.current;
      if (!img) return;

      zoomLevelRef.current = (zoomLevelRef.current + 1) % 3;
      const level = zoomLevelRef.current;

      if (level > 0) {
        imgRectRef.current = img.getBoundingClientRect();
      }

      if (level === 0) {
        resetZoom(img);
      } else if (level === 1) {
        img.style.transform = "scale(2.5)";
        img.style.cursor = "zoom-in";
        updateOrigin(img, e.clientX, e.clientY);
      } else {
        img.style.transform = "scale(5)";
        img.style.cursor = "zoom-out";
        updateOrigin(img, e.clientX, e.clientY);
      }
    },
    [resetZoom, updateOrigin]
  );

  const handleImgMouseMove = useCallback(
    (e) => {
      if (zoomLevelRef.current === 0) return;
      const img = modalImgRef.current;
      if (!img) return;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(() => {
        updateOrigin(img, e.clientX, e.clientY);
      });
    },
    [updateOrigin]
  );

  const handleImgMouseLeave = useCallback(() => {
    const img = modalImgRef.current;
    if (!img) return;
    if (zoomLevelRef.current > 0) resetZoom(img);
  }, [resetZoom]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!item) return null;

  return (
    <div
      id="gallery-modal"
      className="fixed inset-0 z-[60] flex items-center justify-center px-4 transition-all duration-300 visible opacity-100"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 opacity-100"
        onClick={onClose}
      ></div>

      <div className="relative w-[95vw] h-[95vh] bg-defense-base border border-defense-border rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row transition-transform duration-300 scale-100">
        {/* Left Side: Zoomable Image */}
        <div className="w-full md:w-3/4 bg-black/50 relative flex items-center justify-center border-b md:border-b-0 md:border-r border-defense-border h-1/2 md:h-full overflow-hidden">
          <img
            ref={modalImgRef}
            loading="lazy"
            src={item.image}
            onClick={handleImgClick}
            onMouseMove={handleImgMouseMove}
            onMouseLeave={handleImgMouseLeave}
            className={`w-full h-full object-contain max-h-[90%] origin-center ${styles.modalImage}`}
            alt={item.title}
          />
        </div>

        {/* Right Side: Photo Information & Metadata */}
        <div
          className={`w-full md:w-1/4 p-8 flex flex-col bg-defense-panel backdrop-blur-md overflow-y-auto h-1/2 md:h-full ${styles.modalContent}`}
        >
          <div className="flex justify-between items-start mb-6">
            <div className="font-mono text-[10px] text-defense-muted uppercase tracking-widest">
              {item.location || "LOCATION"}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
            {item.title}
          </h2>

          <div className="font-mono text-xs text-defense-accent mb-6">
            {item.date}
          </div>

          <div className="font-sans text-sm text-gray-300 leading-relaxed mb-6">
            {item.desc}
          </div>

          <div className="mt-auto pt-6 border-t border-defense-border">
            <div className="font-mono text-[10px] text-defense-muted mb-2 uppercase tracking-wider">
              Camera Intel
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs font-mono text-gray-400 mb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-3 h-3 text-defense-accent" />
                <span className="text-white">{item.cam}</span>
              </div>
              <div className="flex items-center gap-2">
                <Aperture className="w-3 h-3 text-defense-accent" />
                <span>{item.lens}</span>
              </div>
              <div className="flex items-center gap-2">
                <Sliders className="w-3 h-3 text-defense-accent" />
                <span>{item.settings}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <span className="px-2 py-1 bg-defense-accent/10 border border-defense-accent/20 text-[10px] font-mono text-defense-accent rounded">
                INTEL
              </span>
              <span className="px-2 py-1 bg-defense-accent/10 border border-defense-accent/20 text-[10px] font-mono text-defense-accent rounded">
                OPS
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
