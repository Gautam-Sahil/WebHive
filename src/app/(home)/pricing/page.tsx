"use client";

import { useCurrentTheme } from "@/hooks/use-curent-theme";
import { PricingTable } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import Image from "next/image";

const Page = () => {
    const currentTheme = useCurrentTheme();
    return(
        <div className="flex flex-col max-w-3xl mx-auto w-full">
            <section className="space-y-6 pt-[16vh] 2xl:pt-30">
                <div className="flex flex-col items-center">
                    <Image
                    src="/beyond.png"
                    alt="WebHive"
                    width={50}
                    height={50}
                    className="hidden md:block rounded-full"
                    />
                </div>
                <h1 className="text-xl md:text-3xl font-bold text-center">Pricing</h1>
                <p className="text-muted-foreground text-center text-sm md:text-base"> Select the Plan according to your usage </p>
                 <PricingTable
                 appearance={{
                    baseTheme: currentTheme ==="dark" ? dark : undefined,
                    elements: {
                        pricingTableCard: "border! shadow-none! rounded-lg!"
                    }
                 }}/>
            </section>
           
        </div>
    );

}

export default Page;