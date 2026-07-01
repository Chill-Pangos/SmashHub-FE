export interface ChatbotHealthResponse {
  status: string;
  ollama_url: string;
  llm_model: string;
  embed_model: string;
  chroma_collection: string;
  documents_indexed: number;
  lm_studio_status: {
    status: string;
    code: number;
    body: string;
  };
}

export interface ChatbotIngestRequest {
  overwrite?: boolean;
}

export interface ChatbotIngestResponse {
  status: string;
  documents_loaded: number;
  chunks_created: number;
  collection: string;
}

export interface ChatbotFileItem {
  name: string;
  path: string;
  size_label: string;
  modified_at_iso: string;
  download_url: string;
}

export interface ChatbotFilesResponse {
  root: string;
  files: ChatbotFileItem[];
}

export interface ChatbotChatRequest {
  question: string;
  chat_history: { role: string; content: string }[];
}
