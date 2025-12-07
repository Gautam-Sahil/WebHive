
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Client } from "./client";
import { Suspense } from "react";


const Home = async  () => {
   
   const queryClient = getQueryClient();

   void queryClient.prefetchQuery(trpc.CreateAI.queryOptions({ text: "GAutam PREFETCH" }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>  
    <Suspense fallback={<div>Loading...</div>}>
        <Client/>
    </Suspense> 

</HydrationBoundary>
    );
}

export default Home;