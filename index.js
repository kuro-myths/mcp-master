#!/usr/bin/env node
/**
 * MCP Master — kumpulan tools utilitas via MCP (stdio)
 * Jalankan: node index.js
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import crypto from "node:crypto";

const server = new McpServer({ name: "mcp-master", version: "1.0.0" });

// Tool 1: waktu sekarang (dengan zona waktu)
server.tool(
  "get_time",
  "Ambil waktu saat ini, default zona Asia/Jakarta",
  { timezone: z.string().optional().describe("Zona waktu IANA, mis. Asia/Jakarta") },
  async ({ timezone }) => {
    const tz = timezone || "Asia/Jakarta";
    try {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat("id-ID", {
        timeZone: tz, dateStyle: "full", timeStyle: "long",
      }).format(now);
      return { content: [{ type: "text", text: `Waktu (${tz}): ${formatted}\nISO: ${now.toISOString()}` }] };
    } catch {
      return { content: [{ type: "text", text: `Error: zona waktu '${tz}' tidak valid.` }], isError: true };
    }
  }
);

// Tool 2: generator UUID v4
server.tool("gen_uuid", "Generate UUID v4", { count: z.number().int().min(1).max(50).default(1) },
  async ({ count }) => ({
    content: [{ type: "text", text: Array.from({ length: count }, () => crypto.randomUUID()).join("\n") }],
  })
);

// Tool 3: base64 encode/decode
server.tool(
  "base64",
  "Encode atau decode Base64",
  { text: z.string(), mode: z.enum(["encode", "decode"]).default("encode") },
  async ({ text, mode }) => {
    try {
      const out = mode === "encode"
        ? Buffer.from(text, "utf8").toString("base64")
        : Buffer.from(text, "base64").toString("utf8");
      return { content: [{ type: "text", text: out }] };
    } catch {
      return { content: [{ type: "text", text: "Error: input Base64 tidak valid." }], isError: true };
    }
  }
);

// Tool 4: hash teks (md5/sha1/sha256/sha512)
server.tool(
  "hash_text",
  "Hitung hash dari sebuah teks",
  { text: z.string(), algo: z.enum(["md5", "sha1", "sha256", "sha512"]).default("sha256") },
  async ({ text, algo }) => ({
    content: [{ type: "text", text: crypto.createHash(algo).update(text, "utf8").digest("hex") }],
  })
);

// Tool 5: generator password acak
server.tool(
  "gen_password",
  "Generate password acak yang kuat",
  { length: z.number().int().min(6).max(128).default(16) },
  async ({ length }) => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*_-+";
    const bytes = crypto.randomBytes(length);
    const pw = Array.from(bytes, (b) => chars[b % chars.length]).join("");
    return { content: [{ type: "text", text: pw }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
console.error("MCP Master berjalan di stdio");
