'use client'

import React, { useContext, useState } from 'react'
import { Modal, Stack, Text, SegmentedControl, Button } from '@mantine/core'
import { UserProfile } from './contexts/UserProfileContext'
import { updateUser } from '@/utils/actions/CRUD'
import { AuthContext } from './contexts/AuthProvider'

type PermissionsModalProps = {
    opened: boolean
    onClose: () => void
    userToUpdate: UserProfile
}

const PermissionsModal = ({ userToUpdate, opened, onClose }: PermissionsModalProps) => {
    const [role, setRole] = useState<'admin' | 'student' | 'instructor' | 'dropzone'>(userToUpdate.role)
    const [loading, setLoading] = useState(false)

    const handleSave = async () => {
        setLoading(true)
        if (!userToUpdate.id || !role) return
        await updateUser(userToUpdate.id, role)
        setLoading(false)
        onClose()
    }

  return (
    <Modal opened={opened} onClose={onClose}>
        <Stack>
            <Text ta='center'>{userToUpdate.displayName}</Text>
            <Text ta='center'>Account type: {userToUpdate.role}</Text>
            <SegmentedControl 
                data={[
                    { label: 'Admin', value: 'admin' },
                    { label: 'Dropzone', value: 'dropzone' },
                    { label: 'Instructor', value: 'instructor' },
                    { label: 'Student', value: 'student' },
                  ]}
                  defaultValue={userToUpdate.role}
                  onChange={(value) => setRole(value as 'admin' | 'student' | 'instructor' | 'dropzone')}
            />
            <Button loading={loading} onClick={handleSave} variant='light' color='green'>Save</Button>
        </Stack>
    </Modal>
  )
}

export default PermissionsModal 