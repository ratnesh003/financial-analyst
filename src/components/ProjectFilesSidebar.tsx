"use client";

import React, { useRef, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Upload, FileText } from "lucide-react";

import { createFile } from "@/lib/actions/file.actions";
import { getUserById } from "@/lib/actions/user.actions";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";
import Logo from "./Logo";
import Link from "next/link";

interface ProjectFile {
  _id: string;
  name: string;
  cloudinaryUrls: string[];
}

interface Props {
  projectId: string;
  files: ProjectFile[];
  reloadFiles: () => Promise<void> | void;
  onFileClick: (file: ProjectFile) => void;
}

const ProjectFilesSidebar: React.FC<Props> = ({
  projectId,
  files,
  reloadFiles,
  onFileClick,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { user } = useUser();

  const uploadCSVToAPI = async (file: File) => {
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/upload-file", {
      method: "POST",
      body: form,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Upload failed");

    return data.url;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      alert("Only CSV files allowed.");
      return;
    }

    setUploading(true);

    try {
      if (!user) return toast.error("User not logged in");

      const userInDB = await getUserById(user.id);

      const fileUrl = await uploadCSVToAPI(file);

      await createFile({
        projectId,
        userId: userInDB._id,
        name: file.name,
        cloudinaryUrls: [fileUrl], // server action converts to array
      });

      toast.success("File uploaded successfully ")

      await reloadFiles();
    } catch (err) {
      console.error(err);
      alert("File upload failed");
    }

    setUploading(false);
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="bg-primary/70 text-primary-foreground tracking-tight font-semibold text-xl flex flex-row items-center justify-start gap-4 p-4">
        <Logo />
        <Link href="/">
          <h1>FinAnalyst</h1>
        </Link>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <Button
          variant="default"
          className="w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? "Uploading..." : "Add CSV File"}
        </Button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleUpload}
          className="hidden"
        />

        <SidebarGroup>
          <SidebarGroupLabel>Uploaded Files</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {files.map((file) => (
                <SidebarMenuItem key={file._id}>
                  <button
                    onClick={() => onFileClick(file)}
                    className="flex items-center gap-2 p-2 w-full text-left rounded-md hover:bg-accent"
                  >
                    <FileText className="h-4 w-4" />
                    {file.name}
                  </button>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default ProjectFilesSidebar;
