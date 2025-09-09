'use client'

import React from 'react'
import { AppShell, Stack, Button } from '@mantine/core'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { useRouter } from 'next/navigation'
import { useUserProfile } from './contexts/UserProfileContext'

type NavBarProps = {
  toggle: () => void
}

const NavBar = ({ toggle }: NavBarProps) => {
  const router = useRouter()
  const { profile } = useUserProfile()

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

          <Button 
          onClick={() => { 
            router.push('/profile')
            toggle()
          } 
          } variant='outline'>
            Profile
          </Button>

          <Button 
          disabled={profile?.role === 'admin' || profile?.role === 'dropzone'}
          onClick={() => { 
            router.push('/') 
            toggle()
          } } variant='outline'
            >Home
          </Button>

          <Button 
          disabled={profile?.role === 'admin' || profile?.role === 'dropzone'}
          onClick={() => { 
            router.push('/equipment')
            toggle()
            } } variant='outline'>
            Equipment
          </Button>

          <Button 
          onClick={handleLogout} variant='outline'>
            Log out
          </Button>

          <Button 
          disabled={profile?.role === 'admin' || profile?.role === 'dropzone'}
          onClick={() => { 
            router.push('/') 
            toggle()
          }} variant='outline'>
            Help / FAQ
          </Button>

          {
            profile?.role === 'admin' &&
            <>
              <Button onClick={() => { router.push('/admin/dropzones'); toggle(); }} color='teal'>
                Dropzones (Admin)
              </Button>
              <Button onClick={() => { router.push('/admin/students'); toggle(); }} color='teal'>
                Students (Admin)
              </Button>
              <Button onClick={() => { router.push('/admin/instructors'); toggle(); }} color='teal'>
                Instructors (Admin)
              </Button>
            </>
          }

        </Stack>
    </AppShell.Navbar>
  )
}

export default NavBar