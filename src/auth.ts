import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
import type { Provider } from "next-auth/providers"
import Credentials from "next-auth/providers/credentials"
import { ZodError } from "zod"
import { signInSchema } from "./lib/zod"
import { createUser, getUserFromDb, prisma } from "./utils/userAuth"

declare module 'next-auth' {
    interface Session extends DefaultSession {
        user: {
            companyName: string | unknown
        } & DefaultSession['user']
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string
        companyName: string | unknown
    }
}

type User = {
    id: bigint;
    created_at: Date;
    email: string | null;
    companyName: string | null;
}

const providers: Provider[] = [
    Credentials({
        credentials: {
            email: {},
            password: {},
        },
        authorize: async (credentials) => {
            try {
                const { email, password } = await signInSchema.parseAsync(credentials)
                let user = await getUserFromDb(email, password)

                if (!user) {
                    const user = await createUser(email, password)
                    return user as any
                }
                return user
            } catch (error) {
                if (error instanceof ZodError) {
                    return null
                }
                throw error
            }
        },
    }),
]

export const providerMap = providers.map((provider) => {
    if (typeof provider === "function") {
        const providerData = provider()
        return { id: providerData.id, name: providerData.name }
    } else {
        return { id: provider.id, name: provider.name }
    }
})

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers,
    callbacks: {
        jwt: async ({ token, user }: any) => {
            const userTyped = user as User
            if (userTyped) {
                token.id = userTyped.id
                token.companyName = userTyped?.companyName
            }
            return token
        },
        session: async ({ session, token }) => {
            session.user.id = token?.id
            session.user.companyName = token?.companyName
            return session
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.AUTH_SECRET,
    pages: {
        signIn: "/signin",
    }
})