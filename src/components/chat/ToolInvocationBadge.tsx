"use client";

import { Loader2 } from "lucide-react";
import type { ToolInvocation } from "ai";

interface ToolInvocationBadgeProps {
  tool: ToolInvocation;
}

function getLabel(toolName: string, args: Record<string, any>): string {
  const filename = args.path ? args.path.split("/").pop() : null;

  if (toolName === "str_replace_editor") {
    switch (args.command) {
      case "create":
        return filename ? `Creating ${filename}` : "Creating file";
      case "str_replace":
      case "insert":
        return filename ? `Editing ${filename}` : "Editing file";
      case "view":
        return filename ? `Reading ${filename}` : "Reading file";
    }
  }

  if (toolName === "file_manager") {
    switch (args.command) {
      case "delete":
        return filename ? `Deleting ${filename}` : "Deleting file";
      case "rename": {
        const newFilename = args.new_path ? args.new_path.split("/").pop() : null;
        return filename && newFilename
          ? `Renaming ${filename} → ${newFilename}`
          : "Renaming file";
      }
    }
  }

  return toolName;
}

export function ToolInvocationBadge({ tool }: ToolInvocationBadgeProps) {
  const done = tool.state === "result" && tool.result != null;
  const label = getLabel(tool.toolName, tool.args ?? {});

  return (
    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 bg-neutral-50 rounded-lg text-xs font-mono border border-neutral-200">
      {done ? (
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
      ) : (
        <Loader2 className="w-3 h-3 animate-spin text-blue-600" />
      )}
      <span className="text-neutral-700">{label}</span>
    </div>
  );
}
