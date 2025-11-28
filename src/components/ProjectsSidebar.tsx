import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "./Logo";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import AddProject from "./AddProject";

export function ProjectSidebar({
  username,
  email,
}: {
  username: string | null;
  email: string | undefined;
}) {
  return (
    <Sidebar>
      <SidebarHeader className="bg-primary/70 text-primary-foreground tracking-tight font-semibold text-xl flex flex-row items-center justify-start gap-4 p-4">
        <Logo />
        <Link href={"/"}>
          <h1>FinAnalyst</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <AddProject />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex flex-row tracking-tight font-medium p-4 gap-4 items-center justify-center">
        <UserButton />
        <div>
          <h1>{username}</h1>
          <p className="text-xs font-normal -mt-1">{email}</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
