import prism from "prismjs";

import "./code-theme.css"
import { useEffect } from "react";

interface props{
    code: string;
    lang: string;
}
export const CodeView = ({
    code,
    lang
}: props) =>{

  useEffect(() => {
    prism.highlightAll();
  }, [code]);

    return(
        <pre
        className="p-2 bg-transparent border-none rounded-none m-0 text-xs"
        >
           <code className={`language-${lang}`}>
            {code}
           </code>

        </pre>
    )
}