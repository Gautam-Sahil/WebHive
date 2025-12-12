import { useEffect, useRef } from 'react';
import { useTRPC } from '@/trpc/client';

import { useSuspenseQuery } from '@tanstack/react-query';
import { MessageCard } from './message-card';
import { MessageForm } from './message-form';
import { Fragment } from '@/generated/prisma/client';
import { MessageLoading } from './message-loading';


interface props {
    projectId: string;
    activeFragment: Fragment | null;
    setActiveFragment: (fragment: Fragment | null) => void;
}

export const MessagesContainer = ({ projectId, activeFragment, setActiveFragment }: props) =>{
 const trpc = useTRPC();
    const bottomref = useRef<HTMLDivElement>(null);
    


    const {data: messages } = useSuspenseQuery(trpc.messages.getMany.queryOptions({
        projectId: projectId,
    },{
      //temporary live message update
      refetchInterval: 5000,
    })

    );

    // useEffect(() =>{
    //       const lastAssistntMessageWithFragment = messages.findLast(
    //         (message) => message.role === "ASSISTANT" && message.fragment,
    //       );

    //       if (lastAssistntMessageWithFragment ){
    //        setActiveFragment(lastAssistntMessageWithFragment.fragment);
    //       }
    // }, [messages, setActiveFragment]);

    useEffect(() =>{
       bottomref.current?.scrollIntoView();
    },[messages.length]);

   const lastMessage = messages[messages.length - 1];
   const isLastMessage = lastMessage?.role === "USER";

  return (
    <div className='flex flex-col flex-1 min-h-0'>
        <div className='flex-1 min-h-0 overflow-y-auto'>
            <div className='pt-2 pr-1'>
             {messages.map((message) => (
  <MessageCard
    key={message.id}
    content={message.content}
    role={message.role}
    fragment={message.fragment}
    createdAt={message.createdAt}
    isActiveFragment={activeFragment?.id === message.fragment?.id}
    onFragmentClick={() => setActiveFragment(message.fragment)}
    type={message.type}
  />
))}

                {isLastMessage && <MessageLoading/>}
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