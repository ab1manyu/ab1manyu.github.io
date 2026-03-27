import { useEffect, useState } from 'react';

export default function DotGrid() {
  const [flashKey, setFlashKey] = useState(0);

  useEffect(() => {
    const handleFlash = () => setFlashKey(k => k + 1);
    window.addEventListener('camera-flash', handleFlash);
    return () => window.removeEventListener('camera-flash', handleFlash);
  }, []);

  return (
    <>
      <div className="dot-grid pointer-events-none z-[-2] fixed inset-0" />
      {/* Remounting the element on each flash guarantees the animation restarts */}
      {flashKey > 0 && (
        <div
          key={flashKey}
          className="dot-grid-edge-flash pointer-events-none fixed inset-0"
          style={{ zIndex: -1 }}
        />
      )}
    </>
  );
}
