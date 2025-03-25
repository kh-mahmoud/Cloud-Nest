'use server'

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite"
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";


//check email existing on db
const getUserByemail = async (email: string) => {
    const { databases } = await createAdminClient()
    const result = await databases.listDocuments(
        appwriteConfig.databseId,
        appwriteConfig.usersCollectionId,
        [
            Query.equal('email', [email]),
        ]
    );

    return result.total > 0 ? result.documents[0] : null
}

//send email otp
export const sendEmailOtp = async (email: string) => {
    const { account } = await createAdminClient()

    try {
        const session = await account.createEmailToken(
            ID.unique(),
            email,
            true
        );

        return session.userId

    } catch (error) {
        console.log(error)
    }
}



export const CreateAccount = async ({ fullName, email }: { fullName: string, email: string }) => {

    const existingUser = await getUserByemail(email)
    const accountId = await sendEmailOtp(email)
    if (!accountId) throw new Error("Fail to send email otp")

    if (!existingUser) {
        const { databases } = await createAdminClient()

        await databases.createDocument(
            appwriteConfig.databseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                email,
                fullName,
                accountId,
                avatar: "https://img.freepik.com/free-vector/cute-hamster-holding-cheek-cartoon-illustration_138676-2773.jpg"
            }

        );
    }
    return parseStringify({ accountId })
}

export const verifyOtp = async (email: string, otp: string) => {

    try {
        const { account } = await createAdminClient()

        const session = await account.createSession(email, otp);

        (await cookies()).set('appwrite-session', session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true
        })

        return parseStringify({ sessionId: session.$id })
    } catch (error) {
        console.log(error)
    }

}


export const getCurrentUser = async () => {
    const { account, databases } = await createSessionClient()

    const result = await account.get();

    const user = await databases.listDocuments(
        appwriteConfig.databseId,
        appwriteConfig.usersCollectionId,
        [Query.equal("accountId", [result.$id])]
    );


    if (user.total <= 0) return null

    return parseStringify(user.documents[0])
}

export const signoutUser = async () => {

    try {
        const { account } = await createSessionClient()

        account.deleteSession('current');
        (await cookies()).delete('appwrite-session')
    }
    catch (error) {
        console.error('Error signing out:', error);
    }
    finally{
        redirect("/sign-in")
    }
}

export const signInUser = async(email:string)=>{
try {
    const existingUser = await getUserByemail(email)
    
    if(existingUser){
       const accountId = await sendEmailOtp(email)

       return parseStringify({accountId})

    }

    return parseStringify({accountId:null,error:"User not found"})

} catch (error) {
    console.log("error signIn user",error)
}
}

