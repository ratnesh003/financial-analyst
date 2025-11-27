"use server";

import File from "../database/models/file.model";
import Project from "../database/models/project.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

// CREATE FILE
export async function createFile(params: CreateFileParam) {
    const { projectId, userId, name, cloudinaryUrl } = params;

    try {
        await connectToDatabase();

        // 1. Create file
        const newFile = await File.create({
            project: projectId,
            user: userId,
            name,
            cloudinaryUrls: [cloudinaryUrl], // first version
        });

        // 2. Link file to project
        await Project.findByIdAndUpdate(
            projectId,
            { $push: { files: newFile._id } }
        );

        return JSON.parse(JSON.stringify(newFile));
    } catch (error) {
        handleError(error);
    }
}

// GET FILE BY ID
export async function getFileById(fileId: string) {
    try {
        await connectToDatabase();

        const file = await File.findById(fileId).populate("project").populate("user");

        if (!file) throw new Error("File not found");

        return JSON.parse(JSON.stringify(file));
    } catch (error) {
        handleError(error);
    }
}

// DELETE FILE BY ID
export async function deleteFile(fileId: string) {
    try {
        await connectToDatabase();

        const file = await File.findById(fileId);
        if (!file) throw new Error("File not found");

        // 1. Remove file reference from project
        await Project.findByIdAndUpdate(file.project, {
            $pull: { files: fileId },
        });

        // 2. Delete file
        const deleted = await File.findByIdAndDelete(fileId);

        return deleted ? JSON.parse(JSON.stringify(deleted)) : null;
    } catch (error) {
        handleError(error);
    }
}
