import { Account, Client } from "appwrite";

const appwrite = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
const appwriteAccount = new Account(appwrite);

export {appwrite, appwriteAccount};