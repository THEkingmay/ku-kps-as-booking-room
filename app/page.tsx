'use client'
import { signIn } from "next-auth/react";
import { ReactNode } from "react";

const FeatureIcon = ({ children }: { children: ReactNode }) => (
  <div className="h-12 w-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
    {children}
  </div>
);

export default function Home() {
  return (
    <main className="min-h-screen bg-white selection:bg-emerald-100 text-slate-800 font-sans">
      
      {/* Navigation */}
      <header className="border-b border-emerald-50 bg-white/80 backdrop-blur-md fixed w-full z-50 top-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex flex-col leading-tight">
            <span className="font-bold text-xl tracking-tight text-emerald-900">FLAS Co-Space</span>
            <span className="text-[0.65rem] text-emerald-600 uppercase tracking-wider font-semibold">Faculty of Liberal Arts and Science</span>
          </div>
          
          <nav>
            <button 
              onClick={() => signIn('google')}
              className="inline-flex items-center px-5 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-full hover:bg-emerald-700 transition-all shadow-sm hover:shadow-md md:text-base"
            >
              เข้าสู่ระบบนิสิต
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-28 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        <span className="inline-block mb-4 px-3 py-1 text-sm font-medium text-emerald-700 bg-emerald-50 rounded-full border border-emerald-100">
          KU Student Only • @ku.th
        </span>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          พื้นที่เรียนรู้และทำงาน <br className="hidden md:block" />
          ในแบบที่ <span className="text-emerald-600 relative whitespace-nowrap">
             ธรรมชาติ
            <svg className="absolute bottom-1 left-0 w-full h-3 text-emerald-200 -z-10" viewBox="0 0 100 12" preserveAspectRatio="none">
              <path d="M0,10 C20,15 80,15 100,10 L100,12 L0,12 Z" fill="currentColor"/>
            </svg>
          </span> และเรียบง่าย
        </h1>
        
        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          ระบบจองห้อง Co-Working Space คณะศิลปศาสตร์และวิทยาศาสตร์ 
          สะดวก รวดเร็ว <span className="font-semibold text-emerald-700 underline decoration-emerald-200">ล็อกอินผ่าน @ku.th เท่านั้น</span>
        </p>

        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => signIn('google')}
            className="px-8 py-3.5 text-base font-semibold text-white bg-emerald-800 rounded-full hover:bg-emerald-900 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          >
            👉 เริ่มต้นจองห้องทำงาน
          </button>
          <button className="px-8 py-3.5 text-base font-semibold text-emerald-700 bg-white border border-emerald-200 rounded-full hover:bg-emerald-50 transition-all">
            ตรวจสอบตารางว่าง
          </button>
        </div>
      </section>

      {/* Visual Placeholder */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-emerald-50/50 border border-emerald-100">
           <div className="absolute inset-0 bg-gradient-to-tr from-emerald-50/50 via-white to-white flex flex-col items-center justify-center p-6 text-center">
             <div className="w-24 h-24 mb-6 text-emerald-200">
               <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.5">
                 <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12a2.25 2.25 0 012.25 2.25V21h-21V5.25A2.25 2.25 0 013 3z" />
               </svg>
             </div>
             <p className="text-emerald-800 font-bold uppercase tracking-[0.2em] text-sm">Minimalist & Green Space</p>
             <p className="text-emerald-500/70 text-sm mt-3 font-light italic">"บรรยากาศที่ส่งเสริมการเรียนรู้ สำหรับนิสิต ศวท. ทุกคน"</p>
           </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-emerald-50/30 border-t border-emerald-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            
            <div>
              <FeatureIcon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.745 3.745 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.745 3.745 0 013.296-1.043A3.745 3.745 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.745 3.745 0 013.296 1.043 3.745 3.745 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
              </FeatureIcon>
              <h3 className="text-lg font-bold text-slate-900">KU Single Sign-On</h3>
              <p className="mt-2 text-slate-600 leading-relaxed text-sm">
                ปลอดภัยและง่ายดาย เข้าระบบด้วย @ku.th ผ่าน Google ได้ทันที มั่นใจได้ว่าพื้นที่นี้จัดไว้เพื่อนิสิตเกษตรเท่านั้น
              </p>
            </div>

            <div>
              <FeatureIcon>
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" /></svg>
              </FeatureIcon>
              <h3 className="text-lg font-bold text-slate-900">Quiet & Focused</h3>
              <p className="mt-2 text-slate-600 leading-relaxed text-sm">
                เราจัดสรรโซนการทำงานที่เงียบสงบ เหมาะทั้งการอ่านหนังสือสอบคนเดียว หรือการระดมสมองทำโปรเจกต์กลุ่ม
              </p>
            </div>

            <div>
              <FeatureIcon>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
              </FeatureIcon>
              <h3 className="text-lg font-bold text-slate-900">Full Amenities</h3>
              <p className="mt-2 text-slate-600 leading-relaxed text-sm">
                บริการ Wi-Fi ความเร็วสูงจากมหาลัย พร้อมปลั๊กไฟและอุปกรณ์อำนวยความสะดวกที่ช่วยให้การทำงานราบรื่น
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 text-center bg-white">
        <div className="max-w-6xl mx-auto px-4 border-t border-slate-100 pt-8">
           <p className="text-slate-400 text-xs font-medium uppercase tracking-widest mb-2">Developed for Educational Purposes</p>
           <p className="text-slate-500 text-sm">
             © {new Date().getFullYear()} คณะศิลปศาสตร์และวิทยาศาสตร์ <br className="sm:hidden" /> 
             มหาวิทยาลัยเกษตรศาสตร์ วิทยาเขตกำแพงแสน
           </p>
        </div>
      </footer>

    </main>
  )
}