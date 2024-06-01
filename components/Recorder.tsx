"use client";
import Image from "next/image";
import activeAssistantIcon from "@/img/active.gif";
import notActiveAssistantIcon from "@/img/notactive.png";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

export const mimeType = "audio/webm";

const Recorder = ({ uploadAudio }: { uploadAudio: (blob: Blob) => void }) => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);

  // pending will become true once we submit a server action, if the child element is inside the form which this component(Recorder) is. so once this form submit the server action so this recorder component, useFormStatus will say pending :true while it is submitting
  const { pending } = useFormStatus();
  const [permission, setPermission] = useState(false);
  // stream is how we capture the audio, stream is where we get the permissions
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

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

  const startRecording = async () => {
    // 1->  if we don't have the permission for the stream (audio), then return
    // 2-> if we have already submitted the form then return
    // pending will become true once we submit a server action, if the child element is inside the form which this component(Recorder) is. so once this form submit the server action so this recorder component, useFormStatus will say pending :true while it is submitting
    if (stream === null || pending || mediaRecorder === null) return;

    setRecordingStatus("recording");
    // Create a new MediaRecorder instance using  the stream (stream is where we get the permissions from user)..1st argument: strema where we get the permission..2nd is the file type, the key is mimeType and it is also value so we shorthand it
    const media = new MediaRecorder(stream, { mimeType });
    // we created media recorder in above code and now assigned it to this reference
    mediaRecorder.current = media;
    // this will start the recording
    mediaRecorder.current.start();
    // we record our audio in chunks
    let localAudioChunks: Blob[] = [];
    // so every time data is available then fire off an event
    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === "undefined") return;
      // if we click and then immediately stop
      if (event.data.size === 0) return;
      // otherwise we store the data that came through in localAudioCHunks and we keep pushing in that array
      localAudioChunks.push(event.data);
    };
    setAudioChunks(localAudioChunks);
  };

  const stopRecording = () => {
    if (mediaRecorder.current === null || pending) return;

    setRecordingStatus("inactive");
    //stops the recording instance
    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      const audioUrl = URL.createObjectURL(audioBlob);
      //   setAudio(audioUrl);
      uploadAudio(audioBlob);
      setAudioChunks([]);
    };
  };

  return (
    <div className="flex items-center justify-center text-white">
      {!permission && (
        <button onClick={getMicrophonePermission}>Get Microphone</button>
      )}
      {pending && (
        <Image
          src={activeAssistantIcon}
          alt="Recording"
          width={350}
          height={350}
          onClick={stopRecording}
          priority={true}
          className="assistant grayscale"
        />
      )}
      {permission && recordingStatus === "inactive" && !pending ? (
        <Image
          src={notActiveAssistantIcon}
          alt="Not Recording"
          width={350}
          height={350}
          onClick={startRecording}
          priority={true}
          className="assistant cursor-pointer hover:scale-110 duration-150 transition-all ease-in-out"
        />
      ) : null}
      {recordingStatus === "recording" ? (
        <Image
          src={activeAssistantIcon}
          alt="Recording"
          width={350}
          height={350}
          onClick={stopRecording}
          priority={true}
          className="assistant cursor-pointer hover:scale-110 duration-150 transition-all ease-in-out"
        />
      ) : null}{" "}
    </div>
  );
};

export default Recorder;
