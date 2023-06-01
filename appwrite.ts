import { Account, Client, Databases } from "appwrite";

const appwrite = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
const appwriteAccount = new Account(appwrite);
const appwriteDatabase = new Databases(appwrite);

export {appwrite, appwriteAccount, appwriteDatabase};