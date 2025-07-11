// src/components/chat/chat-message.tsx
import { CheckIcon, CopyIcon } from "@radix-ui/react-icons";
import { ChatRequestOptions } from "ai";
import { Message } from "ai/react";
import { motion } from "framer-motion";
import { RefreshCcw } from "lucide-react";
import { memo, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ButtonWithTooltip from "../button-with-tooltip";
import CodeDisplayBlock from "../code-display-block";
import { Button } from "../ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "../ui/chat/chat-bubble";
import ToolManager from "./tools/ToolManager";

export type ChatMessageProps = {
  message: Message;
  isLast: boolean;
  isLoading: boolean | undefined;
  reload: (chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>;
  addToolResult?: (args: { toolCallId: string; result: string }) => void;
};

const MOTION_CONFIG = {
  initial: { opacity: 0, scale: 1, y: 20, x: 0 },
  animate: { opacity: 1, scale: 1, y: 0, x: 0 },
  exit: { opacity: 0, scale: 1, y: 20, x: 0 },
  transition: {
    opacity: { duration: 0.1 },
    layout: {
      type: "spring",
      bounce: 0.3,
      duration: 0.2,
    },
  },
};

function ChatMessage({ message, isLast, isLoading, reload, addToolResult }: ChatMessageProps) {
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  const renderTextContent = (text: string) => {
    // Split text content by code blocks for Markdown rendering
    const contentParts = text.split("```");
    return contentParts.map((contentPart, contentIndex) =>
      contentIndex % 2 === 0 ? (
        // For regular text (non-code), use Markdown
        <Markdown
          key={contentIndex}
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ ...props }) => (
              <p className="my-2" {...props} />
            ),
            ul: ({ ...props }) => (
              <ul className="list-disc pl-5 -my-6" {...props} />
            ),
            li: ({ ...props }) => (
              <li className="-my-2" {...props} />
            ),
            a: ({ href, children, ...props }) => (
              <a
                href={href}
                className="underline text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
                {...props}
              >
                {children}
              </a>
            ),
          }}
        >
          {contentPart}
        </Markdown>
      ) : (
        // For code blocks, use CodeDisplayBlock
        <pre className="whitespace-pre-wrap" key={contentIndex}>
          <CodeDisplayBlock code={contentPart} />
        </pre>
      )
    );
  };

  const renderParts = () => {
    return message.parts?.map((part, index) => {
      switch (part.type) {
        case "text":
          return (
            <div key={index}>
              {renderTextContent(part.text)}
            </div>
          );
        case "tool-invocation":
          return (
            <ToolManager
              key={`tool-${index}`}
              toolInvocation={part.toolInvocation as any}
              addToolResult={addToolResult}
            />
          );
        default:
          return null;
      }
    });
  };

  const renderActionButtons = () =>
    message.role === "assistant" && (
      <div className="pt-4 flex gap-1 items-center text-muted-foreground">
        {!isLoading && (
          <ButtonWithTooltip side="bottom" toolTipText="Copy">
            <Button onClick={handleCopy} variant="ghost" size="icon" className="h-4 w-4">
              {isCopied ? (
                <CheckIcon className="w-3.5 h-3.5 transition-all" />
              ) : (
                <CopyIcon className="w-3.5 h-3.5 transition-all" />
              )}
            </Button>
          </ButtonWithTooltip>
        )}
        {!isLoading && isLast && (
          <ButtonWithTooltip side="bottom" toolTipText="Regenerate">
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4"
              onClick={() => reload()}
            >
              <RefreshCcw className="w-3.5 h-3.5 scale-100 transition-all" />
            </Button>
          </ButtonWithTooltip>
        )}
      </div>
    );

  // If the message has no content and no parts, don't render anything
  if (!message.content && (!message.parts || message.parts.length === 0)) {
    return null;
  }

  return (
    <motion.div {...MOTION_CONFIG} className="flex flex-col gap-2 whitespace-pre-wrap">
      <ChatBubble variant={message.role === "user" ? "sent" : "received"}>
        {message.role === "assistant" && (
          <ChatBubbleAvatar
            src="/synto/agentProfilePbw.png"
            width={20}
            height={20}
            className="object-contain"
          />
        )}
        <ChatBubbleMessage>
          {/* Render content directly if no parts exist */}
          {!message.parts && message.content && renderTextContent(message.content)}

          {/* Render parts if they exist */}
          {message.parts && renderParts()}

          {/* Action buttons */}
          {renderActionButtons()}
        </ChatBubbleMessage>
      </ChatBubble>
    </motion.div>
  );
}

export default memo(
  ChatMessage,
  (prevProps, nextProps) => {
    if (nextProps.isLast) return false;
    return (
      prevProps.isLast === nextProps.isLast &&
      prevProps.message === nextProps.message
    );
  }
);