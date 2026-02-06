'use client'
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";

export default function UserPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/"); // ถ้าไม่ได้ล็อกอิน ให้กลับไปหน้าแรก
    },
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* Navigation Bar เล็กๆ */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-14 flex justify-between items-center">
          <span className="font-bold text-emerald-800">FLAS Co-Space</span>
          <button 
            onClick={() => signOut()}
            className=" font-medium text-slate-400 hover:text-red-500 transition-colors"
          >
            ออกจากระบบ
          </button>
        </div>
      </nav>

      {/* Header ทักทาย */}
      <header className="max-w-4xl mx-auto pt-12 px-4 mb-10">
        <div className="flex items-center gap-4">
          {session?.user?.image && (
            <img 
              src={session.user.image} 
              alt="Profile" 
              className="w-16 h-16 rounded-2xl border-2 border-emerald-100 shadow-sm"
            />
          )}
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              สวัสดี, {session?.user?.name?.split(' ')[0]} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">{session?.user?.email}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 grid gap-8">
        
        {/* Quick Actions */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button className="flex flex-col items-center justify-center p-8 bg-emerald-50/50 rounded-2xl border-2 border-dashed border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 transition-all group">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm text-emerald-600 group-hover:scale-110 transition-transform">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </div>
                <span className="font-bold text-emerald-900">จองห้องใหม่</span>
                <p className="text-xs text-emerald-600/70 mt-1">เลือกเวลาและห้องที่ต้องการ</p>
            </button>

            <button className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all group">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm text-slate-400 group-hover:text-emerald-600 transition-colors">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <span className="font-bold text-slate-700">ประวัติการจอง</span>
                <p className="text-xs text-slate-400 mt-1">ตรวจสอบรายการย้อนหลัง</p>
            </button>
        </section>

        {/* Status Card (ตัวอย่างเพิ่มเติม) */}
        <section className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            การจองปัจจุบัน
          </h2>
          <div className="py-8 text-center border-2 border-dotted border-slate-100 rounded-xl">
            <p className="text-slate-400 text-sm">ยังไม่มีรายการจองในวันนี้</p>
          </div>
        </section>

      </main>

      <footer className="max-w-4xl mx-auto px-4 py-10 mt-10 border-t border-slate-50 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-slate-300 font-semibold">
          FLAS Co-Working Space Management
        </p>
      </footer>
    </div>
  )
}