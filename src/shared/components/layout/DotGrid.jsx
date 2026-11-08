import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FireworksLayer from "./FireworksLayer";
import styles from "./DotGrid.module.css";

export default function DotGrid() {
  const { pathname } = useLocation();
  const [flashes, setFlashes] = useState([]);
  const [pulses, setPulses] = useState([]);
  const [concentricPulses, setConcentricPulses] = useState([]);

  useEffect(() => {
    const handleFlash = () => {
      const id = Date.now() + Math.random();
      setFlashes((prev) => [...prev, id]);
      setTimeout(() => {
        setFlashes((prev) => prev.filter((flashId) => flashId !== id));
      }, 1500);
    };

    const handlePulse = () => {
      const id = Date.now() + Math.random();
      setPulses((prev) => [...prev, id]);
      setTimeout(() => {
        setPulses((prev) => prev.filter((pulseId) => pulseId !== id));
      }, 3500);
    };

    const handleConcentric = () => {
      const id = Date.now() + Math.random();
      setConcentricPulses((prev) => [...prev, id]);
      setTimeout(() => {
        setConcentricPulses((prev) => prev.filter((pulseId) => pulseId !== id));
      }, 2000);
    };

    window.addEventListener("camera-flash", handleFlash);
    window.addEventListener("grid-pulse", handlePulse);
    window.addEventListener("darts-spiral", handleConcentric);

    return () => {
      window.removeEventListener("camera-flash", handleFlash);
      window.removeEventListener("grid-pulse", handlePulse);
      window.removeEventListener("darts-spiral", handleConcentric);
    };
  }, []);

  return (
    <>
      <div className={styles.baseGrid} />
      {pathname === "/diwali" && <FireworksLayer />}
      {concentricPulses.map((id) => (
        <div key={`concentric-${id}`} className={styles.concentricPulse} />
      ))}
      {flashes.map((id) => (
        <div key={`flash-${id}`} className={styles.edgeFlash} />
      ))}
      {pulses.map((id) => (
        <div key={`pulse-${id}`} className={styles.pulse} />
      ))}
    </>
  );
}
