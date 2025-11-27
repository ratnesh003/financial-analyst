"use client";

import React, { useEffect, useState } from "react";
import { ProjectSidebar } from "@/components/ProjectsSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getProjectsByUser } from "@/lib/actions/project.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ProjectEditButton from "@/components/ProjectEditButton";

interface ProjectProp {
  _id: string;
  name: string;
  description?: string;
}

const ProjectsPage = () => {
  const router = useRouter();
  const { user, isLoaded, isSignedIn } = useUser();

  const [projects, setProjects] = useState<ProjectProp[]>([]);
  const [loading, setLoading] = useState(true);

  // ---------------------------
  // Fetch User + Projects Logic
  // ---------------------------
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    const fetchData = async () => {
      try {
        const userInDB = await getUserById(user!.id);

        if (!userInDB?._id) return;

        const userProjects = await getProjectsByUser(userInDB._id);
        setProjects(userProjects);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoaded, isSignedIn, user, router]);

  // ---------------------------
  // Loading States
  // ---------------------------

  const handleProjectDeleted = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p._id !== projectId));
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center h-[70vh] text-lg">
        Loading...
      </div>
    );
  }

  return (
    <SidebarProvider>
      <ProjectSidebar
        username={user!.username ?? user!.firstName ?? "User"}
        email={user!.primaryEmailAddress?.emailAddress}
      />
      <main className="px-6 w-full">
        {/* <SidebarTrigger /> */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Projects</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <h1 className="text-3xl font-semibold my-8">Your Projects</h1>

        {projects.length === 0 ? (
          <p className="text-muted-foreground">No projects yet. Create one!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project._id}
                href={`/projects/${project._id}`}
                className="border rounded-lg p-5 hover:bg-accent transition"
              >
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-xl">{project.name}</h2>
                  <ProjectEditButton
                    projectId={project._id}
                    onDelete={handleProjectDeleted}
                  />
                </div>
                {project.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {project.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </SidebarProvider>
  );
};

export default ProjectsPage;
