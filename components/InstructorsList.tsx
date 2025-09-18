import React, { useState } from 'react'
import { Stack, Paper, Card, Text, Button, Group } from '@mantine/core'
import { UserProfile } from './contexts/UserProfileContext'
import { Search } from 'lucide-react'
import PermissionsModal from './PermissionsModal'

type InstructorsListProps = {
    instructors: UserProfile[]
}

const InstructorsList = ({ instructors }: InstructorsListProps ) => {
    const [opened, setOpened] = useState(false)
    const [selectedInstructor, setSelectedInstructor] = useState<UserProfile | null>(null)

    const handleOpen = (instructor: UserProfile) => {
        setSelectedInstructor(instructor)
        setOpened(true)
    }

  return (
    <Paper withBorder radius='lg' shadow='lg' p='lg'>
        <Stack>
            {instructors.map((instructor) => 
                <Card p='xs' key={instructor?.id}>
                    <Group wrap='nowrap' justify='space-between'>
                        <Text truncate>{instructor.displayName}</Text>
                        <Text>{instructor.license}</Text>
                        <Group>
                            <Button onClick={() => handleOpen(instructor)} variant='transparent' ><Search size={18} /></Button>
                        </Group>
                    </Group>
                </Card>
            )}
        </Stack>
        {selectedInstructor && (
            <PermissionsModal
            opened={opened}
            onClose={() => setOpened(false)}
            userToUpdate={selectedInstructor}
            />
        )}
    </Paper>
  )
}

export default InstructorsList