// server.js
import http from "http";
import { createConnection } from "@playwright/mcp";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";

const PORT = 8931;

// سيرفر HTTP بسيط
const server = http.createServer(async (req, res) => {
  if (req.url === "/mcp" && req.method === "GET") {
    console.log("🔌 MCP client connected");

    // إنشاء اتصال Playwright MCP
    const connection = await createConnection({
      browser: { launchOptions: { headless: false } }, // لو عايز تشوف المتصفح
      allowedOrigins: ["*"], // السماح لكل origins في البداية
    });

    const transport = new SSEServerTransport("/mcp", res);
    await connection.connect(transport);

    // Example: افتح صفحة معينة تلقائيًا
    const page = await connection.browser.newPage();
    await page.goto("https://example.com");
    console.log("✅ Opened example.com");

    res.writeHead(200, { "Content-Type": "text/event-stream" });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Playwright MCP Server running on http://localhost:${PORT}/mcp`);
});
