'use server'
import supabase from "@/config/supabase"
import { getUidSession } from "@/utils/auth"

export async function getRooms() {
    const { data: rooms, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .eq('status', 'active')

    if (roomsError) throw roomsError

    return { success: true, rooms }
}

export async function getUnavailableTime(roomId: string | undefined, date: string | null) {

    if (!roomId || !date) return { success: false, message: 'ข้อมูลไม่ครบ' }

    const { data, error } = await supabase
        .from('reservations')
        .select("start_time , end_time")
        .eq('room_id', roomId)
        .eq('date', date)
        .neq("status", 'rejected')
        .neq("status", 'cancelled')


    if (error) throw error
    return { success: true, data }
}


const BOOKING_LIMIT = 3
export async function createBooking(roomId: string, selectDate: string, selectedHours: number[]) {
    if (!roomId && !selectDate && !selectedHours) return { success: false, message: 'ข้อมูลไม่ครบ' }

    if (selectedHours.length > 3) return { success: false, message: 'จองเกิน 3 ชั่วโมงไม่ได้' }

    const uid = await getUidSession()
    
    // อัลกอรึทีมในการบันทึกการจอง แยกแยะ
    // 1. sort hour
    selectedHours = selectedHours.sort((a, b) => a - b)

    // 2.สร้างตัวแปร payload สำหรับบันทึกลง supabase 
    const payload: { room_id: string, user_id: string, date: string, start_time: number, end_time: number }[] = []

    // 3. วนลุปหาจุดเชื่อมต่อ ( จองติดกัน )
    for (let i = 0; i <= selectedHours.length - 1; i++) {
        let temp = { start_time: selectedHours[i], end_time: selectedHours[i] + 1 } // เริ่มแรกให้เวลาเริ่มคือ i เวลาจบคือตัวมันเอง +1 ในกรณีที่ไม่มีตัวต่อ
        for (let j = i; j <= selectedHours.length - 1; j++) { // ให้เชคกับตัวถัดไปของตัวปัจจุบัน
            //  ถ้าค่าของตำแหน่งปัจจุบัน+1 ไม่เท่ากับกับค่าของตำแหน่งถัดไป แปลว่า ไม่เชื่อม ให้ break เลย เช่น [9 , 11 , 12]
            // ถ้าเป็น 9 จะได้ว่า 11 != 9+1 แปลว่าไม่เชื่อม ให้ออกเลย และ pushลง payload ให้ start = 9 , end = 9+1
            if (selectedHours[j] + 1 !== selectedHours[j + 1]) break
            // ถ้าเชื่อมกันแปลว่าจะเปลี่ยน end ของ temp จากตัว i เป็น ตำแหน่ง j + 1 และบวกค่าอีก 1 เพราะตำแหน่งนั้นมันคือเวลาเริ่ม ถ้าอยากได้เวลาจบต้องบวก เช่น เริ่ม 9 จบคือ 9+1 = 10 
            temp.end_time = selectedHours[j + 1] + 1

            i = j + 1 // ให้เริ่มตำแหน่งถัดไปเลยไม่ต้องเชคตำแหน่งนี้เช่น มันต่อกันทั้ง index 0 1 ให้เปลี่ยน i เป็น 1 พอมัน  break มันจะไปเจิอ i++ กลายเป็น 2 ก็เลยข้ามมันไปเลยไม่ต้องเชคตำแหน่ง 1 เพราะมันไปรวมกับตำแหน่ง 0 แล้ว
        }

        payload.push({
            room_id: roomId,
            user_id: uid,
            date: selectDate,
            start_time: temp.start_time,
            end_time: temp.end_time
        })
    }

    // console.log(payload)
    // ตรวจสอบว่า payload แต่ละตำแหน่งมัน ชน( overlap )  กันมั้ย
    // เชค room_id ตรง date ตรง เวลาเริ่มอันใหม่น้อยกว่าเวลาจบอันเก่า และ จบอันใหม่มากกว่าเริ่มอันเก่า

    const { data: existingBookings, error: fetchError } = await supabase
        .from('reservations')
        .select('start_time, end_time ')
        .eq('room_id', roomId)
        .eq('date', selectDate)
        .neq("status", 'rejected')
        .neq("status", 'cancelled')


    if (fetchError) return { success: false, message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' };

    const isOverlap = payload.some(newItem => {
        return existingBookings?.some(existing =>
            newItem.start_time < existing.end_time && newItem.end_time > existing.start_time
        );
    });

    if (isOverlap) {
        return { success: false, message: 'ช่วงเวลาที่เลือกถูกจองไปแล้ว กรุณาเลือกใหม่' };
    }

    // ตรวจสอบว่าผู้ใช้คนนี้จองครบ 3 ชั่วโมงหรือยัง
    // ดึงข้อมูลการจองทั้งหมดในวันนี้ของผู้ใช้คนนี้
    const { data: userBooked, error: userBookedError } = await supabase
        .from('reservations')
        .select('start_time , end_time')
        .eq('date', selectDate)
        .eq('user_id', uid)
        .neq("status", 'rejected')
        .neq("status", 'cancelled')


    if (userBookedError) return { success: false, messgae: "เกิดข้อผิดพลาดในการดึงประวัติการใช้งานของผู้ใช้" }
    // คำนวนเวลา 
    let totalHours = 0
    userBooked.forEach(booked => totalHours += (booked.end_time - booked.start_time))

    if (totalHours + selectedHours.length > BOOKING_LIMIT) { // จองเกิน
        return { success: false, message: `สิทธิการจองในวัน ${selectDate} ของคุณเหลือ ${BOOKING_LIMIT - totalHours} ชั่วโมง` }
    }

    // เพิ่มข้อมูลหากผ่านทุกอย่าง
    const { error: insertError } = await supabase
        .from('reservations')
        .insert(payload);

    if (insertError) {
        console.error(insertError);
        return { success: false, message: 'บันทึกการจองไม่สำเร็จ' };
    }

    return { success: true, message: 'จองสำเร็จ' };

}


export async function getRoomScheduleByDate(date : Date) {
    const {data , error} = await supabase
    .from('rooms')
    .select(`
        name , reservations(start_time , end_time , status)
    `)
    .eq('reservations.date', date.toDateString())
    .neq('reservations.status' , 'cancelled')
    .neq('reservations.status' , 'rejected')

    if(error) throw error

    return {success : true , data}
}