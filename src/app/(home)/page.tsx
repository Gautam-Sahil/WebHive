import { ProjectForm } from "@/modules/home/ui/components/Project-form";
import { ProjectList } from "@/modules/home/ui/components/ProjectList";
import Image from "next/image";
import { FadeIn } from "./motion";

const Home = () => {
  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      {/* HERO */}
      <section className="py-[16vh] 2xl:py-48 flex flex-col items-center text-center">
        
        
   <FadeIn delay={0}>
  <div className="shine-border p-[2.5px] inline-flex rounded-full">
    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-background">
      <Image
        src="/beyond.png"
        alt="WebHive"
        width={26}
        height={26}
        className="rounded-full"
      />
      <span className="text-sm md:text-base font-medium">
        WebHive AI
      </span>
    </div>
  </div>
</FadeIn>


        {/* Heading */}
        <FadeIn delay={0.1} className="mt-6 max-w-4xl">
          <h1 className="text-2xl md:text-5xl font-bold leading-tight">
           Build Anything on the Web with WebHive
          </h1>
        </FadeIn>

        {/* Subtitle */}
        <FadeIn delay={0.2} className="mt-4 max-w-2xl">
          <p className="text-lg md:text-xl text-muted-foreground">
           Create High-Quality Apps and Websites with Conversational AI
          </p>
        </FadeIn>

        {/* Form */}
        <FadeIn delay={0.3} className="mt-8 max-w-3xl w-full">
          <ProjectForm />
        </FadeIn>
      </section>

      {/* Projects */}
      <FadeIn delay={0.4}>
        <ProjectList />
      </FadeIn>
    </div>
  );
};

export default Home;
