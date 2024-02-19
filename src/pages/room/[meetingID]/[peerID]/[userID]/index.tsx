"use client";

import { useRouter } from "next/router";
import Head from "next/head";
import { useEffect } from "react";
import { useWebRTC } from "~/hook/useWebRTC";

type Params = {
  meetingID: string;
  peerID: string;
  userID: string;
};

export default function Room() {
  const router = useRouter();
  const { meetingID, peerID, userID } = router.query as Params;

  const {
    senderVideo,
    pcSender,
    setPcSender,
    senderOniceCandidate,

    receiverVideo,
    pcReceiver,
    setPcReceiver,
    receiverOniceCandidate,

    isConnected,
    handleStartCall,
  } = useWebRTC();

  useEffect(() => {
    const newPcSender = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    const newPcReceiver = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    setPcSender(newPcSender);
    setPcReceiver(newPcReceiver);

    return () => {
      newPcSender.close();
      newPcReceiver.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (pcSender) {
      senderOniceCandidate({ meetingID, peerID, userID });
    }
  }, [meetingID, pcSender, peerID, senderOniceCandidate, userID]);

  useEffect(() => {
    if (pcReceiver) {
      receiverOniceCandidate({ meetingID, peerID, userID });
    }
  }, [meetingID, pcReceiver, peerID, receiverOniceCandidate, userID]);

  return (
    <>
      <Head>
        <title>Room</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <p>meetingID: {meetingID}</p>
        <p>peerID: {peerID}</p>
        <p>userID: {userID}</p>
        {!isConnected && (
          <button
            className="rounded bg-indigo-400 px-10 py-1 text-white"
            onClick={handleStartCall}
          >
            call
          </button>
        )}

        <div className="flex items-center justify-center gap-2">
          <video
            className="h-[500px] w-[500px] rounded"
            controls
            autoPlay
            ref={receiverVideo}
          />
          <video
            className="h-[160px] w-[160px] rounded"
            controls
            muted
            autoPlay
            ref={senderVideo}
          />
        </div>
      </main>
    </>
  );
}
