'use server'

import { sendRequest } from "../api"

export async function SignupUser(username :string,email :string,password :string) {
    const result = await sendRequest<IBackendRes<null>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/User/signup`,
        method: "POST",
        body:{
          username:username,
          email:email,
          password:password,
          role:"user"
        },
        nextOption: {
          cache: 'no-store',
        }
    })
    return result
}