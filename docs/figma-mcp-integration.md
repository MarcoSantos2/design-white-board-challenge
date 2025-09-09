# Figma MCP Integration Guide

## Overview

This document describes how to connect to and use the Figma MCP (Model Context Protocol) server for design-to-code workflows in the Design White Board Challenge project.

## Figma MCP Server Setup

### 1. Enable Figma MCP Server

To enable the Figma MCP server:

1. **Open Figma Desktop App** (ensure it's updated to the latest version)
2. **Open a Figma design file**
3. **Click Figma menu** in the upper-left corner
4. **Go to Preferences** → **Enable local MCP Server**
5. **Confirm** that the server is running at `http://127.0.0.1:3845/mcp`

### 2. WSL2 Networking Considerations

If you're running WSL2 (Windows Subsystem for Linux), the Figma MCP server running on Windows may not be directly accessible from the WSL2 environment due to network isolation.

**Solution Options:**

#### Option A: Use Windows Host IP (Recommended)
```bash
# Find your Windows host IP
ip route show | grep default

# Set environment variable (replace with your actual Windows host IP)
export FIGMA_MCP_URL=http://172.27.144.1:3845/mcp

# Test the connection
node scripts/test-figma-mcp.js
```

#### Option B: Use Windows Terminal/PowerShell
Run MCP client tools directly from Windows Command Prompt or PowerShell instead of WSL2.

#### Option C: Port Forwarding
Set up port forwarding from WSL2 to Windows host (advanced).

## Available Figma MCP Tools

Based on Figma's MCP server documentation, the following tools are typically available:

### File Operations
- **`get_file`** - Retrieve information about a Figma file
  - Parameters: `file_key` (required)
  - Returns: File metadata, document structure, and properties

- **`get_file_nodes`** - Access specific nodes within a file
  - Parameters: `file_key` (required), `node_ids` (required)
  - Returns: Detailed information about specified nodes

- **`get_file_versions`** - View the version history of a file
  - Parameters: `file_key` (required)
  - Returns: List of file versions with timestamps

### Comment Management
- **`get_comments`** - Fetch comments from a file
  - Parameters: `file_key` (required)
  - Returns: All comments and their metadata

- **`post_comment`** - Add a comment to a file
  - Parameters: `file_key` (required), `message` (required), `client_meta` (optional)
  - Returns: Created comment details

- **`delete_comment`** - Remove a comment from a file
  - Parameters: `file_key` (required), `comment_id` (required)
  - Returns: Success status

### Component and Style Operations
- **`get_components`** - Retrieve components from a file
  - Parameters: `file_key` (required)
  - Returns: Component definitions and metadata

- **`get_styles`** - Access styles from a file
  - Parameters: `file_key` (required)
  - Returns: Text styles, fill styles, and effect styles

### Project and Team Operations
- **`get_team_projects`** - List projects within a team
  - Parameters: `team_id` (required)
  - Returns: Project list with metadata

- **`get_project_files`** - List files within a project
  - Parameters: `project_id` (required)
  - Returns: File list with metadata

## Testing the Connection

Use the provided test script to verify your connection:

```bash
# Basic test (uses 127.0.0.1:3845 by default)
node scripts/test-figma-mcp.js

# Test with custom URL (for WSL2)
FIGMA_MCP_URL=http://172.27.144.1:3845/mcp node scripts/test-figma-mcp.js
```

## Integration with Project

### Backend Integration

To integrate Figma MCP tools into the backend API:

1. **Install MCP Client Library** (when available) or implement JSON-RPC 2.0 client
2. **Create Figma Service** in `backend/src/services/figma.service.ts`
3. **Add API Endpoints** for design data retrieval
4. **Configure Environment Variables** for Figma access tokens

### Frontend Integration

The frontend can consume Figma design data through the backend API:

1. **Design Token Integration** - Import design tokens from Figma
2. **Component Generation** - Generate React components from Figma components
3. **Asset Management** - Sync design assets and icons

## Protocol Details

The Figma MCP server uses JSON-RPC 2.0 protocol over HTTP:

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list",
  "params": {}
}
```

### Response Format
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "get_file",
        "description": "Retrieve information about a Figma file",
        "inputSchema": {
          "type": "object",
          "properties": {
            "file_key": {
              "type": "string",
              "description": "The key of the file to retrieve"
            }
          },
          "required": ["file_key"]
        }
      }
    ]
  }
}
```

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure Figma desktop app is running
   - Verify MCP server is enabled in Figma preferences
   - Check if you need to use Windows host IP (WSL2)

2. **Invalid Session ID**
   - This is normal when accessing via browser
   - Use proper JSON-RPC 2.0 protocol instead

3. **Timeout Errors**
   - Check network connectivity
   - Verify Figma app is responsive
   - Try different host IP addresses

## Next Steps

1. **Test Connection** - Verify you can connect to the Figma MCP server
2. **List Tools** - Get the actual list of available tools from your Figma instance
3. **Implement Integration** - Add Figma MCP client to the backend service
4. **Create API Endpoints** - Expose Figma data through REST API
5. **Frontend Consumption** - Use Figma data in React components

## References

- [Figma MCP Server Documentation](https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Dev-Mode-MCP-Server)
- [Model Context Protocol Specification](https://modelcontextprotocol.io/)
- [JSON-RPC 2.0 Specification](https://www.jsonrpc.org/specification)


