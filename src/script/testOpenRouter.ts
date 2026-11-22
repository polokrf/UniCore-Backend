import { chatModal, embeddings } from "../lib/llm"


const main = async()=>{
  const vector = await embeddings.embedQuery('this univercity what kind of course sell')
  console.log(`embedding Dimension : ${vector.length}` )
  console.log(`first 5 number : ${vector.slice(0,5)}` )
  
 const reply = await chatModal.invoke(
  'say hello to  unicore'
 )

 console.log(`chat reply : ${reply.content}`)
} 
main().catch(error =>{
  console.log(error)
  process.exit(1)
})