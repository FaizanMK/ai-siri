import Messages from "@/components/Messages";
import { SettingsIcon } from "lucide-react";
import Image from "next/image";

export default function Home() {
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
        />
      </header>

      {/* Form */}

      <form className="flex flex-col bg-black ">
        <div className="flex-1 bg-gradient-to-b from-purple-500 to-black">
          {/* Messages */}
          <Messages />
        </div>

        {/* Hidden fields */}
        <input type="file" hidden />
        <button type="submit" hidden />
        <div className="flxed bottom-0 w-full overflow-hidden bg-black rounded-t-3xl">
          {/* Recorder */}

          <div className="">
            {/* Voice Synthesiser -- output of the assistant voice */}
          </div>
        </div>
      </form>
    </main>
  );
}
