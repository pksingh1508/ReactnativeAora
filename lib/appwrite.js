import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.pksingh.aoraa',
    projectId: '66a76ba1002715068942',
    databaseId: '66a76eef0004be2a876f',
    userCollectionId: '66a76f0e0004a8d28f01',
    videoCollectionId: '66a76f44003d5b17b08f',
    storageId: '66a77092001e89c597d5'
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform)
    ;

const account = new Account(client);
const avatar = new Avatars(client);
const databases = new Databases(client);

// Register User
export const createUser = async (email, password, username) => {
    try {
        const newAccount = await account.create(ID.unique(),
            email,
            password,
            username
        );
        if (!newAccount) {
            throw Error;
        }

        const avatarUrl = avatar.getInitials(username);
        // await signIn(email, password);
        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )
        return newUser;

    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

export async function signIn(email, password) {
    try {
        const session = await account.createEmailPasswordSession(email, password);
        return session;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}


export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) {
            throw new Error;
        }
        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        if (!currentUser) {
            throw new Error;
        }
        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

