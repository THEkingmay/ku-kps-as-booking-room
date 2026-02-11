'use client'
import { signIn } from "next-auth/react";
import { ReactNode } from "react";

const FeatureIcon = ({ children }: { children: ReactNode }) => (
  <div className="h-12 w-12 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 border border-emerald-100">
    {children}
  </div>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-800 font-sans selection:bg-emerald-100">
      
      {/* Navigation */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm fixed w-full z-50 top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-emerald-700 rounded-md flex items-center justify-center text-white font-bold text-xs">
              FLAS
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-semibold text-lg text-slate-900 tracking-tight">Co-Space Booking</span>
              <span className="text-[0.7rem] text-slate-500 font-medium">Faculty of Liberal Arts and Science</span>
            </div>
          </div>
          
          <nav>
            <button 
              onClick={() => signIn('google')}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 transition-colors focus:ring-4 focus:ring-emerald-100"
            >
              เข้าสู่ระบบด้วย KU Google
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen pt-32 pb-20 md:pt-40 md:pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Badge แจ้งสถานะหรือกลุ่มผู้ใช้ */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 text-xs font-semibold text-emerald-800 bg-emerald-50 rounded-full border border-emerald-100">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          สำหรับนิสิตและบุคลากร มก.
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
          ระบบจองห้องประชุมและพื้นที่ทำงานร่วม <br />
          <span className="text-emerald-700">คณะศิลปศาสตร์และวิทยาศาสตร์</span>
        </h1>
        
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          อำนวยความสะดวกในการจองห้อง Co-Working Space ออนไลน์ <br className="hidden sm:block"/>
          ตรวจสอบสถานะห้องว่างแบบ Real-time รองรับการใช้งานผ่านบัญชีมหาวิทยาลัย (@ku.th)
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
             onClick={() => signIn('google')}
             className="w-full sm:w-auto px-8 py-3 text-base font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 shadow-sm transition-all hover:translate-y-[-1px]"
          >
            จองห้องทันที
          </button>
          <a href="#features" className="text-sm font-medium text-slate-500 hover:text-emerald-700 transition-colors">
            ดูรายละเอียดเพิ่มเติม ↓
          </a>
        </div>

      </section>

      {/* Features / Information */}
      <section id="features" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <FeatureIcon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
              </FeatureIcon>
              <h3 className="text-lg font-bold text-slate-900">KU Authentication</h3>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                เข้าใช้งานด้วยบัญชี Google ของมหาวิทยาลัย (@ku.th) เพื่อยืนยันตัวตน และความปลอดภัยในการใช้งานพื้นที่
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <FeatureIcon>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
              </FeatureIcon>
              <h3 className="text-lg font-bold text-slate-900">Real-time Reservation</h3>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                ระบบจัดการตารางเวลาที่แม่นยำ สามารถเลือกช่วงเวลาที่ต้องการและยืนยันการจองได้ทันที ลดปัญหาการจองซ้อน
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <FeatureIcon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" /></svg>
              </FeatureIcon>
              <h3 className="text-lg font-bold text-slate-900">Facilities</h3>
              <p className="mt-2 text-slate-600 text-sm leading-relaxed">
                พร้อมด้วยสิ่งอำนวยความสะดวกครบครัน ทั้ง Wi-Fi ความเร็วสูง ปลั๊กไฟ และกระดานไวท์บอร์ด รองรับทั้งการทำงานเดี่ยวและกลุ่ม
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
           <p>© {new Date().getFullYear()} Faculty of Liberal Arts and Science, KU KPS.</p>
           <p className="mt-2 md:mt-0">Developed by CS Student</p>
        </div>
      </footer>

    </main>
  )
}