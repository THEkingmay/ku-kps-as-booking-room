'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

// สร้าง Component ย่อยเพื่อดึง SearchParams (ป้องกัน Error ใน Next.js App Router)
function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  let errorMessage = "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ"
  let errorSubtext = "กรุณาลองใหม่อีกครั้ง"

  // แปลง Error Code ของ NextAuth เป็นข้อความภาษาไทย
  if (error === 'AccessDenied') {
    errorMessage = "เข้าสู่ระบบไม่สำเร็จ"
    errorSubtext = "กรุณาใช้อีเมล @ku.th เท่านั้นในการใช้งาน"
  } else if (error === 'Configuration') {
    errorMessage = "ตั้งค่าระบบไม่ถูกต้อง"
    errorSubtext = "กรุณาติดต่อผู้ดูแลระบบ"
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl text-center max-w-md w-full border border-slate-100">
      <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">{errorMessage}</h2>
      <p className="text-slate-500 mb-8">{errorSubtext}</p>
      
      <Link 
        href="/" 
        className="block w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
      >
        กลับไปหน้าแรก
      </Link>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <ErrorContent />
      </Suspense>
    </div>
  )
}