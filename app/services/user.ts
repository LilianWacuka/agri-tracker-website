import { PrismaClient} from "@/generated/prisma/client";
const prisma = new PrismaClient();
//register a new user
export const registerUser = async (email: string, userName: string, password: string) =>{
    try {
        const user = await prisma.user.create({
            data:{email, userName, password}
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
//update user
