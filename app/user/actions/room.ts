'use server'
import supabase from "@/config/supabase"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"

export async function getRooms() {
    const {data : rooms , error : roomsError} = await supabase
    .from('rooms')
    .select('*')
    .eq('status' , 'active')

    if(roomsError) throw roomsError

    return {success : true  , rooms}
}

export async function getUnavailableTime(roomId : string | undefined , date : string | null){

    if(!roomId || !date) return {success : false , message : 'ข้อมูลไม่ครบ'}

    const {data , error} = await supabase
    .from('reservations')
    .select("start_time , end_time")
    .eq('room_id' , roomId)
    .eq('date' , date)


    if(error) throw error

    console.log(data)
    return {success : true , data}
}

export async function createBooking(roomId : string , selectDate : string , selectedHours : number[]){
    if(!roomId && !selectDate && !selectedHours) return {success : false , message : 'ข้อมูลไม่ครบ'}

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return { 
            success: false, 
            message: "Unauthorized: กรุณาเข้าสู่ระบบก่อนทำการจอง" 
        };
    }
    // อัลกอรึทีมในการบันทึกการจอง แยกแยะ
}