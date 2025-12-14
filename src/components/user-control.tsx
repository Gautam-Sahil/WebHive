"use client";
import { dark } from '@clerk/themes';
import { useCurrentTheme } from "@/hooks/use-curent-theme";
import { UserButton } from "@clerk/nextjs";


interface props {
    showName?: boolean;
}


export const UserControl = ({showName}: props) =>{

    const currentTheme = useCurrentTheme();
    return(
   <UserButton
   showName={showName}
   appearance={{
    elements:{
        userButtonBox: "rounded-md!",
        userButtonAvatarBox: "rounded-md! size-8!",
        userButtonTrigger:"rounded-md!"
    },
    baseTheme: currentTheme === "dark" ? dark : undefined,
   }}
   />
    );
};