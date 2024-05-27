"use client";
import Image from "next/image";
import activeAssistantIcon from "@/img/active.gif";
import notActiveAssistantIcon from "@/img/notactive.png";
import { useEffect, useState } from "react";

const Recorder = ({ uploadAudio }: { uploadAudio: (blob: Blob) => void }) => {
  const [permission, setPermission] = useState(false);
  // stream is how we capture the audio
  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    getMicrophonePermission();
  }, []);

  const getMicrophonePermission = async () => {
    // we are checking the media recorder, if it is present inside the window
    if ("MediaRecorder" in window) {
      try {
        // the prompt message, asking user for the permission (allow or deny)
        // we are only asking for the audio permission
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });

        setPermission(true);
        setStream(streamData);
      } catch (err: any) {
        alert(err.message);
        console.log("errrr", err.message);
      }
    } else {
      alert("The Media API Recorder is not supported in your browser");
    }
  };
  return (
    <div className="flex items-center justify-center text-white">
      <Image
        src={activeAssistantIcon}
        alt="Recording"
        width={350}
        height={350}
        // priority={true}
        priority={true}
        className="assistant grayscale"
      />
    </div>
  );
};

export default Recorder;
