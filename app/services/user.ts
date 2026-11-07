import { PrismaClient} from "@prisma/client";
const prisma = new PrismaClient();
//register a new user
export const registerUser = async (email: string, userName: string, password: string) =>{
    try {
        const user = await prisma.user.create({
            data:{email, userName, passwordHash: password}
        });
        return user;
    } catch (error){
        console.error("Error registering user:", error);
        throw error;
    }

}
//login user
export const loginUser = async (email: string, password: string)=>{
    try{
        const user = await prisma.user.findFirst({
            where: {email}
        })
        return user;
    }catch (error){
        console.error("Error logging in user:", error);
        throw error; 
    }
}
//get user by id
export const getUserById = async (id: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id },
        });
        return user;
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        throw error;
    }
};
//get user by email
export const getUserByEmail = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });

        return user;
    } catch (error) {
        console.error("Error fetching user by email:", error);
        throw error;
    }
};

//get user by googleId
export const getUserByGoogleId = async (googleId: string) =>{
    try {
        const user = await prisma.user.findFirst({
            where: {googleId},
        })
        return user;
    }catch(error){
        console.error("Error fetching user by Google ID:", error);
        throw error;
    }
}
//create user with googleId
export const createGoogleUser = async(googleId: string, userName: string, email: string)=>{
    try{
        const user = await prisma.user.create({
            data: {googleId, userName, email,passwordHash: null}
        })
        return user;
    }catch(error){
        console.error("Error creating Google user:", error);
        throw error;
    }
}
//link googleId to existing user
export const linkGoogleAccount = async(userId: string, googleId: string)=>{
    try{
        const user = await prisma.user.update({
            where: {id: userId},
            data: {googleId}
        })
        return user;
    }catch(error){
        console.error("Error linking Google account:", error);
        throw error;
    }
}
//update userprofile
export const updateUserProfile = async(id: string, userName:  string, email: string, 
    farmName: string, phoneNumber: string, fullName: string,)=>{
        const updatedUser = await prisma.user.update({
            where: {id},
            data: {userName, email, farmName, phoneNumber, fullName}
        });
        return updatedUser;
    }

//save the reset token and its expiry to the user
export const savePasswordResetToken = async (
    email: string, resetTokenHash: string, resetTokenExpiry: Date) => {
        try{
            const user = await prisma.user.update({
                where: {email},
                data: {resetTokenHash, resetTokenExpiry}
            });
            return user;
        }catch(error){
            console.error("Error saving password reset token:", error);
            throw error;
        }
    };

    // getting user by the reset token
    export const getUserByResetToken = async(resetTokenHash: string)=>{
        try{
            const user = await prisma.user.findFirst({
                where: {resetTokenHash, resetTokenExpiry: 
                    {gt: new Date(),}
                }
            })
            return user;
        }catch(error){
            console.error("Error fetching user by reset token:", error);
            throw error;
        }
    }

    // updating the password resetted
    export const updatePasswordReset = async (userId: string, passwordHash: string) =>{
        try{
            const user = await prisma.user.update({
                where: {id: userId},
                data: {passwordHash, resetTokenHash: null, resetTokenExpiry: null}
            })
            return user;
        }
        catch(error){
            console.error("Error updating password:", error);
            throw error;
        }
    }