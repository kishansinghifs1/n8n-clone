import { Button } from '@/components/ui/button'
import prisma from '@/lib/db'
import React from 'react'

const page = async() => {
  const users = await prisma.user.findMany();
  return (
    <div className='flex justify-center items-center h-screen'>
      <Button>Users are {JSON.stringify(users)} </Button>
    </div>
  )
}
  
export default page
