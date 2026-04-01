"use client";

import { useChat } from "@ai-sdk/react";
import { TextStreamChatTransport } from "ai";
import { useRef, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export default function ChatInterface() {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new TextStreamChatTransport({ api: "/api/ai/chat" }),
  });

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isStreaming = status === "streaming" || status === "submitted";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    sendMessage({ text });
    setInput("");
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-3xl mx-auto">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="text-3xl mb-3">◉</div>
            <p className="text-sm font-medium text-white uppercase tracking-wider mb-1">
              AI Assistant
            </p>
            <p className="text-xs text-white/40 max-w-xs">
              Ask anything. The agent can use tools and reason through complex tasks.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2.5 text-sm leading-relaxed",
                message.role === "user"
                  ? "bg-white text-black"
                  : "bg-white/5 border border-white/10 text-white/90",
              )}
            >
              {message.parts.map((part, i) =>
                part.type === "text" ? (
                  <span key={i} className="whitespace-pre-wrap">
                    {part.text}
                  </span>
                ) : null,
              )}
            </div>
          </div>
        ))}

        {isStreaming && messages[messages.length - 1]?.role === "user" && (
          <div className="flex justify-start">
            <div className="bg-white/5 border border-white/10 rounded-lg px-4 py-2.5">
              <span className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0ms]" />
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:150ms]" />
                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:300ms]" />
              </span>
            </div>
          </div>
        )}

        {error && (
          <div className="flex justify-center">
            <p className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-md">
              {error.message.includes("429")
                ? "Rate limit reached. Wait a minute before sending more messages."
                : error.message || "Something went wrong. Please try again."}
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 pt-4 border-t border-white/10"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isStreaming}
          placeholder={isStreaming ? "Thinking…" : "Ask anything…"}
          className={cn(
            "flex-1 px-4 py-2.5 rounded-md text-sm",
            "bg-white/5 border border-white/10 text-white placeholder:text-white/30",
            "focus:outline-none focus:ring-1 focus:ring-white/30",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          )}
        />
        <button
          type="submit"
          disabled={isStreaming || !input.trim()}
          className={cn(
            "px-4 py-2.5 rounded-md text-sm font-semibold uppercase tracking-wider",
            "bg-white text-black transition-opacity",
            "disabled:opacity-40 disabled:cursor-not-allowed",
          )}
        >
          Send
        </button>
      </form>
    </div>
  );
}
