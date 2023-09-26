import Head from "next/head";
import { useEffect, useRef, useState } from "react";
import SelectInput from "~/components/SelectInput";

type DeviceType = {
  label: string;
  value: string;
};

export default function Prejoin() {
  const [audioDevices, setAudioDevices] = useState<DeviceType[]>([]);
  const [outputDevices, setOutputDevices] = useState<DeviceType[]>([]);
  const [videoDevices, setVideoDevices] = useState<DeviceType[]>([]);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    async function fetchDevices() {
      try {
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        const videoStream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });

        const devices = await navigator.mediaDevices.enumerateDevices();

        const audioInputDevices = devices
          .filter((device) => device.kind === "audioinput")
          .map((device) => ({
            label: device.label,
            value: device.deviceId,
          }));

        const outputDevices = devices
          .filter((device) => device.kind === "audiooutput")
          .map((device) => ({
            label: device.label,
            value: device.deviceId,
          }));

        const videoDevices = devices
          .filter((device) => device.kind === "videoinput")
          .map((device) => ({
            label: device.label,
            value: device.deviceId,
          }));

        setAudioDevices(audioInputDevices);
        setOutputDevices(outputDevices);
        setVideoDevices(videoDevices);

        setAudioStream(audioStream);
        setVideoStream(videoStream);

        if (audioRef.current) {
          audioRef.current.srcObject = audioStream;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = videoStream;
        }
      } catch (error) {
        console.error("Erro ao acessar dispositivos:", error);
      }
    }

    fetchDevices().catch((error) => {
      console.error(
        "Erro ao acessar dispositivos (fora do bloco try-catch):",
        error,
      );
    });

    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
      }
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>Prejoin</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex h-screen flex-col items-center justify-center gap-6">
          <div className="min-w-96 h-96 border-2 border-solid border-black">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="h-full w-full"
            />
          </div>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <SelectInput options={audioDevices} />
              <SelectInput options={outputDevices} />
              <SelectInput options={videoDevices} />
            </div>
            {audioStream && (
              <div>
                <h2>Áudio:</h2>
                <audio ref={audioRef} autoPlay playsInline controls />
              </div>
            )}
            <button className="h-10 w-24 self-center rounded bg-indigo-500 text-white">
              Join
            </button>
          </div>
        </div>
      </main>
    </>
  );
}