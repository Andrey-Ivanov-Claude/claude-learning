import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolInvocationBadge } from "../ToolInvocationBadge";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

function pending(toolName: string, args: Record<string, any>): ToolInvocation {
  return { toolCallId: "1", state: "call", toolName, args };
}

function done(toolName: string, args: Record<string, any>): ToolInvocation {
  return { toolCallId: "1", state: "result", toolName, args, result: "ok" };
}

test("shows 'Creating <filename>' for str_replace_editor create", () => {
  render(<ToolInvocationBadge tool={pending("str_replace_editor", { command: "create", path: "/components/Button.jsx" })} />);
  expect(screen.getByText("Creating Button.jsx")).toBeDefined();
});

test("shows 'Editing <filename>' for str_replace_editor str_replace", () => {
  render(<ToolInvocationBadge tool={pending("str_replace_editor", { command: "str_replace", path: "/App.jsx" })} />);
  expect(screen.getByText("Editing App.jsx")).toBeDefined();
});

test("shows 'Editing <filename>' for str_replace_editor insert", () => {
  render(<ToolInvocationBadge tool={pending("str_replace_editor", { command: "insert", path: "/App.jsx" })} />);
  expect(screen.getByText("Editing App.jsx")).toBeDefined();
});

test("shows 'Reading <filename>' for str_replace_editor view", () => {
  render(<ToolInvocationBadge tool={pending("str_replace_editor", { command: "view", path: "/App.jsx" })} />);
  expect(screen.getByText("Reading App.jsx")).toBeDefined();
});

test("shows 'Deleting <filename>' for file_manager delete", () => {
  render(<ToolInvocationBadge tool={pending("file_manager", { command: "delete", path: "/components/Old.jsx" })} />);
  expect(screen.getByText("Deleting Old.jsx")).toBeDefined();
});

test("shows 'Renaming <old> → <new>' for file_manager rename", () => {
  render(<ToolInvocationBadge tool={pending("file_manager", { command: "rename", path: "/components/Old.jsx", new_path: "/components/New.jsx" })} />);
  expect(screen.getByText("Renaming Old.jsx → New.jsx")).toBeDefined();
});

test("falls back to tool name for unknown tools", () => {
  render(<ToolInvocationBadge tool={pending("unknown_tool", {})} />);
  expect(screen.getByText("unknown_tool")).toBeDefined();
});

test("shows fallback label when path is missing", () => {
  render(<ToolInvocationBadge tool={pending("str_replace_editor", { command: "create" })} />);
  expect(screen.getByText("Creating file")).toBeDefined();
});

test("shows spinner while pending", () => {
  const { container } = render(
    <ToolInvocationBadge tool={pending("str_replace_editor", { command: "create", path: "/App.jsx" })} />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("shows green dot when done", () => {
  const { container } = render(
    <ToolInvocationBadge tool={done("str_replace_editor", { command: "create", path: "/App.jsx" })} />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});
