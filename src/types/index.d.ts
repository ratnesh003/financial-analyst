// ====== USER PARAMS
declare type CreateUserParams = {
  clerkId: string;
  email: string;
  username: string;
  firstName: string | null;
  lastName: string | null;
  photo: string;
};

declare type UpdateUserParams = {
  firstName: string | null;
  lastName: string | null;
  username: string;
  photo: string;
};


// ====== PROJECT PARAMS
declare type CreateProjectParams = {
  userId: string;
  name: string;
  description: string | null;
}

declare type UpdateProjectParam = {
  user: string | null;
  name: string | null;
  description: string | null;
  files: [string] | null;
  projectPrompt: string | null;
}

// ===== FILE PARAMS
declare type CreateFileParam = {
  projectId: string;
  userId: string;
  name: string; 
  cloudinaryUrl: string;
}