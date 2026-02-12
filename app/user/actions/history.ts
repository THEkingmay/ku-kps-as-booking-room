'use server'
import { getUidSession } from "@/utils/auth";
import { db } from "@/app/db";
import { reservations } from "@/app/db/schema";
import { eq, and, ne, desc } from "drizzle-orm";

export async function getReservationsHistoryByDate(date: string) {
    const uid = await getUidSession();

    try {
        const data = await db.query.reservations.findMany({
            where: and(
                eq(reservations.date, date),
                eq(reservations.userId, uid),
                ne(reservations.status, 'rejected'),
                ne(reservations.status, 'cancelled')
            ),
            with: {
                room: {
                    columns: {
                        name: true
                    }
                }
            },
            orderBy: [desc(reservations.createdAt)]
        });

        return { success: true, data };
    } catch (error) {
        throw error;
    }
}

export async function cancelReservation(reservation_id: string) {
    const uid = await getUidSession();

    try {
        const selectReservation = await db.query.reservations.findFirst({
            where: eq(reservations.id, reservation_id),
            columns: {
                userId: true
            }
        });

        if (!selectReservation) return { success: false, message: 'ไม่พบรายการจอง' };
        if (selectReservation.userId !== uid) return { success: false, message: 'คุณไม่ใช่เจ้าของรายการจองนี้' };

        await db.update(reservations)
            .set({ status: 'cancelled' })
            .where(eq(reservations.id, reservation_id));

        return { success: true, message: 'ยกเลิกการจองสำเร็จ' };
    } catch (error) {
        throw error;
    }
}