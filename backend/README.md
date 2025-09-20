# UX Whiteboard Challenge Backend

## ChatGPT Integration Setup

This backend integrates with OpenAI's ChatGPT API to provide a UX Whiteboard Challenge Facilitator chatbot that helps candidates practice design interviews.

### Prerequisites

1. **OpenAI API Key**: You need an OpenAI API key with access to GPT-4o or GPT-4
2. **Node.js**: Version 16 or higher
3. **npm**: For package management

### Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   - Copy the `.env.example` file to `.env`
   - Add your OpenAI API key to the `.env` file:
   ```
   OPENAI_API_KEY=sk-your-actual-openai-api-key-here
   ```

3. **Get OpenAI API Key:**
   - Go to [OpenAI Platform](https://platform.openai.com/)
   - Sign in or create an account
   - Navigate to API Keys section
   - Create a new secret key
   - Copy the key and paste it in your `.env` file

4. **Start the server:**
   ```bash
   npm run dev
   ```

### API Endpoints

The chatbot API provides the following endpoints:

#### Send Message
- **POST** `/api/chat/message`
- **Body:**
  ```json
  {
    "message": "Hello, I'm preparing for a UX interview",
    "sessionId": "optional-conversation-id"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "message": "Great! I'm here to help you practice...",
      "conversationId": "uuid-here",
      "timestamp": "2024-01-15T10:30:00.000Z"
    }
  }
  ```

#### Get Conversation History
- **GET** `/api/chat/conversations/:conversationId`
- **Response:**
  ```json
  {
    "success": true,
    "data": {
      "id": "conversation-uuid",
      "messages": [...],
      "createdAt": "2024-01-15T10:30:00.000Z",
      "lastUpdated": "2024-01-15T10:30:00.000Z"
    }
  }
  ```

#### Get All Conversations
- **GET** `/api/chat/conversations`

#### Delete Conversation
- **DELETE** `/api/chat/conversations/:conversationId`

### Custom GPT Configuration

The chatbot is configured as a UX Whiteboard Challenge Facilitator with the following capabilities:

- **Role**: Expert UX interviewer and design thinking facilitator
- **Responsibilities**:
  - Present realistic design challenges
  - Ask clarifying questions about user needs
  - Provide constructive feedback
  - Guide through design process (research, ideation, wireframing, validation)
  - Encourage UX best practices
  - Help think through edge cases and accessibility

### Testing the Integration

You can test the API using curl, Postman, or any HTTP client:

```bash
curl -X POST http://localhost:3001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Hi, I need help practicing for a UX interview"
  }'
```

### Connecting Your Custom GPT

Since you have a custom GPT at the link you provided, you have two options:

1. **Use this backend as a standalone chatbot** - The system prompt is already configured to act as a UX facilitator
2. **Integrate with your custom GPT** - You can modify the system prompt to match your custom GPT's behavior

### Production Considerations

For production deployment:

1. **Database Storage**: Replace in-memory conversation storage with a proper database
2. **Authentication**: Add user authentication and authorization
3. **Rate Limiting**: Implement rate limiting for API calls
4. **Error Handling**: Enhanced error handling and logging
5. **Monitoring**: Add monitoring and alerting
6. **Security**: Environment variable validation and security headers

### Troubleshooting

- **"OPENAI_API_KEY is required"**: Make sure you've set the API key in your `.env` file
- **API Rate Limits**: OpenAI has usage limits; check your account status
- **Network Issues**: Ensure you have internet connectivity for OpenAI API calls 