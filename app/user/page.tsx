'use client'

import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";


import AllRoomDisplay from "./pages/all-room-display";
import ReservationTable from "./pages/reservation-table";
import ReservationHistory from "./pages/reservation-history";

export default function UserPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/");
    },
  });


  const [activeTab, setActiveTab] = useState<'rooms' | 'table' | 'history'>('rooms');

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'rooms': return <AllRoomDisplay />;
      case 'table': return <ReservationTable />;
      case 'history': return <ReservationHistory />;
      default: return <AllRoomDisplay />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">


      <nav className="border-b border-slate-200 bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {session?.user?.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                {session?.user?.name?.[0]}
              </div>
            )}
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                สวัสดี, {session?.user?.name?.split(' ')[0]}
              </h1>
              <p className="text-slate-500 text-xs">นิสิต / ผู้ใช้งานทั่วไป</p>
            </div>
          </div>
          <button
            onClick={() => signOut()}
            className="text-sm font-medium text-slate-400 hover:text-red-500 transition-colors px-3 py-1 rounded-md hover:bg-red-50"
          >
            ออกจากระบบ
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">

        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-100 inline-flex">
            <button
              onClick={() => setActiveTab('rooms')} 
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
              ${activeTab === 'rooms'
                   ? 'bg-emerald-600 text-white shadow-lg scale-105'
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 hover:shadow-sm'
                }`}
            >
              ห้องทั้งหมด
            </button>

            <button
              onClick={() => setActiveTab('table')}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                ${activeTab === 'table'
                  ? 'bg-emerald-600 text-white shadow-lg scale-105'
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 hover:shadow-sm'
                }`}
            >
              ตารางการจอง
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer
                ${activeTab === 'history'
                   ? 'bg-emerald-600 text-white shadow-lg scale-105'
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 hover:shadow-sm'
                }`}
            >
              การจองของฉัน
            </button>

          </div>
        </div>
        <div className="transition-opacity duration-300 min-h-[400px]">
          {renderContent()}
        </div>

      </main>
    </div>
  )
}