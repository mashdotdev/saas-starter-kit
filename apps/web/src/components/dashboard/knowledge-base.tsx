"use client";

import { useRef, useState } from "react";
import { trpc } from "@/lib/trpc-client";
import { cn } from "@/lib/utils";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB — matches FastAPI backend

interface KnowledgeBaseProps {
  orgId: string;
  role: string;
}

export default function KnowledgeBase({ role }: KnowledgeBaseProps) {
  const isAdmin = role === "admin";
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "uploading" | "success" | "error";
    message?: string;
  }>({ type: "idle" });

  const utils = trpc.useUtils();
  const { data: docs, isLoading } = trpc.ai.docs.list.useQuery();
  const deleteMutation = trpc.ai.docs.delete.useMutation({
    onSuccess: () => utils.ai.docs.list.invalidate(),
  });

  async function uploadFile(file: File) {
    if (file.size > MAX_BYTES) {
      setStatus({ type: "error", message: "File exceeds 10 MB limit." });
      return;
    }

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!["pdf", "txt", "md"].includes(ext)) {
      setStatus({ type: "error", message: "Only PDF, TXT, and MD files are supported." });
      return;
    }

    setStatus({ type: "uploading" });

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/ai/docs/ingest", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Upload failed" }));
        setStatus({ type: "error", message: body.error ?? "Upload failed" });
        return;
      }

      const data = await res.json();
      setStatus({
        type: "success",
        message: `"${file.name}" ingested — ${data.chunks} chunks created.`,
      });
      utils.ai.docs.list.invalidate();
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    }
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    e.target.value = "";
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Upload zone — admin only */}
      {isAdmin && (
        <div className="space-y-3">
          <h2 className="text-xs text-white/40 uppercase tracking-widest">Upload Document</h2>
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer",
              dragging
                ? "border-[#FF5E00] bg-[#FF5E00]/5"
                : "border-white/20 hover:border-white/40",
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md"
              className="hidden"
              onChange={onFileChange}
            />
            <p className="text-white/50 text-sm">
              Drag & drop a file here, or{" "}
              <span className="text-[#FF5E00]">browse</span>
            </p>
            <p className="text-white/25 text-xs mt-1">PDF, TXT, MD — max 10 MB</p>
          </div>

          {status.type !== "idle" && (
            <p
              className={cn(
                "text-sm px-3 py-2 rounded-md",
                status.type === "uploading" && "text-white/50 bg-white/5",
                status.type === "success" && "text-green-400 bg-green-400/10",
                status.type === "error" && "text-red-400 bg-red-400/10",
              )}
            >
              {status.type === "uploading" ? "Uploading…" : status.message}
            </p>
          )}
        </div>
      )}

      {/* Document list */}
      <div className="space-y-3">
        <h2 className="text-xs text-white/40 uppercase tracking-widest">Documents</h2>

        {isLoading ? (
          <p className="text-white/30 text-sm">Loading…</p>
        ) : !docs || docs.length === 0 ? (
          <div className="border border-white/10 rounded-lg px-4 py-8 text-center">
            <p className="text-white/30 text-sm">
              No documents yet.{isAdmin ? " Upload your first document above." : ""}
            </p>
          </div>
        ) : (
          <div className="border border-white/10 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-4 py-2.5 text-white/40 font-normal text-xs uppercase tracking-wider">
                    Filename
                  </th>
                  <th className="px-4 py-2.5 text-white/40 font-normal text-xs uppercase tracking-wider">
                    Chunks
                  </th>
                  {isAdmin && <th className="px-4 py-2.5" />}
                </tr>
              </thead>
              <tbody>
                {docs.map((doc, i) => (
                  <tr
                    key={doc.docId}
                    className={cn(
                      "transition-colors",
                      i !== docs.length - 1 && "border-b border-white/5",
                      "hover:bg-white/5",
                    )}
                  >
                    <td className="px-4 py-3 text-white truncate max-w-xs">
                      {doc.filename}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white/40 text-xs bg-white/5 px-2 py-0.5 rounded-full">
                        {doc.chunks}
                      </span>
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => deleteMutation.mutate({ docId: doc.docId })}
                          disabled={deleteMutation.isPending}
                          className="text-xs text-white/30 hover:text-red-400 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
