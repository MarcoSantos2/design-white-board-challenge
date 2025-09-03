import { Router } from 'express';
import { FigmaMcpService } from '../services/figma-mcp.service';

const router = Router();
const figmaService = new FigmaMcpService();

/**
 * Health check for Figma MCP connection
 */
router.get('/health', async (req, res) => {
  try {
    const health = await figmaService.healthCheck();
    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Health check failed: ${error}`
    });
  }
});

/**
 * List all available Figma MCP tools
 */
router.get('/tools', async (req, res) => {
  try {
    await figmaService.initialize();
    const tools = await figmaService.listTools();
    res.json({
      status: 'success',
      data: tools
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Failed to list tools: ${error}`
    });
  }
});

/**
 * Get current selection from Figma
 */
router.get('/selection', async (req, res) => {
  try {
    await figmaService.initialize();
    const selection = await figmaService.getCurrentSelection();
    res.json({
      status: 'success',
      data: selection
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Failed to get selection: ${error}`
    });
  }
});

/**
 * Get file information
 */
router.get('/file/:fileKey', async (req, res) => {
  try {
    const { fileKey } = req.params;
    await figmaService.initialize();
    const file = await figmaService.getFile(fileKey);
    res.json({
      status: 'success',
      data: file
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Failed to get file: ${error}`
    });
  }
});

/**
 * Get specific nodes from a file
 */
router.post('/file/:fileKey/nodes', async (req, res) => {
  try {
    const { fileKey } = req.params;
    const { nodeIds } = req.body;
    
    if (!Array.isArray(nodeIds)) {
      return res.status(400).json({
        status: 'error',
        message: 'nodeIds must be an array'
      });
    }

    await figmaService.initialize();
    const nodes = await figmaService.getFileNodes(fileKey, nodeIds);
    res.json({
      status: 'success',
      data: nodes
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Failed to get nodes: ${error}`
    });
  }
});

/**
 * Get components from a file
 */
router.get('/file/:fileKey/components', async (req, res) => {
  try {
    const { fileKey } = req.params;
    await figmaService.initialize();
    const components = await figmaService.getComponents(fileKey);
    res.json({
      status: 'success',
      data: components
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Failed to get components: ${error}`
    });
  }
});

/**
 * Call any Figma MCP tool directly
 */
router.post('/tool/:toolName', async (req, res) => {
  try {
    const { toolName } = req.params;
    const { args } = req.body;
    
    await figmaService.initialize();
    const result = await figmaService.callTool(toolName, args || {});
    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: `Failed to call tool: ${error}`
    });
  }
});

export default router;
