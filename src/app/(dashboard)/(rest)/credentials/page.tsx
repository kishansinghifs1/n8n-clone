import { requireAuth } from '@/lib/auth-utils'
import React from 'react'

const Page = async() => {
  await requireAuth();
  return (
    <div>
      Credentials Details Page 
    </div>
  )
}

export default Page
