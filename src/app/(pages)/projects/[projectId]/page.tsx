"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

import { getFilesByProject } from "@/lib/actions/file.actions";
import { getProjectById } from "@/lib/actions/project.actions";
import ProjectFilesSidebar from "@/components/ProjectFilesSidebar";
import FileViewer from "@/components/FileViewer";

import { Separator } from "@radix-ui/react-separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface FileType {
  _id: string;
  name: string;
  cloudinaryUrls: string[];
}

const ProjectDetailsPage = () => {
  const { projectId } = useParams();

  const [files, setFiles] = useState<FileType[]>([]);
  const [projectName, setProjectName] = useState("");
  const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

  const loadProject = async () => {
    const result = await getProjectById(projectId as string);
    setProjectName(result.name);
    setFiles(result.files);
  };

  const reloadFiles = async () => {
    const updated = await getFilesByProject(projectId as string);
    setFiles(updated);
  };

  useEffect(() => {
    loadProject();
  }, [projectId]);

  return (
    <SidebarProvider>
      <ProjectFilesSidebar
        projectId={projectId as string}
        files={files}
        onFileClick={setSelectedFile}
        reloadFiles={reloadFiles}
      />

      <main className="flex-1 p-6 pt-0 overflow-auto">
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
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/projects">Projects</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{projectName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        {selectedFile ? (
          <FileViewer file={selectedFile} />
        ) : (
          <p className="text-muted-foreground p-4">Select a file to view its content.</p>
        )}
      </main>
    </SidebarProvider>
  );
};

export default ProjectDetailsPage;
