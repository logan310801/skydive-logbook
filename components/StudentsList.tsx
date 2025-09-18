import React, { useState } from 'react'
import { Stack, Paper, Card, Text, Button, Group } from '@mantine/core'
import { UserProfile } from './contexts/UserProfileContext'
import { Search } from 'lucide-react'
import PermissionsModal from './PermissionsModal'

type StudentsListProps = {
    students: UserProfile[]
}

const StudentsList = ({ students }: StudentsListProps ) => {
    const [opened, setOpened] = useState(false)
    const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null)

    const handleOpen = (student: UserProfile) => {
        setSelectedStudent(student)
        setOpened(true)
    }

  return (
    <Paper withBorder radius='lg' shadow='lg' p='lg'>
        <Stack>
            {students.map((student) => 
                <Card p='xs' key={student?.id}>
                    <Group wrap='nowrap' justify='space-between'>
                        <Text truncate>{student.displayName}</Text>
                        <Text>{student.license}</Text>
                        <Group>
                            <Button onClick={() => handleOpen(student)} variant='transparent' ><Search size={18} /></Button>
                        </Group>
                    </Group>
                </Card>
            )}
        </Stack>
        {selectedStudent && (
            <PermissionsModal
            opened={opened}
            onClose={() => setOpened(false)}
            userToUpdate={selectedStudent}
            />
        )}
    </Paper>
  )
}

export default StudentsList