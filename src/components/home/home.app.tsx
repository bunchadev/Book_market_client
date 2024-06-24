'use client'

import { signIn, useSession } from "next-auth/react"
import { useEffect } from "react";

const HomeApp=()=>{
    const {data:session} = useSession()
    console.log(session)
    useEffect(() => {
        if (session?.error === "RefreshAccessTokenError") {
            signIn()
        }
    }, [session]);
    return(
        <div>
            hihihi
        </div>
    )
}
export default HomeApp