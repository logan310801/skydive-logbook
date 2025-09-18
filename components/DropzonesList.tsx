import React, { useState } from 'react'
import { Stack, Paper, Card, Text, Button, Group } from '@mantine/core'
import { UserProfile } from './contexts/UserProfileContext'
import { Search } from 'lucide-react'
import PermissionsModal from './PermissionsModal'

type DropzonesListProps = {
    dropzones: UserProfile[]
}

const DropzonesList = ({ dropzones }: DropzonesListProps ) => {
    const [opened, setOpened] = useState(false)
    const [selectedDropzone, setSelectedDropzone] = useState<UserProfile | null>(null)

    const handleOpen = (instructor: UserProfile) => {
        setSelectedDropzone(instructor)
        setOpened(true)
    }

  return (
    <Paper withBorder radius='lg' shadow='lg' p='lg'>
        <Stack>
            {dropzones.map((dropzone) => 
                <Card p='xs' key={dropzone?.id}>
                    <Group wrap='nowrap' justify='space-between'>
                        <Text truncate>{dropzone.displayName}</Text>
                        <Text>{dropzone.license}</Text>
                        <Group>
                            <Button onClick={() => handleOpen(dropzone)} variant='transparent' ><Search size={18} /></Button>
                        </Group>
                    </Group>
                </Card>
            )}
        </Stack>
        {selectedDropzone && (
            <PermissionsModal
            opened={opened}
            onClose={() => setOpened(false)}
            userToUpdate={selectedDropzone}
            />
        )}
    </Paper>
  )
}

export default DropzonesList