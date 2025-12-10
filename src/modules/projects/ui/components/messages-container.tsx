import { useEffect, useRef } from 'react';
import { useTRPC } from '@/trpc/client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { MessageCard } from './message-card';
import { MessageForm } from './message-form';


interface props {
    projectId: string;
}

export const MessagesContainer = ({ projectId }: props) =>{

    const bottomref = useRef<HTMLDivElement>(null);
     const trpc = useTRPC();


    const {data: messages } = useSuspenseQuery(trpc.messages.getMany.queryOptions({
        projectId: projectId,
    })

    );

    useEffect(() =>{
          const lastAssistntMessage = messages.findLast(
            (message) => message.role === "ASSISTANT",
          );

          if (lastAssistntMessage){
            // set active fragment
          }
    }, [messages]);

    useEffect(() =>{
       bottomref.current?.scrollIntoView();
    },[messages.length]);
  return (
    <div className='flex flex-col flex-1 min-h-0'>
        <div className='flex-1 min-h-0 overflow-y-auto'>
            <div className='pt-2 pr-1'>
                {messages.map((message) =>(
                    <MessageCard
                    key={message.content}
                    content={message.content}
                    role={message.role}
                    fragment={message.fragment}
                    createdAt={message.createdAt}
                    isActiveFragment={false}
                    onFragmentClick={() => {}}
                    type={message.type}
                    />
                ))}
             <div ref={bottomref}/>
            </div>


        </div>
         <div className='relative p-3 pt-1'>
            <div className="absolute -top-6 left-0 right-0 h-6 bg-linear-to-b from-transparent to-background pointer-events-none"/>

           
            <MessageForm
            projectId={projectId}
            />
         </div>
    </div>
  )

};