import Prism from "@/lib/prism";
import { useEffect, useRef, useState } from "react";
import "./code-theme.css";

interface Props {
  code: string;
  lang: string;
}

export const CodeView = ({ code, lang }: Props) => {
  const codeRef = useRef<HTMLElement>(null);
  const [displayedCode, setDisplayedCode] = useState("");
  const [done, setDone] = useState(false);

  // 🔥 AI typing (NO Prism here)
  useEffect(() => {
    let i = 0;
    setDisplayedCode("");
    setDone(false);

    const interval = setInterval(() => {
      setDisplayedCode(code.slice(0, i));
      i++;

      if (i > code.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 4);

    return () => clearInterval(interval);
  }, [code]);

  // ✅ Highlight ONLY once after typing finishes
  useEffect(() => {
    if (done && codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [done, lang]);

  return (
  <pre className="p-4 text-sm bg-transparent overflow-x-auto leading-relaxed">
      <div className="relative">
        <code
          ref={codeRef}
          className={`language-${lang}`}
        >
          {displayedCode}
        </code>

        {!done && (
          <span className="ai-cursor">▍</span>
        )}
      </div>
    </pre>
  );
};
