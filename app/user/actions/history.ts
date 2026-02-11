'use server'
import supabase from "@/config/supabase";
import { getUidSession } from "@/utils/auth";


export async function getReservationsHistoryByDate(date: string) {
    // ดึงไอดีจาก session
    const uid = await getUidSession()

    // ดึงรายการการจองจาก uid and date
    const { data, error } = await supabase
        .from('reservations')
        .select(`
        id , date , start_time , end_time , status , rooms(name)    
    `)
        .eq('date', date)
        .eq('user_id', uid)
        .neq("status", 'rejected')
        .neq("status", 'cancelled')
        .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data }
}

export async function cancelReservation(reservation_id: string) {
    const uid = await getUidSession()
    // check ownership
    const { data: selectReservation, error: selectError } = await supabase
        .from('reservations')
        .select('user_id')
        .eq('id', reservation_id)
        .single()

    if (selectError) throw selectError
    if (!selectReservation) return { success: false, message: 'ไม่พบรายการจอง' }

    if (selectReservation.user_id !== uid) return { success: false, message: 'คุณไม่ใช่เข้าของรายการจองนี้' }

    const { error: updateError } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('id', reservation_id)

    if (updateError) throw updateError
    return { success: true, message: 'ยกเลิกการจองสำเร็จ' }
}