import React, { useState } from 'react'
import { Modal, Text, Button, Group } from '@mantine/core'
import { Jump } from '@/types/jump';
import UserDetails from './UserDetails';
import { UserProfile, useUserProfile } from './contexts/UserProfileContext';
import { signOffJump } from '@/utils/actions/CRUD';
import { Circle, CircleCheck } from 'lucide-react';
import { notifications } from '@mantine/notifications';

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
        try {

        await signOffJump(jumper.id, jumpToSignOff.id)
        onClose()

        notifications.show({
            title: 'Jump signed',
            message: `${jumper?.displayName} ${jumper?.license} jump signed by ${profile?.displayName} ${profile?.license}`,
            color: 'green',
          });
      
        } catch (err) {
          notifications.show({
            title: 'Sign-off failed',
            message: 'Could not sign the jump. Please try again.',
            color: 'red',
          });
          console.error(err);
        setLoading(false)
    }
    }


  return (
    <Modal opened={opened} onClose={onClose} >
        <Group justify='center'>
            <Text size='xl' ta='center'>Jump {jumpNumber} </Text>
            {jumpToSignOff.signed ? <CircleCheck color='green'/> : <Circle color='yellow' />}
        </Group>
        
        <Text my='sm' size='xl' ta='center'>Student</Text>
        <UserDetails profile={jumper} />

        <Text my='sm' size='xl' ta='center'>Instructor</Text>
        <UserDetails profile={profile} />

        <Button loading={loading} onClick={handleSignOff} mx='auto' display='block' color='green'>{jumpToSignOff.signed ? 'Re-sign' : 'Sign jump'}</Button>
    </Modal>
  )
}

export default SignOffJumpModal