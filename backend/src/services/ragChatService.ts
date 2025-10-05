import { ChatService } from './chatService';
import { VectorService } from './vectorService';
import { DocumentProcessingService } from './documentProcessingService';
import { ChatRequest, ChatResponse } from '../types/chat';

export class RAGChatService {
  private chatService: ChatService;
  private vectorService: VectorService;
  private documentService: DocumentProcessingService;

  constructor() {
    this.chatService = new ChatService();
    this.vectorService = new VectorService();
    this.documentService = new DocumentProcessingService();
  }

  /**
   * Send a message with RAG context
   */
  async sendMessageWithRAG(request: ChatRequest): Promise<ChatResponse> {
    try {
      // 1. Generate embedding for the user's query
      const queryEmbedding = await this.vectorService.generateQueryEmbedding(request.message);
      
      // 2. Search for relevant document chunks
      const searchResults = await this.vectorService.searchSimilar(queryEmbedding, 5);
      
      // 3. Build context from relevant chunks
      const context = this.buildContextFromChunks(searchResults);
      
      // 4. Enhance the system prompt with context
      const enhancedSystemPrompt = this.buildEnhancedSystemPrompt(context);
      
      // 5. Create enhanced request with context
      const enhancedRequest: ChatRequest = {
        ...request,
        message: `${request.message}\n\nContext from UX Design Resources:\n${context}`
      };
      
      // 6. Call the chat service
      const response = await this.chatService.sendMessage(enhancedRequest);
      
      // 7. Log RAG usage for monitoring
      this.logRAGUsage(request.message, searchResults.length, response);
      
      return response;
    } catch (error) {
      console.error('Error in RAG chat service:', error);
      // Fallback to regular chat if RAG fails
      return await this.chatService.sendMessage(request);
    }
  }

  /**
   * Build context string from search results
   */
  private buildContextFromChunks(searchResults: any[]): string {
    if (searchResults.length === 0) {
      return 'No relevant context found in the knowledge base.';
    }

    return searchResults
      .map((result, index) => {
        const chunk = result.chunk;
        const similarity = result.similarity;
        return `[Context ${index + 1}] (Relevance: ${(similarity * 100).toFixed(1)}%)\n${chunk.content}\n`;
      })
      .join('\n---\n\n');
  }

  /**
   * Build enhanced system prompt with RAG context
   */
  private buildEnhancedSystemPrompt(context: string): string {
    const basePrompt = `You are a senior UX interviewer at a tech company conducting 60-minute whiteboard design challenges. Your role is to evaluate candidates through realistic design problems commonly used in UX/UI job interviews.

Interview Approach:
- Begin with vague design prompts to evaluate how candidates handle ambiguity
- Let the candidate lead the conversation — do not suggest what they should do next, offer guidance, or prompt them to ask questions
- If the candidate explicitly asks for context (e.g., "who are you as a company?" or "what problem are we solving?"), provide brief, 1–2 sentence responses
- Do not give feedback or suggestions unless the candidate is clearly stuck and not progressing after multiple turns — in that case, offer a minimal nudge to help them move forward

Communication Style:
- Keep responses terse (1–2 sentences) and maintain a neutral, professional tone
- Do not over-explain or be overly supportive
- Focus on observing the candidate's problem-solving process rather than guiding them through it
- Simulate a realistic interview environment where the candidate must demonstrate initiative and structured thinking

Your goal is to assess how candidates approach design challenges, handle ambiguity, ask clarifying questions, and structure their problem-solving process independently.`;

    return `${basePrompt}

Additional Context from UX Design Resources:
${context}

Use this context to provide more informed responses about UX design principles, whiteboard challenge frameworks, and best practices when relevant to the conversation.`;
  }

  /**
   * Log RAG usage for monitoring
   */
  private logRAGUsage(query: string, chunksFound: number, response: ChatResponse): void {
    console.log('🔍 RAG Usage:', {
      query: query.substring(0, 100) + (query.length > 100 ? '...' : ''),
      chunksFound,
      responseLength: response.message.length,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Search documents for specific topics
   */
  async searchDocuments(query: string, limit: number = 5): Promise<any[]> {
    try {
      const queryEmbedding = await this.vectorService.generateQueryEmbedding(query);
      const searchResults = await this.vectorService.searchSimilar(queryEmbedding, limit);
      
      return searchResults.map(result => ({
        content: result.chunk.content,
        source: result.chunk.source,
        similarity: result.similarity,
        page: result.chunk.page,
        section: result.chunk.section
      }));
    } catch (error) {
      console.error('Error searching documents:', error);
      return [];
    }
  }

  /**
   * Get document statistics
   */
  async getDocumentStats(): Promise<any> {
    try {
      const documents = await this.documentService.getDocuments();
      const completedDocs = documents.filter(doc => doc.status === 'completed');
      const failedDocs = documents.filter(doc => doc.status === 'failed');
      
      return {
        totalDocuments: documents.length,
        completedDocuments: completedDocs.length,
        failedDocuments: failedDocs.length,
        totalChunks: completedDocs.reduce((sum, doc) => sum + doc.totalChunks, 0),
        totalTokens: completedDocs.reduce((sum, doc) => sum + doc.totalTokens, 0)
      };
    } catch (error) {
      console.error('Error getting document stats:', error);
      return null;
    }
  }
}
