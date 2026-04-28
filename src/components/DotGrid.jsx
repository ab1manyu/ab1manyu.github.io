import { useEffect, useState } from 'react';

export default function DotGrid() {
  const [flashes, setFlashes] = useState([]);
  const [pulses, setPulses] = useState([]);

  useEffect(() => {
    const handleFlash = () => {
      const id = Date.now() + Math.random();
      setFlashes(prev => [...prev, id]);
      setTimeout(() => {
        setFlashes(prev => prev.filter(flashId => flashId !== id));
      }, 1500);
    };

    const handlePulse = () => {
      const id = Date.now() + Math.random();
      setPulses(prev => [...prev, id]);
      setTimeout(() => {
        setPulses(prev => prev.filter(pulseId => pulseId !== id));
      }, 3500);
    };

    window.addEventListener('camera-flash', handleFlash);
    window.addEventListener('grid-pulse', handlePulse);

    return () => {
      window.removeEventListener('camera-flash', handleFlash);
      window.removeEventListener('grid-pulse', handlePulse);
    };
  }, []);

  return (
    <>
      <div className="dot-grid pointer-events-none z-[-2] fixed inset-0" />
      {flashes.map(id => (
        <div
          key={`flash-${id}`}
          className="dot-grid-edge-flash pointer-events-none fixed inset-0"
          style={{ zIndex: -1 }}
        />
      ))}
      {pulses.map(id => (
        <div
          key={`pulse-${id}`}
          className="dot-grid-pulse pointer-events-none fixed inset-0"
          style={{ zIndex: -1 }}
        />
      ))}
    </>
  );
}
