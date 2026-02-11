'use client'
import { getReservationsHistoryByDate, cancelReservation } from "../actions/history"
import { useReducer, useState, useEffect } from "react"
import Swal from "sweetalert2"
import { Clock, Trash2, X } from "lucide-react"

interface ReservationHistory {
    id: string,
    rooms: { name: string },
    date: Date,
    start_time: number,
    end_time: number,
    status: 'reserved' | 'occupied' | 'done' | 'cancelled' | 'rejected';
}

interface INIT_TYPE {
    isLoading: boolean
    isError: boolean
    data: ReservationHistory[]
}

type ACTION_TYPE =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS'; payload: ReservationHistory[] }
    | { type: 'FETCH_ERROR' }

const reservationReducer = (state: INIT_TYPE, action: ACTION_TYPE): INIT_TYPE => {
    switch (action.type) {
        case 'FETCH_START': return { ...state, isLoading: true, isError: false }
        case 'FETCH_SUCCESS': return { ...state, isLoading: false, data: action.payload }
        case 'FETCH_ERROR': return { ...state, isLoading: false, isError: true }
        default: return state
    }
}

const formatTime = (time: number) => `${time.toString().padStart(2, '0')}:00`

const getStatusLabel = (status: string) => {
    switch (status) {
        case 'reserved': return 'จองแล้ว'
        case 'occupied': return 'ใช้งาน'
        case 'done': return 'เสร็จ'
        case 'cancelled': return 'ยกเลิก'
        case 'rejected': return 'ปฏิเสธ'
        default: return status
    }
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'reserved': return 'text-emerald-600'
        case 'occupied': return 'text-green-600'
        case 'done': return 'text-slate-400'
        case 'cancelled': return 'text-red-500'
        case 'rejected': return 'text-orange-500'
        default: return 'text-gray-500'
    }
}

export default function ReservationHistory() {
    const [selectDate, setSelDate] = useState<Date>(new Date())
    const [state, dispatch] = useReducer(reservationReducer, {
        isLoading: false,
        isError: false,
        data: []
    })

    const fetchData = async () => {
        dispatch({ type: 'FETCH_START' })
        try {
            const { data } = await getReservationsHistoryByDate(selectDate.toDateString())
            if (data) dispatch({ type: 'FETCH_SUCCESS', payload: data as unknown as ReservationHistory[] })
        } catch {
            dispatch({ type: 'FETCH_ERROR' })
        }
    }

    useEffect(() => { fetchData() }, [selectDate])

    const handleCancelReservation = async (id: string) => {
        const result = await Swal.fire({
            title: 'ยกเลิกการจอง?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#16a34a',
            cancelButtonColor: '#94a3b8',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ปิด'
        })

        if (result.isConfirmed) {
            try {
                Swal.fire({
                    title: 'กำลังยกเลิกการจอง...',
                    allowOutsideClick: false,
                    didOpen: () => Swal.showLoading()
                })
                const res = await cancelReservation(id)
                if (!res.success) throw new Error(res.message)

                await fetchData()
                Swal.fire({ title: 'สำเร็จ', text: res.message, icon: 'success', timer: 1000, showConfirmButton: false })
            } catch (err) {
                Swal.fire({ title: 'ผิดพลาด', text: (err as Error).message, icon: 'error' })
            }
        }
    }

    const calHourLeft = () => {
        let total = 0
        state.data.forEach(data => data.status !== 'rejected' && data.status !== 'cancelled' ? total += (data.end_time - data.start_time) : total += 0)
        return 3 - total
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">ประวัติการจอง</h1>
                    <h2>จองได้อีก {calHourLeft()} ชั่วโมง</h2>
                </div>
                <input
                    type="date"
                    value={selectDate.toISOString().split('T')[0]}
                    onChange={(e) => setSelDate(new Date(e.target.value))}
                    className="px-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                />
            </div>

            {state.isLoading && (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl animate-pulse" />)}
                </div>
            )}

            {state.isError && (
                <div className="text-center py-12 text-base text-red-500">โหลดข้อมูลไม่สำเร็จ</div>
            )}

            {!state.isLoading && !state.isError && (
                <div className="space-y-4">
                    {state.data.length === 0 && (
                        <div className="text-center py-16 text-lg text-slate-400">ไม่มีรายการจอง</div>
                    )}

                    {state.data.map(item => (
                        <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-emerald-400 transition shadow-sm">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-lg text-slate-800 truncate">{item.rooms.name}</h3>
                                        <span className={`text-sm font-medium ${getStatusColor(item.status)}`}>
                                            {getStatusLabel(item.status)}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Clock className="w-5 h-5" />
                                        {formatTime(item.start_time)} - {formatTime(item.end_time)}
                                    </div>
                                </div>

                                {item.status === 'reserved' && (
                                    <button
                                        onClick={() => handleCancelReservation(item.id)}
                                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                        title="ยกเลิก"
                                    >
                                        <Trash2 className="w-6 h-6" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
