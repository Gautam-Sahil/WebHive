import Image  from "next/image";
import { useState, useEffect } from "react";

const ShimmerMessages = () =>{
    const message = [
        "Thinking...",
        "Loading...",
        "Generating...",
        "Analyzing your request...",
        "Building your Websites..",
        "Crafting Componnets...",
        "Optimizing layout...",
        "addding final touches...",
        "Almost ready..."
    ];

    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() =>{
        const interval = setInterval(() =>{
            setCurrentMessageIndex((prev) =>(prev + 1) % message.length);
        }, 2000);
        return () => clearInterval(interval);
    }, [message.length]);

    return (
        <div className="flex items-center gap-2">
            <span className="text-base text-muted-foreground animate-pulse">
              {message[currentMessageIndex]}
            </span>
        </div>
    );

};

export const MessageLoading = () => {
    return (
        <div className="flex flex-col group px-2 pb-2">
            <div className="flex items-center gap-2 pl-2 mb-2">
                <Image
                src="/beyond.png"
                alt="webhive"
                width={18}
                height={18}
                className="shrink-0"
                />
                <span className="text-sm font-medium">
                    WebHive
                </span>
            </div>
            <div className="pl-8.5 flex flex-col gap-y-4">
                <ShimmerMessages/>
            </div>

        </div>
    )
}