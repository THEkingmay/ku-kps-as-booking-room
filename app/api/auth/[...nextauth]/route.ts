import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import supabase from "@/config/supabase"

// 1. ประกาศ Type เพิ่มเติม เพื่อให้ TS รู้จัก field 'role' และ 'id'
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
  interface User {
    id: string
    role: string // เพิ่ม role ใน User object
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user}) {
      const email = user.email || ""
        if (!email.toLowerCase().endsWith("@ku.th") && process.env.NODE_ENV == 'production') {
          return false
        }

      try {
        const { data: existingUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single()

        if (!existingUser) {
          const newUser = {
            id: user.id,
            email: email,
            name: user.name,
            role: 'user',
            image : user.image
          }

          const { error: insertError } = await supabase
            .from('users')
            .insert(newUser)

          if (insertError) {
            console.error("Error creating user:", insertError)
            return false
          }
          user.role = 'user'
        } else {
          user.role = existingUser.role
        }

        return true
      } catch (error) {
        console.error("SignIn Error:", error)
        return false
      }
    },

    async jwt({ token, user }) {
      // callback นี้จะทำงานทุกครั้งที่มีการเรียกใช้ session
      // แต่ parameter 'user' จะเข้ามาแค่ครั้งแรกตอน sign in (หลังจากผ่าน signIn callback)
      if (user) {
        token.id = user.id
        token.role = user.role 
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },
  
  pages: {
    signIn: '/',     // หน้า Login
    error: '/error', // หน้า Error
  }
}
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };