'use client'

import ProtectedRoute from '@/components/redirects/ProtectedRoute'
import React from 'react'
import { Button, Stack } from '@mantine/core'
import { useRouter } from 'next/navigation'

const AdminPage = () => {
    const router = useRouter()

  return (
    <ProtectedRoute allowedRoles={['admin']} redirectTo='/login'>
        <>
            <Stack>
                <Button onClick={() => router.push('/admin/dropzones')} color='teal'>
                    Dropzones (Admin)
                </Button>
                <Button onClick={() => router.push('/admin/students')} color='teal'>
                    Students (Admin)
                </Button>
                <Button onClick={() => router.push('/admin/instructors')} color='teal'>
                    Instructors (Admin)
                </Button>
            </Stack>
        </>
    </ProtectedRoute>
  )
}

export default AdminPage