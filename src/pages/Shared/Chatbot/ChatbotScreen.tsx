import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { Send, Bot, User, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/store/useAuth";
import { getImageUrl } from "@/utils/api.utils";

interface Message {
  id: string;
  role: "user" | "bot";
  content: string;
}

export default function ChatbotScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const getUserInitials = () => {
    if (!user) return "";
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const displayName = fullName || user.username || user.email || "";
    return displayName
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const initials = getUserInitials();
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: t("chatbot.mockResponse") || "This is a mock response from the AI assistant.",
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] min-h-[500px] max-h-[800px] bg-card border rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-semibold text-lg">{t("chatbot.title") || "AI Assistant"}</h2>
        </div>
        <button
          onClick={handleClear}
          className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-muted"
          title={t("chatbot.clearHistory") || "Clear History"}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
            <div className="p-4 bg-muted rounded-full">
              <Bot className="w-8 h-8 opacity-50" />
            </div>
            <p>{t("chatbot.emptyState") || "How can I help you today?"}</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[80%] ${
                msg.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              }`}
            >
              {msg.role === "user" ? (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  {user?.avatarUrl ? (
                    <AvatarImage src={getImageUrl(user.avatarUrl)} alt="User avatar" />
                  ) : null}
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                    {initials ? <span>{initials}</span> : <User className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`p-3 rounded-2xl ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-muted rounded-tl-sm"
                }`}
              >
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}
        
        {/* Loading State for Bot */}
        {isLoading && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
             <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-muted text-muted-foreground">
                <Bot className="w-4 h-4" />
             </div>
             <div className="p-4 rounded-2xl bg-muted rounded-tl-sm flex items-center gap-1.5 h-[52px]">
                <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce"></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-background">
        <form onSubmit={handleSend} className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("chatbot.placeholder") || "Ask me anything..."}
            className="flex-1 bg-muted/50 border-0 rounded-full pl-6 pr-12 py-3 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-primary-foreground rounded-full hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center h-8 w-8"
          >
            <Send className="w-4 h-4 -ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
