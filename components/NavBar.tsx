'use client'

import React from 'react'
import { AppShell, Stack, Button } from '@mantine/core'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { useRouter } from 'next/navigation'

type NavBarProps = {
  toggle: () => void
}

const NavBar = ({ toggle }: NavBarProps) => {
  const router = useRouter()

  const handleLogout = async () => {
      try {
          await signOut(auth)
          router.push('/login')
          toggle()
      } catch (error) {
          console.error(error)
      }
    }

  return (
    <AppShell.Navbar p='md' >
        <Stack>

          <Button onClick={() => { 
            router.push('/profile')
            toggle()
          } 
          } variant='outline'>
            Profile
          </Button>

          <Button onClick={() => { 
            router.push('/') 
            toggle()
          } } variant='outline'
            >Home
          </Button>

          <Button onClick={() => { 
            router.push('/equipment')
            toggle()
            } } variant='outline'>
            Equipment
          </Button>

          <Button onClick={() => { handleLogout }} variant='outline'>
            Log out
          </Button>

          <Button onClick={() => { 
            router.push('/') 
            toggle()
          }} variant='outline'>
            Help / FAQ
          </Button>

        </Stack>
    </AppShell.Navbar>
  )
}

export default NavBar