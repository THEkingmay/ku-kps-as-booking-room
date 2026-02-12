'use server'
import { getUidSession } from "@/utils/auth"
import { db } from "@/app/db"
import { rooms, reservations } from "@/app/db/schema"
import { eq, and, ne } from "drizzle-orm"

export async function getRooms() {
    try {
        const data = await db.query.rooms.findMany({
            where: eq(rooms.status, 'active'),
        });
        return { success: true, rooms: data };
    } catch (error) {
        return { success: false, error };
    }
}

export async function getUnavailableTime(roomId: string | undefined, date: string | null) {
    if (!roomId || !date) return { success: false, message: 'ข้อมูลไม่ครบ' }

    try {
        const data = await db.query.reservations.findMany({
            columns: {
                startTime: true, 
                endTime: true,
            },
            where: and(
                eq(reservations.roomId, roomId),
                eq(reservations.date, date),
                ne(reservations.status, 'rejected'),
                ne(reservations.status, 'cancelled')
            )
        });
        return { success: true, data };
    } catch (error) {
        return { success: false, error };
    }
}


const BOOKING_LIMIT = 3

export async function createBooking(roomId: string, selectDate: string, selectedHours: number[]) {
    if (!roomId || !selectDate || !selectedHours) return { success: false, message: 'ข้อมูลไม่ครบ' }

    if (selectedHours.length > 3) return { success: false, message: 'จองเกิน 3 ชั่วโมงไม่ได้' }

    const uid = await getUidSession()
    if (!uid) return { success: false, message: 'กรุณาเข้าสู่ระบบ' }

    // 1. Sort hour
    selectedHours = selectedHours.sort((a, b) => a - b)

    const payload: typeof reservations.$inferInsert[] = []

    for (let i = 0; i <= selectedHours.length - 1; i++) {
        let temp = { start_time: selectedHours[i], end_time: selectedHours[i] + 1 }
        
        for (let j = i; j <= selectedHours.length - 1; j++) {
            if (selectedHours[j] + 1 !== selectedHours[j + 1]) {
                break 
            }
                        temp.end_time = selectedHours[j + 1] + 1
            i = j + 1 
        }

        payload.push({
            roomId: roomId,   
            userId: uid,      
            date:selectDate,
            startTime: temp.start_time, 
            endTime: temp.end_time,   
            status: 'reserved'
        })
    }

    const existingBookings = await db.query.reservations.findMany({
        columns: { startTime: true, endTime: true },
        where: and(
            eq(reservations.roomId, roomId),
            eq(reservations.date,selectDate),
            ne(reservations.status, 'rejected'),
            ne(reservations.status, 'cancelled'),
        )
    });

    const isOverlap = payload.some(newItem => {
        return existingBookings.some(existing =>
            newItem.startTime! < existing.endTime && newItem.endTime! > existing.startTime
        );
    });

    if (isOverlap) {
        return { success: false, message: 'ช่วงเวลาที่เลือกถูกจองไปแล้ว กรุณาเลือกใหม่' };
    }

    // 5. ตรวจสอบโควต้า 3 ชั่วโมงต่อวัน
    const userBooked = await db.query.reservations.findMany({
        columns: { startTime: true, endTime: true },
        where: and(
            eq(reservations.date, selectDate),
            eq(reservations.userId, uid),
            ne(reservations.status, 'rejected'),
            ne(reservations.status, 'cancelled')
        )
    });

    let totalHours = 0
    userBooked.forEach(booked => totalHours += (booked.endTime - booked.startTime))

    if (totalHours + selectedHours.length > BOOKING_LIMIT) {
        return { success: false, message: `สิทธิการจองในวัน ${selectDate} ของคุณเหลือ ${BOOKING_LIMIT - totalHours} ชั่วโมง` }
    }

    try {
        await db.insert(reservations).values(payload);
        return { success: true, message: 'จองสำเร็จ' };
    } catch (insertError) {
        console.error(insertError);
        return { success: false, message: 'บันทึกการจองไม่สำเร็จ' };
    }
}


export async function getRoomScheduleByDate(date: Date) {
    try {

        const data = await db.query.rooms.findMany({
            columns: {
                name: true, // เลือกเอาแค่ชื่อห้อง
            },
            with: {
                reservations: {
                    columns: {
                        startTime: true,
                        endTime: true,
                        status: true,
                    },
                    where: and(
                        eq(reservations.date, date.toDateString()),
                        ne(reservations.status, 'cancelled'),
                        ne(reservations.status, 'rejected')
                    )
                }
            }
        });

        return { success: true, data };
    } catch (error) {
        return { success: false, error };
    }
}