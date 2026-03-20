'use client';

import { Button } from "@/components/ui/button";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const [content,setcontent] = useState('');
  const {username} = useParams()
   const [suggestions, setSuggestions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

  const SendMessage = async () => {
    try {
      const response = await axios.post('/api/send-message',{
        username:username,
        content:content
      })

      if(response.data.message === "User Can Not Accept messages!"){
         toast("User Can Not Accept messages!");
      }

      if(response.data.message === "Message sent successfully!" ){
        toast("Message send Successfully",{
                     description: response.data.message
                  });
      }

       

    } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
         toast("Messages Switching Error",{
            description: axiosError.response?.data.message || "Resquest Failed For Swiching!"
      });
    }
  }


  const messageGenerate = async () => {
    setLoading(true)
      try {
        const res = await fetch("/api/message-seggestion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        let fullText = "";

        while (true) {
        const { done, value } = await reader!.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        
        const matches = chunk.match(/"text":"([^"]*)"/g);

        if (matches) {
          const texts = matches.map((m) => m.replace(/"text":"|"/g, ""));
          console.log(texts);
          
          fullText += texts
            .join("")
            .replace(/\\n/g, " ")     // remove escaped newlines
            .replace(/\\\\'/g, "'")   // handle double-escaped quotes
            .replace(/\\'/g, "'")     // handle single-escaped quotes
            .replace(/^['"]+|['"]+$/g, "") // remove quotes at start/end
            .replace(/\s+/g, " ");    // clean up spaces
        }
      }

      // Split final clean text by ||
      const formatted = fullText
        .split("||")
        .map((q) => q.trim())
        .filter(Boolean);

      setSuggestions(formatted);
    } 
        
      catch (err) {
      console.error("Error fetching suggestions:", err);
    } finally {
      setLoading(false);
    }
    
  };

  function handleClickQuestion(q:string){
    setcontent(q)
  }

  return (
    <>
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">Welcome to Your Feedback panel</h1>
          <h3 className="text-lg font-semibold mb-2">Please enter your Feedback</h3>
      <div className="flex items-center">
       <input
            type="text"
            value={content}
            onChange={(e)=>(setcontent(e.target.value))}
            className="input border-2 border-indigo-600 w-full p-2 mr-2"
          />
          <Button onClick={SendMessage}>Send</Button>
          </div>
    </div>

     <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 bg-gray-50">
      <h1 className="text-2xl font-semibold text-gray-800">
        AI Question Generator
      </h1>
      <button
        onClick={messageGenerate}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Questions"}
      </button>

      <div className="w-full max-w-md mt-6 space-y-4">
        {suggestions.length > 0 && (
          <>
            <h2 className="text-lg font-medium text-gray-700">
              Suggested Questions:
            </h2>
            <ul className="list-disc pl-6 space-y-2">
              {suggestions.map((q, i) => (
                <li
                  key={i}
                  className="text-gray-800 cursor-pointer hover:text-blue-600 transition"
                  onClick={() => handleClickQuestion(q)}
                >
                  {q}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
    </>
  )
}
