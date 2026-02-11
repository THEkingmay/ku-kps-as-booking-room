'use server'

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function getUidSession() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        throw new Error("Unauthorized: กรุณาเข้าสู่ระบบก่อนทำการจอง")
    }
    return session.user.id
}