import React, { useEffect, useState, useRef } from "react";
import AudioVisualizer from "./AudioVisualizer";

interface AudioAnalyzerProps {
  audio: MediaStream;
}

const AudioAnalyzer: React.FC<AudioAnalyzerProps> = ({ audio }) => {
  const [audioData, setAudioData] = useState<Uint8Array>(new Uint8Array(0));
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const rafIdRef = useRef<number | null>(null);

  useEffect(() => {
    const AudioContext =
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
      window.AudioContext || (window as any)?.webkitAudioContext;
    audioContextRef.current = new AudioContext();
    analyserRef.current = audioContextRef.current.createAnalyser();
    dataArrayRef.current = new Uint8Array(
      analyserRef.current.frequencyBinCount,
    );
    sourceRef.current = audioContextRef.current.createMediaStreamSource(audio);
    sourceRef.current.connect(analyserRef.current);
    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
      if (analyserRef.current) {
        analyserRef.current.disconnect();
      }
      if (sourceRef.current) {
        sourceRef.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audio]);

  const tick = () => {
    if (analyserRef.current) {
      analyserRef.current.getByteTimeDomainData(dataArrayRef.current!);
      setAudioData(new Uint8Array(dataArrayRef.current!));
      rafIdRef.current = requestAnimationFrame(tick);
    }
  };

  return <AudioVisualizer audioData={Uint8Array.from(audioData)} />;
};

export default AudioAnalyzer;
