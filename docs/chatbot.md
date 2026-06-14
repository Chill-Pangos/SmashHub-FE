# Chatbot API Integration

Base URL: `VITE_CHATBOT_API_URL` (e.g. `http://localhost:8000`)

## System API
### GET `/health`
Check system status (Admin only).
No params.
Response 200:
```json
{
  "status": "ok",
  "ollama_url": "http://localhost:1234/v1",
  "llm_model": "qwen2.5-14b-instruct",
  "embed_model": "text-embedding-bge-m3",
  "chroma_collection": "rag_docs",
  "documents_indexed": 287,
  "lm_studio_status": {
    "status": "ok",
    "code": 200,
    "body": "{\"error\":\"Unexpected endpoint or method. (GET /v1/health)\"}"
  }
}
```

### DELETE `/reset`
Delete all data in ChromaDB collection (Admin only).
*Note: Should have warning with text input confirmation in UI.*

## Documents API
### GET `/files`
List files under `data/` with download URLs.
Response:
```json
{
  "root": "data",
  "files": [
    {
      "name": "chu_de_01_ban_thi_dau.md",
      "path": "documents/chu_de_01_ban_thi_dau.md",
      "size_label": "7.8 KB",
      "modified_at_iso": "2026-06-12T20:11:48.247606Z",
      "download_url": "/files/download/documents/chu_de_01_ban_thi_dau.md"
    }
  ]
}
```

### GET `/files/download/{file_path}`
Download a file under `data/`.
Params:
- `file_path` (string, required): path of the file.

### POST `/upload`
Upload a `.txt` or `.md` file directly to `data/documents/`.
Request body (multipart/form-data):
- `file` (string/$binary, required)

### POST `/ingest`
Ingest documents from `data/documents/` into ChromaDB.
`overwrite=false` (default): Add to existing collection.
`overwrite=true`: Delete old collection and re-ingest all.

Request body example:
```json
{
  "overwrite": false
}
```

200 response:
```json
{
  "status": "string",
  "documents_loaded": 0,
  "chunks_created": 0,
  "collection": "string"
}
```

## Chat API
### POST `/chat`
Ask a question and get text/plain stream response.
Backend auto-detects intent from question.

Rules:
- Normal table tennis rules: ask normally, no token needed.
- SmashHub public data: send scope if FE is on tournament/category/team/schedule pages.
- SmashHub personal data: send header `Authorization: Bearer <token>`.
*Note: Prioritize stream because CPU returns token gradually, better UX than waiting for full JSON response.*

Request body examples:

**Example 1 - SmashHub category context:**
```json
{
  "question": "Kết quả vòng bảng thế nào?",
  "chat_history": [],
  "scope": {
    "tournament_id": 1,
    "category_id": 5,
    "entry_id": null,
    "user_id": null,
    "schedule_id": null,
    "match_id": null
  }
}
```

**Example 2 - SmashHub personal question with Bearer token:**
```json
{
  "question": "Trận sắp tới của tôi là trận nào?",
  "chat_history": [],
  "scope": {
    "tournament_id": null,
    "category_id": null,
    "entry_id": null,
    "user_id": null,
    "schedule_id": null,
    "match_id": null
  }
}
```

**Example 3 - Table tennis rule question:**
```json
{
  "question": "Giao bóng hợp lệ cần làm gì?",
  "chat_history": [],
  "scope": {
    "tournament_id": null,
    "category_id": null,
    "entry_id": null,
    "user_id": null,
    "schedule_id": null,
    "match_id": null
  }
}
```

200 response string:
```text
Khi giao bóng, cả bóng và tay tự do phải ở phía sau đường cuối bàn (nghĩa là ngoài khu vực mặt bàn). Giao bóng từ trên bàn hoặc từ cạnh bàn là sai luật.

[METRICS] latency=35.2620s
```
