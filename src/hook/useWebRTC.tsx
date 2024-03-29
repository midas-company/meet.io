import axios from "axios";
import { useCallback, useRef, useState } from "react";

export type Sdp = {
  sdp: string;
};

type OniceCandidateParams = {
  meetingID: string;
  userID: string;
  peerID: string;
};

export const useWebRTC = () => {
  const senderVideo = useRef<HTMLVideoElement>(null);
  const receiverVideo = useRef<HTMLVideoElement>(null);

  const [pcSender, setPcSender] = useState<RTCPeerConnection | null>(null);
  const [pcReceiver, setPcReceiver] = useState<RTCPeerConnection | null>(null);

  const [isConnected, setIsConnected] = useState(false);

  const senderOniceCandidate = useCallback(
    (params: OniceCandidateParams) => {
      const { meetingID, userID, peerID } = params;

      if (pcSender) {
        pcSender.onicecandidate = (event) => {
          if (event.candidate === null) {
            axios
              .post<Sdp>(
                `https://3578-177-55-229-207.ngrok-free.app/webrtc/sdp/m/${meetingID}/c/${userID}/p/${peerID}/s/true`,
                {
                  sdp: btoa(JSON.stringify(pcSender.localDescription)),
                },
              )
              .then((res) => {
                const sdp = JSON.parse(
                  atob(res.data.sdp),
                ) as RTCSessionDescriptionInit;
                pcSender
                  .setRemoteDescription(new RTCSessionDescription(sdp))
                  .catch(console.log);
              })
              .catch(console.log);
          }
        };
      }
    },
    [pcSender],
  );

  const receiverOniceCandidate = useCallback(
    (params: OniceCandidateParams) => {
      const { meetingID, peerID, userID } = params;
      if (pcReceiver) {
        pcReceiver.onicecandidate = (event) => {
          if (event.candidate === null) {
            axios
              .post<Sdp>(
                `https://3578-177-55-229-207.ngrok-free.app/webrtc/sdp/m/${meetingID}/c/${userID}/p/${peerID}/s/false`,
                {
                  sdp: btoa(JSON.stringify(pcReceiver.localDescription)),
                },
              )
              .then((res) => {
                const sdp = JSON.parse(
                  atob(res.data.sdp),
                ) as RTCSessionDescriptionInit;
                pcReceiver
                  .setRemoteDescription(new RTCSessionDescription(sdp))
                  .catch(console.log);
              })
              .catch(console.log);
          }
        };
      }
    },
    [pcReceiver],
  );

  const handleStartCall = useCallback(() => {
    if (!pcReceiver || !pcSender) {
      console.log("pcReceiver and pcSender is missing!");
      return;
    }

    // sender part of the call
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        if (senderVideo.current) {
          senderVideo.current.srcObject = stream;

          const tracks = stream.getTracks();
          tracks.forEach((_, i) => {
            const mediaTrack = stream.getTracks()[i];
            if (mediaTrack) {
              pcSender.addTrack(mediaTrack);
            }
          });

          pcSender
            .createOffer()
            .then((d) => pcSender.setLocalDescription(d))
            .catch(console.log);
        }
        // you can use event listner so that you inform he is connected!
        pcSender.addEventListener("connectionstatechange", () => {
          console.log(pcSender.connectionState);
          if (pcSender.connectionState === "connected") {
            console.log("connected!");
            setIsConnected(true);
          }
        });

        // receiver part of the call
        pcReceiver.addTransceiver("video", { direction: "recvonly" });
        pcReceiver
          .createOffer()
          .then((d) => pcReceiver.setLocalDescription(d))
          .catch(console.log);

        pcReceiver.ontrack = (event) => {
          if (receiverVideo.current) {
            console.log({ event });
            const media = event.streams[0];
            if (media) {
              receiverVideo.current.srcObject = media;
            }
            receiverVideo.current.autoplay = true;
            receiverVideo.current.controls = true;
          }
        };
      })
      .catch(console.log);
  }, [pcReceiver, pcSender]);

  return {
    senderVideo,
    receiverVideo,
    pcSender,
    setPcSender,
    pcReceiver,
    setPcReceiver,
    isConnected,
    senderOniceCandidate,
    receiverOniceCandidate,
    handleStartCall,
  };
};
