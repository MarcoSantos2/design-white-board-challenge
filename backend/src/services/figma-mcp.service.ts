import http from 'http';

interface McpRequest {
  jsonrpc: '2.0';
  id: number;
  method: string;
  params?: any;
}

interface McpResponse {
  jsonrpc: '2.0';
  id: number;
  result?: any;
  error?: {
    code: number;
    message: string;
  };
}

export class FigmaMcpService {
  private figmaUrl: string;
  private requestId: number = 1;

  constructor() {
    // Default to localhost, but allow override via environment
    this.figmaUrl = process.env.FIGMA_MCP_URL || 'http://127.0.0.1:3845/mcp';
  }

  /**
   * Make a JSON-RPC request to the Figma MCP server
   */
  private async makeRequest(method: string, params: any = {}): Promise<McpResponse> {
    return new Promise((resolve, reject) => {
      const requestData: McpRequest = {
        jsonrpc: '2.0',
        id: this.requestId++,
        method,
        params
      };

      const postData = JSON.stringify(requestData);
      const url = new URL(this.figmaUrl);

      const options = {
        hostname: url.hostname,
        port: url.port || 80,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        },
        timeout: 10000
      };

      const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response: McpResponse = JSON.parse(data);
            resolve(response);
          } catch (error) {
            reject(new Error(`Failed to parse response: ${error}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timed out'));
      });

      req.write(postData);
      req.end();
    });
  }

  /**
   * Initialize connection with Figma MCP server
   */
  async initialize(): Promise<any> {
    const response = await this.makeRequest('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {
        roots: {
          listChanged: true
        },
        sampling: {}
      },
      clientInfo: {
        name: 'design-whiteboard-backend',
        version: '1.0.0'
      }
    });

    if (response.error) {
      throw new Error(`Initialize failed: ${response.error.message}`);
    }

    return response.result;
  }

  /**
   * List all available tools
   */
  async listTools(): Promise<any[]> {
    const response = await this.makeRequest('tools/list');

    if (response.error) {
      throw new Error(`List tools failed: ${response.error.message}`);
    }

    return response.result?.tools || [];
  }

  /**
   * Call a specific tool
   */
  async callTool(name: string, args: any): Promise<any> {
    const response = await this.makeRequest('tools/call', {
      name,
      arguments: args
    });

    if (response.error) {
      throw new Error(`Tool call failed: ${response.error.message}`);
    }

    return response.result;
  }

  /**
   * Get current selection from Figma (if supported)
   */
  async getCurrentSelection(): Promise<any> {
    try {
      // This depends on what tools are actually available
      // Let's try common selection-related methods
      const tools = await this.listTools();
      
      // Look for selection-related tools
      const selectionTool = tools.find(tool => 
        tool.name.includes('selection') || 
        tool.name.includes('current') ||
        tool.name.includes('active')
      );

      if (selectionTool) {
        return await this.callTool(selectionTool.name, {});
      } else {
        throw new Error('No selection tool found. Available tools: ' + 
          tools.map(t => t.name).join(', '));
      }
    } catch (error) {
      throw new Error(`Get current selection failed: ${error}`);
    }
  }

  /**
   * Get file information
   */
  async getFile(fileKey: string): Promise<any> {
    return await this.callTool('get_file', { file_key: fileKey });
  }

  /**
   * Get specific nodes from a file
   */
  async getFileNodes(fileKey: string, nodeIds: string[]): Promise<any> {
    return await this.callTool('get_file_nodes', { 
      file_key: fileKey, 
      node_ids: nodeIds 
    });
  }

  /**
   * Get components from a file
   */
  async getComponents(fileKey: string): Promise<any> {
    return await this.callTool('get_components', { file_key: fileKey });
  }

  /**
   * Health check - test if Figma MCP server is accessible
   */
  async healthCheck(): Promise<{ status: 'ok' | 'error', message: string, tools?: string[] }> {
    try {
      await this.initialize();
      const tools = await this.listTools();
      
      return {
        status: 'ok',
        message: `Connected successfully. ${tools.length} tools available.`,
        tools: tools.map(t => t.name)
      };
    } catch (error) {
      return {
        status: 'error',
        message: `Connection failed: ${error}`
      };
    }
  }
}
