"use client";

import Messages from "@/components/Messages";
import Recorder, { mimeType } from "@/components/Recorder";
import { SettingsIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import transcript from "@/actions/transcript";
import VoiceSynthesizer from "@/components/VoiceSynthesizer";

const initialState = {
  sender: "",
  response: "",
  id: "",
};

export type Message = {
  sender: string;
  response: string;
  id: string;
};
export default function Home() {
  const [state, formAction] = useFormState(transcript, initialState);
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [displaySettings, setDisplaySettings] = useState(false);

  const submitButtonRef = useRef<HTMLButtonElement | null>(null);

  // Responsible for updating the messages when the Server Action completes
  // when we submit form and it responds the state will change, so it will update the messages when state changes
  useEffect(() => {
    if (state.response && state.sender) {
      setMessages((messages) => [
        {
          sender: state.sender || "",
          response: state.response || "",
          id: state.id || "",
        },
        ...messages,
      ]);
    }
  }, [state]);

  // Blob gives JavaScript something like temporary files, and URL.createObjectURL() lets you treat those blobs as though they were files on a web server.
  // Audio or any file data is typically in the form of Blob
  // blob is like a binary object data...it is like data object which has image, audio, video etc
  const uploadAudio = (blob: Blob) => {
    // it will give us a string which represents the blob
    // const url = URL.createObjectURL(blob);

    // it creates a file..1s argument is the FileBits 2nd one is the File name and then some options
    // we are using webm as our audio format
    // by this we create a file from wahtever we have uploaded (to blob)
    // const file = new File([blob], "audio.webm", { type: blob.type });
    const file = new File([blob], "audio.webm", { type: mimeType });

    // set the file as the value of hidden file input field
    if (fileRef.current) {
      // now the file that we have created we are adding it to the input field
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      // we get our current ref (pointing to input field) and we are assigning our files(dataTransfer.files) to it
      fileRef.current.files = dataTransfer.files;

      // simulate a click and submit the form
      if (submitButtonRef.current) {
        submitButtonRef.current.click();
      }
    }
  };

  return (
    <main className="bg-black h-screen overflow-y-auto">
      {/* Header */}

      <header className="flex justify-between fixed top-0 text-white w-full p-5">
        <Image
          src="https://i.imgur.com/MCHWJZS.png
      "
          alt="Logo"
          width={50}
          height={50}
          className="object-contain"
        />
        <SettingsIcon
          size={40}
          className="p-2 m-2 rounded-full cursor-pointer bg-purple-600 text-black transition-all ease-in-out duration-150 hover:bg-purple-700 hover:text-white"
          onClick={() => setDisplaySettings(!displaySettings)}
        />
      </header>

      {/* Form */}

      <form action={formAction} className="flex flex-col bg-black ">
        <div className="flex-1 bg-gradient-to-b from-purple-500 to-black">
          {/* Messages */}
          <Messages messages={messages} />
        </div>

        {/* Hidden fields */}

        {/* whenever we submit a form, we have to give each of the form elements a name, if we gonna use them i.e here audio */}

        <input type="file" name="audio" ref={fileRef} hidden />
        <button type="submit" hidden ref={submitButtonRef} />
        <div className="fixed bottom-0 w-full overflow-hidden bg-black rounded-t-3xl">
          {/* Recorder */}
          <Recorder uploadAudio={uploadAudio} />

          <div className="">
            {/* Voice Synthesiser -- output of the assistant voice---the model speaks to us */}
            <VoiceSynthesizer state={state} displaySettings={displaySettings} />
          </div>
        </div>
      </form>
    </main>
  );
}
