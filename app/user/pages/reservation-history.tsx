'use client'

export default function ReservationHistory() {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
             <h2 className="text-xl font-bold text-slate-800 mb-4">ประวัติการจองของฉัน</h2>
             <div className="space-y-4">
                {/* ตัวอย่าง List Item แบบ Mockup */}
                {[1, 2].map((item) => (
                    <div key={item} className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                        <div>
                            <p className="font-semibold text-slate-700">Room A - Meeting Room</p>
                            <p className="text-xs text-slate-500">12 Feb 2026 • 09:00 - 12:00</p>
                        </div>
                        <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded border border-slate-100">Completed</span>
                    </div>
                ))}
             </div>
        </div>
    )
}