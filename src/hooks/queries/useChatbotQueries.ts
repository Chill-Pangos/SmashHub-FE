import { useQuery, useMutation } from "@tanstack/react-query";
import { chatbotService } from "@/services";
import { queryKeys } from "./queryKeys";
import type { ChatbotIngestRequest, ChatbotChatRequest } from "@/types";
import { useState, useRef, useCallback } from "react";

export const useChatbotHealth = () => {
  return useQuery({
    queryKey: queryKeys.chatbot.health(),
    queryFn: () => chatbotService.checkHealth(),
  });
};

export const useChatbotFiles = () => {
  return useQuery({
    queryKey: queryKeys.chatbot.files(),
    queryFn: () => chatbotService.getFiles(),
  });
};

export const useUploadDocument = () => {
  return useMutation({
    mutationFn: (file: File) => chatbotService.uploadFile(file),
  });
};

export const useIngestDocuments = () => {
  return useMutation({
    mutationFn: (data?: ChatbotIngestRequest) => chatbotService.ingestDocuments(data),
  });
};

export const useResetCollection = () => {
  return useMutation({
    mutationFn: () => chatbotService.resetCollection(),
  });
};

export const useChatStream = () => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const currentMessageRef = useRef<string>("");

  const sendMessage = useCallback(
    async (request: ChatbotChatRequest) => {
      setIsLoading(true);
      setError(null);
      currentMessageRef.current = "";

      // Add user message
      setMessages((prev) => [...prev, { role: "user", content: request.question }]);
      // Placeholder for assistant
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      await chatbotService.chatStream(
        request,
        (chunk) => {
          currentMessageRef.current += chunk;
          setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1].content = currentMessageRef.current;
            return newMessages;
          });
        },
        () => {
          setIsLoading(false);
        },
        (err) => {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      );
    },
    []
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    setMessages,
  };
};
