import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { Send, Bot, User, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/store/useAuth";
import { getImageUrl } from "@/utils/api.utils";
import { useChatStream } from "@/hooks/queries";

export default function ChatbotScreen() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { tournamentId, categoryId, entryId, matchId, scheduleId } = useParams();
  
  const { messages, isLoading, sendMessage, setMessages } = useChatStream();
  const [input, setInput] = useState("");
  const [contextMode, setContextMode] = useState<"personal" | "general">("personal");

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const question = input.trim();
    setInput("");

    let scope = {
      tournament_id: null as number | null,
      category_id: null as number | null,
      entry_id: null as number | null,
      user_id: null as number | null,
      schedule_id: null as number | null,
      match_id: null as number | null,
    };

    if (contextMode === "personal") {
      scope = {
        tournament_id: tournamentId ? parseInt(tournamentId, 10) : null,
        category_id: categoryId ? parseInt(categoryId, 10) : null,
        entry_id: entryId ? parseInt(entryId, 10) : null,
        user_id: user ? user.id : null,
        schedule_id: scheduleId ? parseInt(scheduleId, 10) : null,
        match_id: matchId ? parseInt(matchId, 10) : null,
      };
    }

    await sendMessage({
      question,
      chat_history: messages.map(m => ({ role: m.role, content: m.content })),
      scope,
    });
  };

  const handleClear = () => {
    setMessages([]);
  };

  const renderMessageContent = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (parsed[0].endpoint === '/entries/me') {
          return (
            <div className="space-y-3 w-full mt-1 text-foreground">
              {parsed.map((group: any, idx: number) => (
                <div key={idx} className="space-y-2">
                  {group.label && <h4 className="font-medium text-sm">{group.label}</h4>}
                  <div className="flex flex-col gap-2">
                    {group.data?.rows?.map((row: any) => (
                      <div key={row.id} className="p-3 bg-background border rounded-lg shadow-sm text-sm">
                        <div className="font-semibold text-primary">{row.category?.tournament?.name || t("chatbot.unknownTournament", "Unknown Tournament")}</div>
                        <div className="text-xs text-muted-foreground mb-2">{row.category?.name || t("chatbot.unknownCategory", "Unknown Category")}</div>
                        <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-xs">
                          <div><span className="font-medium">{t("chatbot.status", "Status:")}</span> <span className="capitalize">{row.category?.tournament?.status}</span></div>
                          <div className="truncate" title={row.category?.tournament?.location}><span className="font-medium">{t("chatbot.location", "Location:")}</span> {row.category?.tournament?.location || t("chatbot.tbd", "TBD")}</div>
                          <div><span className="font-medium">{t("chatbot.fee", "Fee:")}</span> {row.category?.entryFee && row.category?.entryFee !== "0.00" ? `${Number(row.category?.entryFee).toLocaleString()}đ` : t("chatbot.free", "Free")}</div>
                          <div><span className="font-medium">{t("chatbot.role", "Role:")}</span> <span className="capitalize">{row.userRole}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          );
        }

        if (parsed[0].endpoint?.startsWith('/users/')) {
          return (
            <div className="space-y-3 w-full mt-1 text-foreground">
              {parsed.map((group: any, idx: number) => {
                const u = group.data;
                if (!u) return null;
                const fullName = `${u.firstName || ""} ${u.lastName || ""}`.trim();
                return (
                  <div key={idx} className="space-y-2">
                    {group.label && <h4 className="font-medium text-sm">{group.label}</h4>}
                    <div className="p-3 bg-background border rounded-lg shadow-sm text-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10 border">
                          {u.avatarUrl ? <AvatarImage src={getImageUrl(u.avatarUrl)} alt="User avatar" /> : null}
                          <AvatarFallback><User className="w-5 h-5" /></AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-primary">{fullName || t("chatbot.unknownUser", "Unknown User")}</div>
                          <div className="text-xs text-muted-foreground">{u.email}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-y-2 gap-x-2 text-xs">
                        {u.phoneNumber && <div><span className="font-medium text-muted-foreground">{t("chatbot.phone", "Phone:")}</span> <div>{u.phoneNumber}</div></div>}
                        {u.gender && <div><span className="font-medium text-muted-foreground">{t("chatbot.gender", "Gender:")}</span> <div className="capitalize">{u.gender}</div></div>}
                        {u.dob && <div><span className="font-medium text-muted-foreground">{t("chatbot.dob", "DOB:")}</span> <div>{new Date(u.dob).toLocaleDateString()}</div></div>}
                        {u.eloScore !== null && u.eloScore !== undefined && <div><span className="font-medium text-muted-foreground">{t("chatbot.elo", "Elo:")}</span> <div>{u.eloScore}</div></div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        }
      }
      return (
        <div className="bg-background/50 p-2 rounded border overflow-x-auto mt-1 max-w-full">
           <pre className="text-xs text-foreground">{JSON.stringify(parsed, null, 2)}</pre>
        </div>
      );
    } catch (e) {
      const errorMatch = content.match(/(\{.*\})/);
      if (errorMatch) {
        try {
          const parsedErr = JSON.parse(errorMatch[1]);
          if (parsedErr?.error?.message) {
            const prefix = content.replace(errorMatch[1], '').trim();
            return (
              <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md border border-destructive/20 mt-1">
                {prefix && <p className="font-semibold mb-1">{prefix}</p>}
                <p>{parsedErr.error.message}</p>
              </div>
            );
          }
        } catch (err) {
          // Ignore and fallback to raw content
        }
      }
      return <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>;
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] min-h-[500px] max-h-[800px] bg-card border rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <h2 className="font-semibold text-lg">{t("chatbot.title", "AI Assistant")}</h2>
        </div>
        <button
          onClick={handleClear}
          className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-muted"
          title={t("chatbot.clearHistory", "Clear History")}
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
            <p>{t("chatbot.emptyState", "How can I help you today?")}</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
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
                    : "bg-muted rounded-tl-sm w-full"
                }`}
              >
                {renderMessageContent(msg.content)}
              </div>
            </div>
          ))
        )}
        
        {/* Loading State for Bot */}
        {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
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
        <div className="mb-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setContextMode("personal")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              contextMode === "personal"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {t("chatbot.modePersonal", "My Information / Tournaments")}
          </button>
          <button
            type="button"
            onClick={() => setContextMode("general")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              contextMode === "general"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {t("chatbot.modeGeneral", "Table Tennis Rules / General Info")}
          </button>
        </div>
        <form onSubmit={handleSend} className="flex gap-2 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("chatbot.placeholder", "Ask me anything...")}
            className="flex-1 bg-muted/50 border-0 rounded-full pl-6 pr-12 py-3 focus:ring-2 focus:ring-primary focus:outline-none transition-shadow"
            disabled={isLoading && !messages[messages.length - 1]?.content}
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

