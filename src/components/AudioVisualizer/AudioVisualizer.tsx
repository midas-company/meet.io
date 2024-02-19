import React, { useEffect, useRef } from "react";

interface AudioVisualizerProps {
  audioData: Uint8Array;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ audioData }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const height = canvas.height;
    const width = canvas.width;
    const context = canvas.getContext("2d");
    if (!context) return;

    const barHeight = 10; // Altura da barrinha

    context.clearRect(0, 0, width, height);
    context.fillStyle = "#161743";

    const x = 0;

    for (const item of audioData) {
      const barWidth = ((item - 100) / 255.0) * width;
      context.fillRect(x, height - barHeight, barWidth, barHeight);
    }
  };

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioData]);

  return <canvas width="500" height="50" ref={canvasRef} />;
};

export default AudioVisualizer;
