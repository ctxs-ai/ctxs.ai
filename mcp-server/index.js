import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server
const server = new McpServer({
    name: "ctxs.ai MCP server, providing access to user curated context windows",
    version: "1.0.0"
});

server.resource(
    "contexts-list",
    "ctxs://api/list",
    async (uri) => {
        const response = await fetch("https://ctxs.ai/api/list");
        const data = await response.json();
        return {
            contents: [{
                uri: uri.href,
                text: JSON.stringify(data)
            }]
        }
    }
);
// Add a dynamic greeting resource
server.resource(
    "context-window",
    new ResourceTemplate("ctxs://{context_id}", { list: undefined }),
    async (uri, { context_id }) => {
        const response = await fetch(`https://ctxs.ai/${context_id}`);
        const data = await response.text();
        return {
            contents: [{
                uri: uri.href,
                text: JSON.stringify(data)
            }]
        }
    }
);


// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
console.log("server starting")
await server.connect(transport);