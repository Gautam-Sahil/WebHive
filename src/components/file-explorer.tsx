
import { useCallback, useMemo, useState } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './ui/resizable';
import { Hint } from './hint';
import { Button } from './ui/button';
import { CodeView } from './code-view';
import { convertFilesToTreeItems } from '@/lib/utils';
import { TreeView } from './tree-view';



type FileCollection = { [path: string]: string };

function getLanguageFRomExtansion (filename: string): string {
    const extension = filename.split(".").pop()?.toLowerCase();
    return extension || "text";
};

interface FileExplorerProps  {
    files: FileCollection;
};


export const FileExplorer = ({
    files,

}: FileExplorerProps) => {

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
    }, [files])
    return(

        <ResizablePanelGroup direction='horizontal'>
            <ResizablePanel defaultValue={30} minSize={30} className='bg-sidebar'>
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
                        {/* todo file breadcrumb */}
                        <Hint
                        text='Copy to clipboard' side="bottom"
                        >

                            <Button variant="outline" size="icon" className='ml-auto' onClick={() => {}}
                            disabled={false}
                            >

                            </Button>
                        </Hint>

                    </div>
                   <div className='flex-1 overflow-auto'>
                    <CodeView code={files[selectedFile]}
                    lang={getLanguageFRomExtansion(selectedFile)} />
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

