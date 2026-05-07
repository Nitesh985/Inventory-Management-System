import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '@/lib/auth-client'

// Protected components should be guarded by session.user.isVerified

function Protected({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession()
  const navigate = useNavigate()

  useEffect(()=>{
    if (isPending) return

    if (!session) navigate("/sign-in", {replace:true})

  }, [session, isPending, navigate])


  if (isPending) return <div>Loading...</div>
  return <>{children}</>
}


export default Protected