import config from "../config";
import {ChatOpenAI} from '@langchain/openai'


const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// fallback model set up 

const fallbackChatModels = config.openRouter_fallback_chat_models


const openRouterChatModel = new ChatOpenAI({
  model:config.openRouter_chat_model,
  apiKey: config.openRouter_api_key,
  temperature:0.2,

  modelKwargs:{
    models:[config.openRouter_chat_model, ...fallbackChatModels]
  },

  configuration:{
    baseURL: OPENROUTER_BASE_URL,
    defaultHeaders: {
      "HTTP-Referer": config.app_url ?? "http://localhost:3000",
      "X-Title": "Unicore"
    }

  }

})