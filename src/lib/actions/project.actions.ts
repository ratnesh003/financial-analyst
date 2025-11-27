"use server";

import User from "../database/models/user.model";
import Project from "../database/models/project.model";
import File from "../database/models/file.model";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import { redirect } from "next/dist/server/api-utils";
import { NextResponse } from "next/server";

// CREATE
export async function createProject(params: CreateProjectParams) {
    const { userId, name, description } = params;

    try {
        await connectToDatabase();

        // 1. Create project
        const newProject = await Project.create({
            user: userId,
            name,
            description,
            projectPrompt: "",
            files: []
        });

        // 2. Add project reference to user
        await User.findByIdAndUpdate(
            userId,
            { $push: { projects: newProject._id } }
        );

        revalidatePath("/projects");
        
        return JSON.parse(JSON.stringify(newProject));
    } catch (error) {
        handleError(error);
    }
}

// GET BY PROJECT ID
export async function getProjectById(projectId: string) {
    try {
        await connectToDatabase();

        const project = await Project.findById(projectId)
            .populate("files")
            .populate("user");

        if (!project) throw new Error("Project not found");

        return JSON.parse(JSON.stringify(project));
    } catch (error) {
        handleError(error);
    }
}

// GET BY USER ID
export async function getProjectsByUser(userId: string) {
    try {
        await connectToDatabase();

        const projects = await Project.find({ user: userId }).sort({ createdAt: -1 });

        return JSON.parse(JSON.stringify(projects));
    } catch (error) {
        handleError(error);
    }
}

// UPDATE PROJECT
export async function updateProject(projectId: string, data: UpdateProjectParam) {
    try {
        await connectToDatabase();

        const updated = await Project.findByIdAndUpdate(projectId, data, {
            new: true,
        });

        if (!updated) throw new Error("Project update failed");

        return JSON.parse(JSON.stringify(updated));
    } catch (error) {
        handleError(error);
    }
}


// DELETE PROJECT
export async function deleteProject(projectId: string) {
    try {
        await connectToDatabase();

        const project = await Project.findById(projectId);
        if (!project) throw new Error("Project not found");

        // 1. Delete all files in this project
        await File.deleteMany({ project: projectId });

        // 2. Remove project from user's list
        await User.findByIdAndUpdate(project.user, {
            $pull: { projects: projectId },
        });

        // 3. Delete project
        const deleted = await Project.findByIdAndDelete(projectId);

        revalidatePath("/projects");

        return deleted ? JSON.parse(JSON.stringify(deleted)) : null;
    } catch (error) {
        handleError(error);
    }
}
