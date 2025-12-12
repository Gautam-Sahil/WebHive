import { TreeItem } from "@/types";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarProvider,
  SidebarRail,
} from "./ui/sidebar";
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

interface TreeViewProps {
  data: TreeItem[];
  value?: string | null;
  onSelect?: (value: string) => void;
}

export const TreeView = ({ data, value, onSelect }: TreeViewProps) => {
  return (
    <SidebarProvider>
      <Sidebar collapsible="none" className="w-full">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.map((item) => {
                  const name = Array.isArray(item) ? item[0] : item;
                  const path = name; // ROOT LEVEL PATH

                  return (
                    <Tree
                      key={path}
                      item={item}
                      selectedValue={value}
                      onSelect={onSelect}
                      parentPath=""
                    />
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
    </SidebarProvider>
  );
};

interface TreeProps {
  item: TreeItem;
  selectedValue?: string | null;
  onSelect?: (value: string) => void;
  parentPath: string;
}

const Tree = ({ item, selectedValue, onSelect, parentPath }: TreeProps) => {
  const [name, ...items] = Array.isArray(item) ? item : [item];
  const currentPath = parentPath ? `${parentPath}/${name}` : name;

  // ---- FILE ----
  if (!items.length) {
    const isSelected = selectedValue === currentPath;

    return (
      <SidebarMenuButton
        isActive={isSelected}
        className="data-[active=true]:bg-transparent"
        onClick={() => onSelect?.(currentPath)}
      >
        <FileIcon />
        <span className="truncate">{name}</span>
      </SidebarMenuButton>
    );
  }

  // ---- FOLDER ----
  return (
    <SidebarMenuItem>
      <Collapsible
        className="group/collapsible [&[data-state=open]>button>svg:first-child]:rotate-90"
        defaultOpen
      >
        <CollapsibleTrigger asChild>
          <SidebarMenuButton>
            <ChevronRightIcon className="transition-transform" />
            <FolderIcon />
            <span className="truncate">{name}</span>
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {items.map((subitem) => {
              const subName = Array.isArray(subitem) ? subitem[0] : subitem;
              const subPath = `${currentPath}/${subName}`;

              return (
                <Tree
                  key={subPath} // 100% UNIQUE
                  item={subitem}
                  selectedValue={selectedValue}
                  onSelect={onSelect}
                  parentPath={currentPath}
                />
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    </SidebarMenuItem>
  );
};
