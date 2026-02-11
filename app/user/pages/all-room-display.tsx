'use client'

import { useEffect, useReducer, useState } from "react"
import { getRooms } from "../actions/room"
import type { Room } from "@/type/types"
import Swal from "sweetalert2"

import RoomCard from "../components/RoomCard"
import ReservationModal from "../components/ReservationModal"

interface StateType {
    isLoading: boolean;
    isError: boolean;
    data: Room[];
}

type ActionType =
    | { type: 'FETCH_START' }
    | { type: 'FETCH_SUCCESS', payload: Room[] }
    | { type: 'FETCH_ERROR' };

const INITIAL_STATE: StateType = {
    isLoading: false,
    isError: false,
    data: []
}

const roomsReducer = (state: StateType, action: ActionType): StateType => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, isLoading: true, isError: false };
        case 'FETCH_SUCCESS':
            return { isLoading: false, isError: false, data: action.payload };
        case 'FETCH_ERROR':
            return { ...state, isLoading: false, isError: true };
        default:
            return state;
    }
}

export default function AllRoomDisplay() {

    const [state, dispatch] = useReducer(roomsReducer, INITIAL_STATE);
    const [selectRoom , setSelectRoom ] = useState<{id : string , name :string} | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            dispatch({ type: 'FETCH_START' });
            try {
                const res = await getRooms();
                if (res.success) {
                    dispatch({ type: 'FETCH_SUCCESS', payload: res.rooms });
                } else {
                    throw new Error("API Error");
                }
            } catch (error) {
                dispatch({ type: 'FETCH_ERROR' });
                Swal.fire({
                    icon: 'error',
                    title: 'เกิดข้อผิดพลาด',
                    text: 'ไม่สามารถโหลดข้อมูลห้องได้ กรุณาลองใหม่ภายหลัง',
                });
            }
        };
        fetchData();
    }, []);

    return (
        <div >
            <div className="min-h-[260px]">
                {state.isLoading ? (
                    <div className="flex flex-col items-center justify-center h-72 text-slate-400 animate-pulse gap-2">
                        <div className="w-10 h-10 rounded-full bg-slate-200" />
                        <p className="text-lg">กำลังโหลดข้อมูล...</p>
                    </div>
                ) : state.isError ? (
                    <div className="flex items-center justify-center h-72 text-red-500 text-lg font-medium">
                        เกิดข้อผิดพลาดในการโหลดข้อมูล
                    </div>
                ) : state.data.length === 0 ? (
                    <div className="flex items-center justify-center h-72 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl text-lg">
                        ไม่พบข้อมูลห้องพัก
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                        {state.data.map((room) => (
                            <div
                                key={room.id}
                                onClick={() => setSelectRoom({ name: room.name, id: room.id })}
                                className="cursor-pointer transform transition duration-200 hover:scale-[1.03] active:scale-95"
                            >
                                <RoomCard room={room} />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ReservationModal
                roomName={selectRoom?.name}
                roomId={selectRoom?.id}
                onClose={() => setSelectRoom(null)}
            />
        </div>
    )
}
