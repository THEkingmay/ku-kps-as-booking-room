'use client'

import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import { createBooking, getUnavailableTime } from "../actions/room"
interface ModalProps {
    roomId: string | undefined
    roomName: string | undefined
    onClose: () => void
}

export default function ReservationModal({ roomName, roomId, onClose }: ModalProps) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null)

    useEffect(() => {
        if (roomId) {
            setSelectedDate(null)

            const today = new Date()
            const tomorrow = new Date(today)
            tomorrow.setDate(tomorrow.getDate() + 1)

            const formatDate = (date: Date) => date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
            const todayStr = today.toISOString().split('T')[0]
            const tomorrowStr = tomorrow.toISOString().split('T')[0]

            Swal.fire({
                title: `<span class="text-xl font-bold text-slate-700">จองห้อง ${roomName}</span>`,
                html: `
                    <div class="flex flex-col gap-4 pt-2">
                        <label class="text-sm text-slate-500 font-medium text-left">เลือกวันที่ต้องการจอง:</label>
                        <div class="grid grid-cols-2 gap-3">
                            <input type="radio" id="date-today" name="booking-date" value="${todayStr}" class="peer/today hidden" checked>
                            <label for="date-today" class="cursor-pointer rounded-xl border-2 border-slate-200 bg-white p-3 text-center transition-all hover:bg-slate-50 peer-checked/today:border-emerald-500 peer-checked/today:bg-emerald-50 peer-checked/today:text-emerald-700">
                                <div class="text-xs text-slate-400">วันนี้</div>
                                <div class="font-bold text-lg">${formatDate(today)}</div>
                            </label>

                            <input type="radio" id="date-tomorrow" name="booking-date" value="${tomorrowStr}" class="peer/tomorrow hidden">
                            <label for="date-tomorrow" class="cursor-pointer rounded-xl border-2 border-slate-200 bg-white p-3 text-center transition-all hover:bg-slate-50 peer-checked/tomorrow:border-emerald-500 peer-checked/tomorrow:bg-emerald-50 peer-checked/tomorrow:text-emerald-700">
                                <div class="text-xs text-slate-400">พรุ่งนี้</div>
                                <div class="font-bold text-lg">${formatDate(tomorrow)}</div>
                            </label>
                        </div>
                    </div>
                `,
                showCancelButton: true,
                confirmButtonText: 'ถัดไป',
                cancelButtonText: 'ยกเลิก',
                confirmButtonColor: '#10b981',
                cancelButtonColor: '#94a3b8',
                reverseButtons: true,
                focusConfirm: false,
                allowOutsideClick: false,
                preConfirm: () => {
                    const selected = document.querySelector('input[name="booking-date"]:checked') as HTMLInputElement
                    if (!selected) Swal.showValidationMessage('กรุณาเลือกวันที่')
                    return selected.value
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    setSelectedDate(result.value)
                } else if (result.isDismissed) {
                    onClose()
                }
            })
        }
    }, [roomId])

    useEffect(() => {
        const processTimeSelection = async () => {
            if (!selectedDate || !roomId) return
            Swal.fire({
                title: 'กำลังตรวจสอบตารางห้อง...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading()
            })

            try {
                const res = await getUnavailableTime(roomId, selectedDate)
                const unavailableSlots = res.success ? res.data : []

                const timeSlots = []
                for (let i = 8; i < 18; i++) {
                    const isOccupied = unavailableSlots?.some((slot: { start_time: number, end_time: number }) =>
                        i >= slot.start_time && i < slot.end_time
                    )
                    timeSlots.push({ time: i, occupied: isOccupied })
                }
                await Swal.fire({
                    title: `<span class="text-lg font-bold text-slate-700">เลือกเวลา (${selectedDate})</span>`,
                    html: `
                        <div class="text-left mb-2 text-xs text-slate-500">
                            *เลือกได้สูงสุด 3 ชั่วโมง (ไม่จำเป็นต้องต่อเนื่องกัน)
                        </div>
                        <div class="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto p-1">
                            ${timeSlots.map(slot => `
                                <div class="relative"> 
                                    <input type="checkbox" id="time-${slot.time}" name="time-slot" value="${slot.time}" 
                                        class="peer hidden" ${slot.occupied ? 'disabled' : ''}>
                                    
                                    <label for="time-${slot.time}" 
                                        class="
                                            flex flex-col items-center justify-center p-3 rounded-lg border text-sm font-medium transition-all w-full h-full
                                            ${slot.occupied
                            ? 'bg-slate-100 text-slate-400 border-slate-100 cursor-not-allowed decoration-slate-400 line-through'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-400 cursor-pointer peer-checked:bg-emerald-500 peer-checked:text-white peer-checked:border-emerald-500 peer-checked:shadow-md'
                        }
                                        ">
                                        ${slot.time}:00 - ${slot.time + 1}:00
                                    </label>
                                </div>
                            `).join('')}
                        </div>
                    `,
                    showCancelButton: true,
                    confirmButtonText: 'ยืนยันการจอง',
                    cancelButtonText: 'ย้อนกลับ',
                    confirmButtonColor: '#10b981',
                    cancelButtonColor: '#94a3b8',
                    reverseButtons: true,
                    focusConfirm: false,
                    allowOutsideClick: false,
                    preConfirm: () => {
                        const checkboxes = document.querySelectorAll('input[name="time-slot"]:checked')
                        const selectedValues = Array.from(checkboxes).map((cb: any) => parseInt(cb.value))

                        if (selectedValues.length === 0) {
                            Swal.showValidationMessage('กรุณาเลือกเวลาอย่างน้อย 1 ชั่วโมง')
                            return false
                        }
                        if (selectedValues.length > 3) {
                            Swal.showValidationMessage('จองได้สูงสุด 3 ชั่วโมงต่อวัน')
                            return false
                        }
                        return selectedValues
                    }
                }).then(async (result) => {
                    if (result.isConfirmed) {
                        Swal.fire({
                            title: 'กำลังบันทึกข้อมูล...',
                            allowOutsideClick: false,
                            didOpen: () => Swal.showLoading()
                        })

                        const selectedHours = result.value // [9, 13, 14]

                        // 2.5 เรียก API จองห้อง (Booking Action)
                        const res = await createBooking(roomId, selectedDate, selectedHours)

                        if (res.success) {
                            await Swal.fire({
                                icon: 'success',
                                title: 'จองสำเร็จ!',
                                text: `คุณจองห้อง ${roomName} เวลา ${selectedHours.map((h: number) => `${h}:00`).join(', ')}`,
                                confirmButtonColor: '#10b981'
                            })
                        } else {
                            await Swal.fire({
                                icon: 'error',
                                title: "เกิดข้อผิดพลาด",
                                text: res.message,
                                confirmButtonColor: '#e64e4e'
                            })
                        }

                        onClose()
                    } else if (result.isDismissed) {

                        onClose()
                    }
                })

            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: (err as Error).message,
                }).then(() => onClose())
            }
        }

        processTimeSelection()
    }, [selectedDate])

    return null
}