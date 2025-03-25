

export const appwriteConfig = {
    endpointUrl: process.env.NEXT_PUBLIC_APPWRITE_URL!,
    projectId: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
    databseId: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
    usersCollectionId: process.env.NEXT_PUBLIC_APPWRITE_USERS_COLLECTION_ID!,
    filesCollectionId: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID!,
    storageCollectionId: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!,
    secretKey: process.env.NEXT_APP_APPWRITE_KEY!
}