import { PrismaClient } from "@prisma/client"
export const prisma = new PrismaClient();

export const getUserFromDb = async (email: any, password: string) => {
    const user = await prisma.user.findFirst({
        where: {
            email: email,
            password: password
        }
    })

    return user
}

export const createUser = async (email: string, password: string) => {
    const user = await prisma.user.create({
        data: {
            email: email,
            password: password
        }
    })

    return user
}