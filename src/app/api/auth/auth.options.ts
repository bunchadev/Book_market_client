import GithubProvider from "next-auth/providers/github"
import { AuthOptions, getServerSession } from "next-auth"
import { sendRequest } from "@/utils/api"
import { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials";

async function refreshAccessToken(token :JWT) {
       const refreshedTokens = await sendRequest<IBackendRes<JWT>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/User/refresh_token`,
        method: "GET",
        headers: {
            Authorization: `Bearer ${token?.refresh_token}`,
          },
          nextOption: {
            cache: 'no-store',
          }
        })
       if(refreshedTokens.code === 300){
        return {
            ...token,
            accessToken: refreshedTokens.data.access_token,
            expires_in: Date.now() + refreshedTokens.data.expires_in * 1000,
            refreshToken: refreshedTokens.data.refresh_token ?? token.refreshToken, // Fall back to old refresh token
            user:refreshedTokens.data.user,
            error : ""
          }
       }else{
        return {
            ...token,
            error: "RefreshAccessTokenError",
          }
       } 
}

export const authOptions: AuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "TrungDev",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const res = await sendRequest<IBackendRes<JWT>>({
                    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/User/signin`,
                    method: "POST",
                    body: { username: credentials?.username, password: credentials?.password }
                })
                if (res && res.data) {
                    return res.data as any
                } else {
                    throw new Error("can not login" as string)
                }
            }
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        })
    ],
    callbacks: {
        async jwt({ token, user, account, profile, trigger }) {
            if (trigger === "signIn" && account?.provider === "credentials") {
                //@ts-ignore
                token.access_token = user.access_token
                //@ts-ignore
                token.refresh_token = user.refresh_token
                //@ts-ignore
                token.expires_in = Date.now() + user.expires_in * 1000
                //@ts-ignore
                token.user = user.user
            }
            //@ts-ignore
            if (Date.now() < token.expires_in) {
                return token
            }
            
            return refreshAccessToken(token)
        },
        session({ session, token, user }) {
            if (token) {
                session.access_token = token.access_token
                session.refresh_token = token.refresh_token
                session.user = token.user
                session.error = token.error
            }
            return session
        },
    },
    pages: {
        signIn: '/auth/signin'
    }
}