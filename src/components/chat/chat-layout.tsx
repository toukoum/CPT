"use client";

import React from "react";
import Chat, { ChatProps } from "./chat";

type MergedProps = ChatProps;

export function ChatLayout({
  initialMessages,
  id,
}: MergedProps) {
  return (
    <div className="flex w-full h-full justify-center px-4">
      <Chat id={id} initialMessages={initialMessages} />
    </div>
  );
}