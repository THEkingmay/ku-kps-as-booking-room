'use client'
import { signOut } from "next-auth/react"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Navbar สำหรับ Admin */}
      <nav className="bg-white border-b border-emerald-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">A</div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">Admin Dashboard</span>
        </div>
        <button onClick={()=>signOut()} className="text-sm text-slate-400 hover:text-red-600 font-medium transition-colors">
          ออกจากระบบ
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-6 md:p-10">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">ภาพรวมระบบ</h1>
            <p className="text-slate-500 text-sm mt-1">จัดการการจองและตรวจสอบสถานะห้อง Co-Working Space</p>
          </div>
          <button className="hidden md:block px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-all shadow-sm">
            ดาวน์โหลดรายงาน (.CSV)
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { title: 'การจองวันนี้', color: 'text-emerald-600', bg: 'bg-emerald-50' },
            { title: 'ห้องที่เปิดใช้งาน', color: 'text-blue-600', bg: 'bg-blue-50' },
            { title: 'นิสิตในระบบ', color: 'text-amber-600', bg: 'bg-amber-50' },
          ].map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold">{stat.title}</p>
                <p className={`text-3xl font-black mt-1 ${stat.color}`}>0</p>
              </div>
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center ${stat.color}`}>
                {/* Placeholder Icon */}
                <div className="w-6 h-6 border-2 border-current rounded-md opacity-40" />
              </div>
            </div>
          ))}
        </div>

        {/* Bookings Table Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-50 flex justify-between items-center bg-white">
            <div>
              <h2 className="font-bold text-slate-800">รายการจองล่าสุด</h2>
              <p className="text-xs text-slate-400">แสดงข้อมูลการเข้าใช้งานแบบ Real-time</p>
            </div>
            <div className="flex gap-2">
               <input 
                type="text" 
                placeholder="ค้นหาชื่อนิสิต..." 
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
               />
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">ข้อมูลผู้จอง</th>
                  <th className="px-6 py-4">พื้นที่ / ห้อง</th>
                  <th className="px-6 py-4">ช่วงเวลา</th>
                  <th className="px-6 py-4">สถานะ</th>
                  <th className="px-6 py-4 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {/* Render ข้อมูลตรงนี้:
                   bookings.length === 0 ? (
                     <tr><td colSpan={5} className="..." >ไม่พบข้อมูลการจอง</td></tr>
                   ) : (
                     bookings.map(...)
                   )
                */}
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center opacity-20">
                      <div className="w-12 h-12 border-4 border-slate-300 border-t-emerald-500 rounded-full animate-spin mb-4" />
                      <p className="text-slate-500 font-medium">กำลังโหลดข้อมูลจากฐานข้อมูล...</p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 bg-slate-50/30 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
            <span>แสดง 0 จาก 0 รายการ</span>
            <div className="flex gap-1">
              <button className="px-2 py-1 border border-slate-200 rounded bg-white disabled:opacity-50" disabled>Previous</button>
              <button className="px-2 py-1 border border-slate-200 rounded bg-white disabled:opacity-50" disabled>Next</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}