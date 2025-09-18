import React, { useState } from 'react'
import { Modal, Text, Button } from '@mantine/core'
import { Jump } from '@/types/jump';
import UserDetails from './UserDetails';
import { UserProfile, useUserProfile } from './contexts/UserProfileContext';
import { signOffJump } from '@/utils/actions/CRUD';

type Props = {
    jumpToSignOff: Jump | null;
    opened: boolean;
    onClose: () => void
    jumper: UserProfile | null
    jumpNumber: number
}

const SignOffJumpModal = ({ jumpNumber, jumper, jumpToSignOff, opened, onClose }: Props) => {
    const { profile } = useUserProfile()
    const [loading, setLoading] = useState(false)

    if (!profile || !jumper || !jumpToSignOff) return

    const handleSignOff = async () => {
        setLoading(true)

        await signOffJump(jumper.id, jumpToSignOff.id)
        onClose()
        setLoading(false)
    }



  return (
    <Modal opened={opened} onClose={onClose} >
        <Text ta='center'>Jump {jumpNumber} </Text>
        <Text my='sm' size='xl' ta='center'>Student</Text>
        <UserDetails profile={jumper} />

        <Text my='sm' size='xl' ta='center'>Instructor</Text>
        <UserDetails profile={profile} />

        <Button loading={loading} onClick={handleSignOff} mx='auto' display='block' color='green'>Sign Jump</Button>
    </Modal>
  )
}

export default SignOffJumpModal