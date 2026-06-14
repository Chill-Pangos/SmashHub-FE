import axios from "axios";
import type {
  ChatbotHealthResponse,
  ChatbotIngestRequest,
  ChatbotIngestResponse,
  ChatbotFilesResponse,
  ChatbotChatRequest,
} from "@/types";
import authService from "./auth.service";

const baseURL = import.meta.env.VITE_CHATBOT_API_URL || "http://localhost:8000";

const chatbotApi = axios.create({
  baseURL,
});

// Thêm interceptor để đính kèm token nếu có (tuỳ chọn cho các request cần auth, API chatbot có thể cần)
chatbotApi.interceptors.request.use((config) => {
  const token = authService.getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class ChatbotService {
  // System
  async checkHealth(): Promise<ChatbotHealthResponse> {
    const response = await chatbotApi.get<ChatbotHealthResponse>("/health");
    return response.data;
  }

  async resetCollection(): Promise<void> {
    await chatbotApi.delete("/reset");
  }

  // Documents
  async getFiles(): Promise<ChatbotFilesResponse> {
    const response = await chatbotApi.get<ChatbotFilesResponse>("/files");
    return response.data;
  }

  getDownloadUrl(filePath: string): string {
    return `${baseURL}/files/download/${encodeURIComponent(filePath)}`;
  }

  async uploadFile(file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);
    await chatbotApi.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  async ingestDocuments(
    data: ChatbotIngestRequest = { overwrite: false },
  ): Promise<ChatbotIngestResponse> {
    const response = await chatbotApi.post<ChatbotIngestResponse>("/ingest", data);
    return response.data;
  }

  // Chat
  async chatStream(
    request: ChatbotChatRequest,
    onMessage: (chunk: string) => void,
    onComplete?: () => void,
    onError?: (error: unknown) => void,
  ): Promise<void> {
    try {
      const token = authService.getAccessToken();
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`${baseURL}/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        onMessage(chunk);
      }

      onComplete?.();
    } catch (error) {
      onError?.(error);
    }
  }
}

export default new ChatbotService();
