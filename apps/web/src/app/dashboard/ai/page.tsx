import ChatInterface from "@/components/dashboard/chat-interface";

export default function AiPage() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-heading uppercase text-white tracking-tight">
          AI Assistant
        </h1>
        <p className="text-sm text-white/50 mt-1">
          Streaming chat powered by GPT-4o mini
        </p>
      </div>
      <ChatInterface />
    </div>
  );
}
