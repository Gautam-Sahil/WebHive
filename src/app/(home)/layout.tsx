import { Navbar } from "@/modules/home/ui/components/navbar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <main className="relative flex flex-col min-h-screen overflow-hidden">
      <Navbar />

      {/* Background Layers */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Background */}
        <div
          className="
            absolute inset-0
            bg-[url('https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/hero/bg-gradient.png')]
            bg-cover bg-center bg-no-repeat
          "
        />

        {/* Enhanced Dots Layer */}
        <div
          className="
            absolute inset-0
            bg-[radial-gradient(circle_at_2px_2px,rgba(120,120,120,0.25)_1px,transparent_0)]
            bg-[size:20px_20px]
            dark:bg-[radial-gradient(circle_at_1px_1px,rgba(180,180,180,0.18)_1px,transparent_0)]
            opacity-100
          "
        />

        {/* Soft Glow Overlay (depth) */}
        <div
          className="
            absolute inset-0
            bg-gradient-to-b
            from-white/40 via-transparent to-transparent
            dark:from-black/30
          "
        />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col px-4 pb-4">
        {children}
      </div>
    </main>
  );
};

export default Layout;
