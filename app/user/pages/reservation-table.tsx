'use client'

import { useEffect, useState } from "react"
import { getRoomScheduleByDate } from "../actions/room"
import Swal from "sweetalert2"

interface Reservation {
    start_time: number
    end_time: number
    status: 'reserved' | 'occupied' | 'done'
}

interface RoomSchedule {
    name: string
    reservations: Reservation[]
}

const HOURS = Array.from({ length: 14 }, (_, i) => i + 8)

export default function ReservationTable() {
    const [data, setData] = useState<RoomSchedule[]>([])
    const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0])
    const [loading, setLoading] = useState<boolean>(false)

    const fetchData = async (dateStr: string) => {
        setLoading(true)
        try {
            const dateObj = new Date(dateStr)
            const res = await getRoomScheduleByDate(dateObj)

            if (!res.success) throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูล")

            setData(res.data as unknown as RoomSchedule[])
        } catch (err) {
            Swal.fire({
                title: "เกิดข้อผิดพลาด",
                text: (err as Error).message,
                icon: "error"
            })
            setData([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData(selectedDate)
    }, [selectedDate])

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'reserved': return 'bg-red-500'
            case 'occupied': return 'bg-blue-500'
            case 'done': return 'bg-green-500'
            default: return 'bg-slate-100'
        }
    }

    const getSlotStatus = (reservations: Reservation[], currentHour: number) => {
        const found = reservations.find(r => currentHour >= r.start_time && currentHour < r.end_time)
        return found ? found.status : null
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-bold text-slate-800">ตารางการจอง</h2>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-slate-600">เลือกวันที่:</label>
                    <input 
                        type="date" 
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border border-slate-300 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                </div>
            </div>

            <div className="flex gap-4 mb-4 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span>จองแล้ว</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span>กำลังใช้งาน</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span>ใช้งานแล้ว</span>
                </div>
            </div>

            <div className="overflow-x-auto pb-2">
                <table className="w-full min-w-[800px] border-collapse">
                    <thead>
                        <tr>
                            <th className="text-left p-3 text-slate-600 bg-slate-50 border-b min-w-[150px] sticky left-0 z-10">
                                ห้อง / เวลา
                            </th>
                            {HOURS.map(hour => (
                                <th key={hour} className="p-3 text-center text-slate-600 bg-slate-50 border-b text-sm font-medium">
                                    {hour.toString().padStart(2, '0')}:00
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={HOURS.length + 1} className="p-8 text-center text-slate-400">
                                    กำลังโหลดข้อมูล...
                                </td>
                            </tr>
                        ) : data.length === 0 ? (
                            <tr>
                                <td colSpan={HOURS.length + 1} className="p-8 text-center text-slate-400">
                                    ไม่มีข้อมูลห้อง
                                </td>
                            </tr>
                        ) : (
                            data.map((room, idx) => (
                                <tr key={idx} className="border-b last:border-0 hover:bg-slate-50">
                                    <td className="p-3 font-medium text-slate-700 sticky left-0 bg-white border-r z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                                        {room.name}
                                    </td>
                                    {HOURS.map(hour => {
                                        const status = getSlotStatus(room.reservations || [], hour)
                                        return (
                                            <td key={hour} className="p-1 h-12 border-r last:border-r-0">
                                                <div className={`w-full h-full rounded-md transition-colors ${status ? getStatusColor(status) : 'bg-slate-50'}`}></div>
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}