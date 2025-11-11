"use client"

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client"
import { useMutation} from "@tanstack/react-query";

const Page = () => {
  
   const trpc = useTRPC();
   const ai  = useMutation(trpc.testAI.mutationOptions());
   console.log(ai);
   
 return (
   <div className="min-h-screen min-w-screen flex items-center justify-center">
      <Button onClick={()=> ai.mutate()}>Test AI</Button>
  </div>
  )
}
  
export default Page
