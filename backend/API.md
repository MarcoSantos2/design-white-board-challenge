# APIs
1. [Whisper API](https://platform.openai.com/docs/api-reference/whisper) (Speech-to-Text)
Convert user voice → text → send to GPT-4o
2. [TTS API](https://platform.openai.com/docs/api-reference/text-to-speech) (Text-to-Speech)
GPT-4o response → convert to voice → play to user

FLOW:
User speaks → Whisper API → Text → GPT-4o → Text Response → TTS API → Voice output