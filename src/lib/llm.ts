import { RunnableLambda } from "@langchain/core/runnables";
import config from "../config";
import {ChatOpenAI} from '@langchain/openai'
import { BaseLanguageModelInput } from "@langchain/core/language_models/base";
import { Embeddings, EmbeddingsParams } from "@langchain/core/embeddings";
import { th } from "zod/v4/locales";


const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

// fallback model set up 

const fallbackChatModels = config.openRouter_fallback_chat_models


const openRouterChatModel = new ChatOpenAI({
  model:config.openRouter_chat_model,
  apiKey: config.openRouter_api_key,
  temperature:0.2,

  modelKwargs:{
    models:[config.openRouter_chat_model , fallbackChatModels]
  },

  configuration:{
    baseURL: OPENROUTER_BASE_URL,
    defaultHeaders: {
      "HTTP-Referer": config.app_url ?? "http://localhost:3000",
      "X-Title": "Unicore"
    }

  }

})


export  const chatModal = RunnableLambda.from(
  async(input:BaseLanguageModelInput,option)=>{
    try {
      return await openRouterChatModel.invoke(input,option)
    } catch (error) {
      throw error instanceof TypeError ? new Error(`openRouter returned no contents : ${error.message}`): error;
    }
  }
).withRetry({stopAfterAttempt: 3})

type TOpenRouterEmbeddingResponse = {
  data: { embedding: number[]; index: number }[];
};
class OpenRouterEmbeddings extends Embeddings{
  private readonly model:string;
  private readonly apiKey: string;

  constructor(model:string,apiKey:string, params:EmbeddingsParams ={}){
    super(params)
    this.model=model
    this.apiKey=apiKey
  }

  private async embed(input: string[]){
    const response = await fetch(`${OPENROUTER_BASE_URL}/embeddings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type":"application/json",
      },
      body: JSON.stringify(
        {
          model:this.model,
          input,
          encoding_format:"float",
        }
      )
    })

    if(!response.ok){
      throw new Error('something was wrang')
    }

    const result = (await response.json())as TOpenRouterEmbeddingResponse
    return result.data.sort((a,b)=> a.index - b.index).map(item => item.embedding)
  }

   async embedDocuments(documents: string[]): Promise<number[][]> {
    return this.caller.call(()=> this.embed(documents))
  }

  async embedQuery(document: string): Promise<number[]> {
    const [vector]= await this.caller.call(()=>this.embed([document]))
    return vector
  }


}

 export const embeddings = new OpenRouterEmbeddings(
  config.openRouter_embedding_chat_model,config.openRouter_api_key,{maxRetries: 3}
)

