import { deleteProject } from "@/lib/actions/project.actions";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Eye, MoreHorizontal, Pen, Trash } from "lucide-react";

const ProjectEditButton = ({
  projectId,
  onDelete
}: {
  projectId: string;
  onDelete: (id: string) => void;
}) => {

  const router = useRouter();

  async function deletedProject() {
    await deleteProject(projectId);
    onDelete(projectId);
    router.refresh();
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        onClick={(e) => e.stopPropagation()}  // ← prevent Link click
      >
        <DropdownMenuLabel>Actions</DropdownMenuLabel>

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/projects/${projectId}`);
          }}
        >
          <Pen /> Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={(e) => {
            e.stopPropagation();
            router.push(`/projects/${projectId}`);
          }}
        >
          <Eye /> View
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            await deletedProject();
          }}
        >
          <Trash /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};


export default ProjectEditButton;
