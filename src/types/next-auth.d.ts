import NextAuth, { DefaultSession } from "next-auth"
import { JWT } from "next-auth/jwt"
interface IUser {
    id: string,
    username: string,
    email: string,
    balance: number,
    depot_limit: number,
    role: string
}
declare module "next-auth/jwt" {
    interface JWT {
        access_token: string,
        refresh_token: string,
        expires_in:number,
        error:string,
        user: IUser
    }
}
declare module "next-auth" {
    interface Session {
        access_token: string,
        refresh_token: string,
        expires_in:string,
        error:string,
        user: IUser
    }

}