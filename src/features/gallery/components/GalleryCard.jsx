import styles from "../Gallery.module.css";

export default function GalleryCard({ item, onClick }) {
  const fileName = item.image.split("/").pop().toUpperCase();

  return (
    <div
      onClick={onClick}
      className={`glass-panel p-0 group relative overflow-hidden aspect-video flex items-center justify-center cursor-pointer ${styles.card}`}
    >
      <div className="absolute inset-0 bg-defense-accent/0 group-hover:bg-white/10 transition-colors z-10"></div>
      <img
        src={item.image}
        loading="lazy"
        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
        alt={item.title}
      />
      <div className="absolute bottom-4 left-4 font-mono text-[12px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity z-20">
        {fileName}
      </div>
      <div className={styles.scanline}></div>
    </div>
  );
}
