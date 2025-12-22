import React, { useEffect } from 'react'
import { createAuthClient } from 'better-auth/react'
import { useNavigate } from 'react-router-dom'
const {useSession} = createAuthClient()


function Protected({children}:{ children: React.ReactNode }) {
    const {data: session, isPending } = useSession()
    const navigate = useNavigate()

    useEffect(()=>{
        if (!isPending && !session){
            navigate('/sign-in', {replace:true})
        }
    }, [isPending, session, navigate])

    if (isPending){
        return <div>Loading...</div>
    }

    if (!session){
        return null
    }

    return (
    <>{children}</>
  )
}

export default Protected