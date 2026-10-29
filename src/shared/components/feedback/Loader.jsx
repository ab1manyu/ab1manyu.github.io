import { useEffect, useState } from "react";
import { useBodyScrollLock } from "@/shared/hooks";
import styles from "./Loader.module.css";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState(["> BIOS_CHECK... OK"]);
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);

  // Disable scrolling while the boot screen is showing
  useBodyScrollLock(visible);

  useEffect(() => {
    if (sessionStorage.getItem("booted")) {
      setVisible(false);
      return;
    }

    const availableLogs = [
      "> MEMORY_TEST... PASS",
      "> ENCRYPTION_KEYS... LOADED",
      "> UPLINK_ESTABLISHED... OK",
      "> LOADING_INTERFACE... 100%",
    ];
    let currentProgress = 0;
    let logIndex = 0;

    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 5) + 1;
      if (currentProgress > 100) currentProgress = 100;

      setProgress(currentProgress);

      if (
        currentProgress > (logIndex + 1) * 25 &&
        logIndex < availableLogs.length
      ) {
        setLogs((prev) => [...prev, availableLogs[logIndex]]);
        logIndex++;
      }

      if (currentProgress === 100) {
        clearInterval(interval);
        sessionStorage.setItem("booted", "true");
        setTimeout(() => {
          setOpacity(0);
          setTimeout(() => {
            setVisible(false);
            // Dispatch event for TextScramble
            window.dispatchEvent(new Event("loader-finished"));
          }, 1000);
        }, 500);
      }
    }, 30);

    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div
      id="loader"
      style={{ opacity }}
      className={`${styles.loader} ${opacity === 0 ? styles.loaderHidden : ""}`}
    >
      <div className="w-64 md:w-96 relative font-mono">
        <div className="flex justify-between text-xs text-gray-500 mb-2 uppercase tracking-widest">
          <span>System_Boot</span>
          <span id="loader-counter">
            {progress.toString().padStart(3, "0")}
          </span>
        </div>
        <div className="h-[2px] bg-defense-border w-full overflow-hidden relative mb-4">
          <div
            id="loader-bar"
            className="h-full bg-defense-accent absolute top-0 left-0 transition-all duration-75 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="h-24 overflow-hidden text-[10px] text-gray-600 font-mono leading-relaxed relative">
          <div className="absolute bottom-0 w-full flex flex-col justify-end">
            {logs.map((log, i) => (
              <div key={i}>{log}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
