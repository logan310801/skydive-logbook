import React from 'react'
import { Paper, Group, Button, Modal } from '@mantine/core'
import { useState, useContext } from 'react'
import AddJumpModal from '@/components/modals/AddJumpModal'
import { AuthContext } from './contexts/AuthProvider'
import { useRouter } from 'next/navigation'

const CRUD = () => {
    const [addJumpModalOpen, setAddJumpModalOpen] = useState(false)
    const router = useRouter()

  return (
    <>
        <AddJumpModal opened={addJumpModalOpen} onClose={() => setAddJumpModalOpen(false)}/>

        <Paper withBorder p='lg' shadow='lg' radius='lg' >
            <Group gap='xs' justify='center' wrap='nowrap'>
                <Button radius='xl' variant='gradient' onClick={() => setAddJumpModalOpen(true)}>Create</Button>
                <Button radius='xl' variant='gradient'>Search</Button>
                <Button radius='xl' variant='gradient' onClick={() => router.push('/equipment')}>Equipment</Button>
            </Group>
        </Paper>
    </>
  )
}

export default CRUD