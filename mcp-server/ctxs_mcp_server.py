from mcp.server.fastmcp import FastMCP
import json

# ---------------------------------------------------
# Mock API Layer (Replace with your actual API impl)
# ---------------------------------------------------
class ContextAPI:
    def __init__(self):
        self.context_store = {
            "ctx-001": json.dumps({"content": "Project documentation", "size": 512}),
            "ctx-002": json.dumps({"content": "User session data", "size": 1024}),
        }

    def list_context_windows(self):
        """Returns list of available context IDs"""
        return list(self.context_store.keys())

    def get_context_window(self, ctx_id: str):
        """Returns context data by ID"""
        return self.context_store.get(ctx_id, "Context not found")

# ---------------------------------------------------
# MCP Server Implementation
# ---------------------------------------------------
api = ContextAPI()
mcp = FastMCP("ctxs.ai Context Server", version="1.0.0")

@mcp.resource("ctxs://contexts")
def list_available_contexts():
    """Resource listing all available context windows"""
    contexts = api.list_context_windows()
    return json.dumps({
        "contexts": [
            {"id": ctx_id, "uri": f"ctxs://context/{ctx_id}"}
            for ctx_id in contexts
        ]
    })

@mcp.resource("ctxs://context/{ctx_id}")
def get_context_data(ctx_id: str):
    """Resource providing access to individual context windows"""
    data = api.get_context_window(ctx_id)
    return (data, "application/json")  # Explicit MIME type

@mcp.tool()
def refresh_contexts():
    """Force refresh of available contexts"""
    # In a real implementation, this might trigger API refresh
    return "Context list refreshed"

# ---------------------------------------------------
# Server Execution
# ---------------------------------------------------
if __name__ == "__main__":
    mcp.run()