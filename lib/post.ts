import { databases, ID } from "./appwrite";
import { client } from "./appwrite"; // Ensure client is imported from your appwrite config

const DB_ID = "default";
const COLLECTION_ID = "posts";
export const ADMIN_ID = "YOUR_ADMIN_CLERK_USER_ID";

export async function createPost(title: string, tags: string[], link: string, user: any) {
  return databases.createDocument(
    DB_ID,
    COLLECTION_ID,
    ID.unique(),
    {
      title,
      tags,
      link,
      author: user.fullName || user.username || "Unknown",
      userId: user.id,
      createdAt: new Date().toISOString(),
    },
    ["role:all", `user:${ADMIN_ID}`] // permissions: read for all, write for admin
  );
}

export async function getPosts() {
  const response = await databases.listDocuments(DB_ID, COLLECTION_ID, [
    "createdAt,DESC",
  ]);
  return response.documents;
}

export async function updatePost(id: string, data: { title?: string; tags?: string[]; link?: string }) {
  return databases.updateDocument(DB_ID, COLLECTION_ID, id, data);
}

export async function deletePost(id: string) {
  return databases.deleteDocument(DB_ID, COLLECTION_ID, id);
}


export function subscribePosts(callback: (post: any) => void) {
  return client.subscribe(`collections.${COLLECTION_ID}.documents`, (res: any) => {
    callback(res.payload);
  });
}
