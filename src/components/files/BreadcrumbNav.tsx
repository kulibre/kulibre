
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

interface BreadcrumbNavProps {
  folderPath: { id: string; name: string }[];
  onNavigate: (folderId: string | null, index: number) => void;
}

export function BreadcrumbNav({ folderPath, onNavigate }: BreadcrumbNavProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink onClick={() => onNavigate(null, 0)} className="flex items-center hover:underline cursor-pointer">
            <Home className="h-4 w-4 mr-1" />
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>
        
        {folderPath.map((folder, index) => (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem key={folder.id || `folder-${index}`}>
              {index === folderPath.length - 1 ? (
                <BreadcrumbPage>{folder.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink 
                  onClick={() => onNavigate(folder.id, index + 1)}
                  className="hover:underline cursor-pointer"
                >
                  {folder.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
