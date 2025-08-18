import { Client, Account, Databases, ID } from "appwrite";

const client = new Client();
const APPWRITE_PROJECTID = "68a293e50019e4a5a300"; // Replace with your Appwrite project ID

client
  .setEndpoint("https://syd.cloud.appwrite.io/v1") // Or your self-hosted endpoint
  .setProject(APPWRITE_PROJECTID); // Appwrite project ID

export const account = new Account(client);
export const databases = new Databases(client);
export { ID, client };

