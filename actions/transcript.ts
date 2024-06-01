"use server";

import {
  AzureKeyCredential,
  ChatRequestMessage,
  OpenAIClient,
} from "@azure/openai";

async function transcript(prevState: any, formData: FormData) {
  "use server";

  const id = Math.random().toString(36);

  console.log("PREVIOUS STATE:", prevState);
  if (
    process.env.AZURE_API_KEY === undefined ||
    process.env.AZURE_ENDPOINT === undefined ||
    process.env.AZURE_DEPLOYMENT_NAME === undefined ||
    process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME === undefined
  ) {
    console.error("Azure credentials not set");
    return {
      sender: "",
      response: "Azure credentials not set",
    };
  }

  const file = formData.get("audio") as File;
  if (file.size === 0) {
    return {
      sender: "",
      response: "No audio file provided",
    };
  }

  console.log(">>", file);

  const arrayBuffer = await file.arrayBuffer();
  // converted the file in long sequence of characters, we can't just send the whole file across the internet
  const audio = new Uint8Array(arrayBuffer);

  // ---   get audio transcription from Azure OpenAI Whisper ----
  console.log("== Transcribe Audio Sample ==");
  // STEP 1: to get openAI client
  const client = new OpenAIClient(
    process.env.AZURE_ENDPOINT,
    new AzureKeyCredential(process.env.AZURE_API_KEY)
  );
  // STEP 2: GET TEH RESULT --> GET THE RESULT FROM MY VOICE

  const result = await client.getAudioTranscription(
    process.env.AZURE_DEPLOYMENT_NAME,
    audio
  );
  // at this point my voice is already taken and ran it through the whisper AI, to get  my voice turned into text
  console.log(`Transcription: ${result.text}`);

  // ---   get chat completion from Azure OpenAI ----
  // pass that text into Azure's OPENAI service to get the response from an assistant
  const messages: ChatRequestMessage[] = [
    {
      role: "system",
      content:
        "You are a helpful assistant. You will answer questions and reply I cannot answer that if you dont know the answer.",
    },

    // the text(data) we got from whisper AI, we now pass that to ChatGPT
    { role: "user", content: result.text },
  ];

  console.log(`Messages: ${messages.map((m) => m.content).join("\n")}`);

  const completions = await client.getChatCompletions(
    process.env.AZURE_DEPLOYMENT_COMPLETIONS_NAME,
    messages,
    { maxTokens: 128 }
  );

  console.log("chatbot: ", completions.choices[0].message?.content);

  // the first choice that comeback will be the response
  const response = completions.choices[0].message?.content;

  console.log(prevState.sender, "+++", result.text);
  return {
    // sendder:result.text: the text that i spoke that got transcribed usng the whisper AI will be the sender
    sender: result.text,
    // response from the chatGPT
    response: response,
    id: id,
  };
}

export default transcript;
