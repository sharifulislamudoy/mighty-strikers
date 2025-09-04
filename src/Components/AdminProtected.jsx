'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function AdminProtected({ children }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session) {
      router.push('/auth-form')
      return
    }

    if (session?.user?.role !== 'admin') {
      router.push('/unauthorized')
      return
    }

    setLoading(false)
  }, [session, status, router])

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-[#0A0A0A]">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <motion.div
              className="h-12 w-12 bg-[#D4AF37] rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [1, 0.5, 1]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
          <p className="text-gray-300 font-medium">Checking permissions...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we verify your access</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}