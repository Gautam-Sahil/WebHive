
import { Fragment, useCallback, useMemo, useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import { Hint } from './hint';
import { Button } from './ui/button';
import { CodeView } from './code-view';
import { convertFilesToTreeItems } from '@/lib/utils';
import { TreeView } from './tree-view';
import { Breadcrumb, BreadcrumbEllipsis, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from './ui/breadcrumb';
import { CopyCheckIcon, CopyIcon } from 'lucide-react';



type FileCollection = { [path: string]: string };

function getLanguageFromExtension(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "ts":
      return "typescript";
    case "tsx":
      return "tsx";
    case "js":
      return "javascript";
    case "jsx":
      return "jsx";
    case "json":
      return "json";
    case "css":
      return "css";
    case "html":
      return "markup";
    case "py":
      return "python";
    case "sh":
      return "bash";
    default:
      return "text";
  }
}


interface FileBreadCrumbProps{
    filepath: string;
}

const FileBreadCrumb = ({filepath}: FileBreadCrumbProps) =>{
    const pathSegments = filepath.split("/");
    const maxSegments = 4;
    const renderBreadCrumbItems = () =>{
        if(pathSegments.length <= maxSegments) {
            return pathSegments.map((segment, index) =>{
                const isLast = index === pathSegments.length - 1;
                return(
                    <Fragment key={index}>
                        <BreadcrumbItem>
                        {isLast ? (
                            <BreadcrumbPage className='font-medium'>
                                {segment}
                            </BreadcrumbPage>
                        ):(
                            <span className='text-muted-foreground'>
                                {segment}
                            </span>
                        )}
                        </BreadcrumbItem>

                    </Fragment>
                )
            })
        } else {
            const firstSegment = pathSegments[0];
            const lastSegment = pathSegments[pathSegments.length - 1];

            return(
                <>
                <BreadcrumbItem>
                <span className='text-muted-foreground'>
                    {firstSegment}
                </span>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                <BreadcrumbEllipsis />
                </BreadcrumbItem>
                <BreadcrumbSeparator /><BreadcrumbItem>
                <BreadcrumbPage className='font-medium'>
                {lastSegment}
                </BreadcrumbPage>
                </BreadcrumbItem>
                </BreadcrumbItem>
                </>
            )
        }
    };
    return(
        <Breadcrumb>
        <BreadcrumbList>
        {renderBreadCrumbItems()}
        </BreadcrumbList>
        </Breadcrumb>
    )

};

interface FileExplorerProps  {
    files: FileCollection;
};


export const FileExplorer = ({
    files,

}: FileExplorerProps) => {
    const [copied, setCopied] = useState(false);

    const [selectedFile, setSilectedFile] = useState<string | null>(() => {
        const fileKeys = Object.keys(files);
        return fileKeys.length > 0 ? fileKeys[0] : null;
    } );

    const treeData = useMemo(() => {
        return convertFilesToTreeItems(files);

    }, [files]);

    const handleFileSelect = useCallback((
        filePath: string
    )=>{
       if(files[filePath]){
        setSilectedFile(filePath);
       }
    }, [files]);
    
    const handleCopy = useCallback(() => {
        if(selectedFile){
            navigator.clipboard.writeText(files[selectedFile]);
            setCopied(true);
            setTimeout(() =>{
                setCopied(false);
            }, 2000);
        }
    }, [selectedFile, files])

    return(

        <ResizablePanelGroup direction='horizontal'>
            <ResizablePanel defaultValue={30} minSize={30} className='bg-sidebar'>
                <div className="p-3 text-xs font-bold text-foreground uppercase ">
                    Explorer
                </div>
              <TreeView
              data={treeData}
              value={selectedFile}
              onSelect={handleFileSelect}
              />


            </ResizablePanel>
              <ResizableHandle className='hover:bg-primary transition-colors' />
              <ResizablePanel defaultValue={70} minSize={50}>
                 {selectedFile && files[selectedFile] ? (
                <div className='h-full w-full flex flex-col'>
                    <div className='border-b bg-sidebar px-4 py-2 flex justify-between items-center gap-x-2'>
                    <FileBreadCrumb filepath={selectedFile} />
                    
                         <Hint
                        text='Copy to clipboard' side="bottom"
                        >

                            <Button variant="outline" size="icon" className='ml-auto' onClick={handleCopy}
                            disabled={copied}
                            >
                                {copied ? <CopyCheckIcon/> : <CopyIcon/>}

                            </Button>
                        </Hint>

                    </div>
                   <div className='flex-1 overflow-auto'>
                    <CodeView code={files[selectedFile]}
                lang={getLanguageFromExtension(selectedFile)}
 />
                   </div>
                </div>

                 ):(
                    <div>
                        select a file to view it &apos; s content
                    </div>
                 )}
              </ResizablePanel>
        </ResizablePanelGroup>
    )
    
}

