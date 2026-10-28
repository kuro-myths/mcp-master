# MCP Master 🛠️

Kumpulan **tools utilitas siap pakai** lewat protokol [MCP](https://modelcontextprotocol.io) (Model Context Protocol) — tinggal colok ke client MCP favoritmu (Claude Desktop, VS Code, dll).

## Tools
| Tool | Fungsi |
|---|---|
| `get_time` | Waktu saat ini dengan zona waktu IANA (default Asia/Jakarta) |
| `gen_uuid` | Generate UUID v4 (1–50 sekaligus) |
| `base64` | Encode/decode Base64 |
| `hash_text` | Hash teks: md5, sha1, sha256, sha512 |
| `gen_password` | Password acak kuat (6–128 karakter) |

## Cara pakai

```bash
npm install
npm start
```

### Claude Desktop (`claude_desktop_config.json`)
```json
{
  "mcpServers": {
    "mcp-master": {
      "command": "node",
      "args": ["/path/ke/mcp-master/index.js"]
    }
  }
}
```
