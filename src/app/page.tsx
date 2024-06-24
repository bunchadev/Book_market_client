import { getServerSession } from "next-auth"
import { authOptions } from "./api/auth/auth.options"
import { redirect } from "next/navigation"
import HomeApp from "@/components/home/home.app"

const Home = async () => {
  const session = await getServerSession(authOptions)
  if(!session?.user){
    redirect("/auth/signin")
  }
  return (
    <div>
       <HomeApp/>
    </div>
  )
}
export default Home
