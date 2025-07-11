'use client';

import useChatStore from '@/app/hooks/useChatStore';
import { executeToolCall } from '@/components/chat/tools/ToolExecutor';
import { useChat } from '@ai-sdk/react';
import { useAppKitAccount } from '@reown/appkit/react'; // ✅ Reown
import { ChatRequestOptions, generateId } from 'ai';
import { Message } from 'ai/react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import { toast } from 'sonner';

import CardList from './CardList';
import ChatBottombar from './chat-bottombar';
import ChatList from './chat-list';
import ChatTopbar from './chat-topbar';

export interface ChatProps {
  id: string;
  initialMessages: Message[] | [];
}

export default function Chat({ initialMessages, id }: ChatProps) {
  /* ────── Wallet address via Reown AppKit ────── */
  const { address } = useAppKitAccount();                          // ✅
  const userWalletAddress = address ?? undefined;

  /* ────── Zustand store helpers ────── */
  const saveMessages     = useChatStore((state) => state.saveMessages);
  const getMessagesById  = useChatStore((state) => state.getMessagesById);
  const isLocal          = useChatStore((state) => state.isLocal);

  const router = useRouter();
  const [loadingSubmit, setLoadingSubmit] = React.useState(false);

  /* ────── AI Chat hook (ai-sdk) ────── */
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
    setMessages,
    setInput,
    reload,
    addToolResult,
  } = useChat({
    id,
    initialMessages,
    maxSteps: 5,
    onResponse: () => setLoadingSubmit(false),
    onFinish: (message) => {
      const savedMessages = getMessagesById(id);
      saveMessages(id, [...savedMessages, message]);
      setLoadingSubmit(false);
      router.replace(`/agent/c/${id}`);
    },
    onError: (error) => {
      setLoadingSubmit(false);
      console.error('Chat error:', error.message, error.cause);
      toast.error(`Error: ${error.message}`);
    },
    onToolCall: async (tool) => executeToolCall(tool, userWalletAddress), // ✅
  });

  /* ────── Helpers ────── */
  const isToolInProgress = useCallback(
    () =>
      messages.some(
        (m) =>
          m.role === 'assistant' &&
          m.parts?.some(
            (p) =>
              p.type === 'tool-invocation' && p.toolInvocation?.state !== 'result',
          ),
      ),
    [messages],
  );

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prevent new user input while a tool is running
    if (isToolInProgress()) {
      toast.warning('Please complete the current action before continuing');
      return;
    }

    const userMessage: Message = { id: generateId(), role: 'user', content: input };
    saveMessages(id, [...messages, userMessage]);
    setLoadingSubmit(true);

    const requestOptions: ChatRequestOptions = { body: { isLocal } };
    handleSubmit(e, requestOptions);
  };

  const removeLatestMessage = () => {
    const updated = messages.slice(0, -1);
    setMessages(updated);
    saveMessages(id, updated);
    return updated;
  };

  const handleStop = () => {
    stop();
    saveMessages(id, [...messages]);
    setLoadingSubmit(false);
  };

  /* ────── UI ────── */
  const isNewChat = messages.length === 0;

  return (
    <div className="flex flex-col w-full h-full">
      <div className="sticky top-0">
        <ChatTopbar
          isLoading={isLoading}
          chatId={id}
          messages={messages}
          setMessages={setMessages}
          isNewChat={isNewChat}
        />
      </div>

      {isNewChat ? (
        /* -------- Landing (first message) -------- */
        <div className="flex flex-col h-full w-full items-center justify-center md:p-6 md:max-w-5xl mx-auto">
          <div className="w-full flex flex-col items-center mb-8">
            <div className="relative">
              <div className="absolute -z-10 inset-0 rounded-full bg-primary/10 blur-3xl opacity-20 animate-pulse" />
              <Image
                src="/synto/agentProfilePbw.png"
                alt="Agent"
                width={120}
                height={120}
                className="w-24 rounded-full shadow-xl object-cover"
              />
            </div>
            <h2 className="text-2xl font-bold mt-6 mb-2">Synto Agent</h2>
          </div>

          <div className="w-full md:px-12 max-w-3xl mx-auto">
            <ChatBottombar
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={onSubmit}
              isLoading={isLoading}
              stop={handleStop}
              setInput={setInput}
              isToolInProgress={isToolInProgress()}
              isMiddle
            />
          </div>

          <div className="mt-10 w-full overflow-y-auto overflow-visible hidden md:block">
            <CardList />
          </div>
        </div>
      ) : (
        /* -------- Ongoing conversation -------- */
        <>
          <div className="flex-1 w-full max-w-4xl mx-auto overflow-y-auto">
            <ChatList
              messages={messages}
              isLoading={isLoading}
              loadingSubmit={loadingSubmit}
              reload={async () => {
                removeLatestMessage();
                setLoadingSubmit(true);
                const opts: ChatRequestOptions = { body: { isLocal } };
                return reload(opts);
              }}
              addToolResult={addToolResult}
            />
          </div>
          <div className="w-full max-w-3xl mx-auto">
            <ChatBottombar
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={onSubmit}
              isLoading={isLoading}
              stop={handleStop}
              setInput={setInput}
              isToolInProgress={isToolInProgress()}
              isMiddle={false}
            />
          </div>
        </>
      )}
    </div>
  );
}
