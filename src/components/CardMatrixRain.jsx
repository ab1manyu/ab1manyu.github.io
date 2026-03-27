import { useEffect, useRef } from 'react';

export default function CardMatrixRain() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };
    resizeCanvas();

    const resizeObserver = new ResizeObserver(() => {
      resizeCanvas();
    });
    resizeObserver.observe(parent);

    const fontSize = 14;
    let drops = [];
    
    const initDrops = () => {
      const columns = Math.ceil(canvas.width / fontSize);
      drops = Array(columns).fill(1).map(() => Math.random() * -100);
    };
    initDrops();

    let animationFrameId;
    let lastTime = 0;
    const fps = 30;
    const interval = 1000 / fps;

    const draw = () => {
      const currentColumns = Math.ceil(canvas.width / fontSize);
      if (currentColumns > drops.length) {
         const newDrops = Array(currentColumns - drops.length).fill(1).map(() => Math.random() * -100);
         drops = [...drops, ...newDrops];
      }

      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#10b981"; // Defense Accent Green
      ctx.font = `${fontSize}px 'Share Tech Mono', monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = Math.random() > 0.5 ? "abi" : "abi";
        
        if (drops[i] * fontSize >= -fontSize) {
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        }

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const animate = (currentTime) => {
      if (!lastTime) lastTime = currentTime;
      const elapsed = currentTime - lastTime;

      if (elapsed > interval) {
        draw();
        lastTime = currentTime - (elapsed % interval);
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full z-0 opacity-20 pointer-events-none"
    ></canvas>
  );
}
