"use client";

import { useUser } from '@clerk/nextjs'
import React from 'react'

const ProjectsPage = () => {
  const { isSignedIn, user, isLoaded } = useUser()

  // Use `isLoaded` to check if Clerk is loaded
  if (!isLoaded) {
    return <div>Loading...</div>
  }

  // Use `isSignedIn` to protect the content
  if (!isSignedIn) {
    return <div>Sign in to view this page</div>
  }

  // Use `user` to access the current user's data
  return <div>Hello {user.firstName}!</div>
}

export default ProjectsPage