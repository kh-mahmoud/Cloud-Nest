'use server'

import { DeleteFileProps, FileType, GetFilesProps, RenameFileProps, UpdateFileUsersProps, UploadProps } from "@/types"
import { createAdminClient, createSessionClient } from "../appwrite"
import { InputFile } from "node-appwrite/file"
import { appwriteConfig } from "../appwrite/config"
import { ID, Query } from "node-appwrite"
import { constructFileUrl, createQueries, getFileType, parseStringify } from "../utils"
import { revalidatePath } from "next/cache"
import { getCurrentUser } from "./user.action"
import { redirect } from "next/navigation"


export const uploadFile = async ({ file, ownerId, accountId, path }: UploadProps) => {
    const { databases, storage } = await createAdminClient()

    try {
        const inputFile = InputFile.fromBuffer(file, file.name)

        //create new FileDocument in the database file storage

        const bucketFile = await storage.createFile(
            appwriteConfig.storageCollectionId,
            ID.unique(),
            inputFile
        );

        if (bucketFile.$id) {
            const FileDocument = {
                type: getFileType(bucketFile.name).filetype,
                name: bucketFile.name.split(".")[0],
                url: constructFileUrl(bucketFile.$id).url,
                extension: getFileType(bucketFile.name).extension,
                size: bucketFile.sizeOriginal,
                owner: ownerId,
                accountId,
                users: [],
                bucketField: bucketFile.$id,
            }

            //create new FileDocument in the database collection

            const newFile = await databases.createDocument(
                appwriteConfig.databseId,
                appwriteConfig.filesCollectionId,
                ID.unique(),
                FileDocument,
            ).catch(async (error) => {
                await storage.deleteFile(appwriteConfig.storageCollectionId, bucketFile.$id)
                throw error
            })

            revalidatePath(path)
            return parseStringify(newFile)
        }

    } catch (error) {
        console.log(error)
    }

}


export const getFiles = async ({types,searchquery='',sort='$createdAt-desc',limit}:GetFilesProps) => {
    const { databases } = await createAdminClient()

    try {
        const currentUser = await getCurrentUser()
        if (!currentUser) redirect('/sign-in')

        const queries = createQueries({currentUser,types,searchquery,sort,limit})

        const files = await databases.listDocuments(
            appwriteConfig.databseId,
            appwriteConfig.filesCollectionId,
            queries
        )


        return parseStringify(files)

    } catch (error) {
        console.log(error)
    }

}


export const RenameFile = async ({ fileId, name, path }: RenameFileProps) => {

    const { databases } = await createAdminClient();

    try {
        const newName = `${name}`;
        const updatedFile = await databases.updateDocument(
            appwriteConfig.databseId,
            appwriteConfig.filesCollectionId,
            fileId,
            {
                name: newName,
            },
        );

        revalidatePath(path);
        return parseStringify(updatedFile);
    } catch (error) {
        console.log(error, "Failed to rename file");
    }
};


export const UpdateFileUsers = async ({ fileId, emails, path }: UpdateFileUsersProps) => {

    const { databases } = await createAdminClient();
    const currentUser = await getCurrentUser()
    if (!currentUser) redirect('/sign-in')

    try {

        const updatedFile = await databases.updateDocument(
            appwriteConfig.databseId,
            appwriteConfig.filesCollectionId,
            fileId,
            {
                users: emails.filter((email) => email !== currentUser.email),
            },
        );

        revalidatePath(path);
        return parseStringify(updatedFile);
    } catch (error) {
        console.log(error, "Failed to rename file");
    }
};


export const DeleteFile = async ({ fileId, bucketFileId, path }: DeleteFileProps) => {

    const { databases, storage } = await createAdminClient();

    try {

        const deleteFile = await databases.deleteDocument(
            appwriteConfig.databseId,
            appwriteConfig.filesCollectionId,
            fileId,
        );

        if (deleteFile) {
            await storage.deleteFile(
                appwriteConfig.storageCollectionId,
                bucketFileId
            );
        }

        revalidatePath(path);
        return parseStringify(deleteFile);
    } catch (error) {
        console.log(error, "Failed to rename file");
    }
};


export async function getTotalSpaceUsed() {
    try {
      const { databases } = await createSessionClient();
      const currentUser = await getCurrentUser();
      if (!currentUser) throw new Error("User is not authenticated.");
  
      const files = await databases.listDocuments(
        appwriteConfig.databseId,
        appwriteConfig.filesCollectionId,
        [Query.equal("owner", [currentUser.$id])],
      );
  
      const totalSpace = {
        image: { size: 0, latestDate: "" },
        document: { size: 0, latestDate: "" },
        video: { size: 0, latestDate: "" },
        audio: { size: 0, latestDate: "" },
        archive: { size: 0, latestDate: "" },
        other: { size: 0, latestDate: "" },
        used: 0,
        all: 2 * 1024 * 1024 * 1024 /* 2GB available */,
      };
  
      files.documents.forEach((file) => {
        const fileType = file.type as FileType;
        totalSpace[fileType].size += file.size;
        totalSpace.used += file.size;
  
        if (
          !totalSpace[fileType].latestDate ||
          new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
        ) {
          totalSpace[fileType].latestDate = file.$updatedAt;
        }
      });
  
      return parseStringify(totalSpace);
    } catch (error) {
      console.log(error, "Error calculating total space used:, ");
    }
  }
