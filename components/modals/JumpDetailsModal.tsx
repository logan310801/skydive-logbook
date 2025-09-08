import { Jump } from '@/types/jump'
import React, { useState, useEffect, useContext } from 'react'
import { Button, NumberInput, Stack, Text, TextInput, Modal } from '@mantine/core'
import { DateInput } from '@mantine/dates'
import { updateJump } from '@/utils/actions/CRUD'
import { AuthContext } from '../contexts/AuthProvider'
import { Timestamp } from 'firebase/firestore'

type JumpDetailsModalProps = {
    opened: boolean
    onClose: () => void
    jump: Jump | null
    jumpNumber: number
}

const JumpDetailsModal = ({ jump, opened, onClose, jumpNumber }: JumpDetailsModalProps) => {
  const { user } = useContext(AuthContext)
  const [isEditing, setIsEditing] = useState(false)

  const [jumpType, setJumpType] = useState<string>(jump?.jumpType || '')
  const [dropzone, setDropzone] = useState<string>(jump?.dropzone || '')
  const [date, setDate] = useState<string | null>(jump?.date.toDate().toISOString() || '')
  const [aircraft, setAircraft] = useState<string>(jump?.aircraft || '')
  const [altitude, setAltitude] = useState<string | number>(jump?.altitude || '')
  const [freefallTime, setFreefallTime] = useState(jump?.freefallTime || '')
  const [canopy, setCanopy] = useState(jump?.canopy || '')
  const [notes, setNotes] = useState(jump?.notes || '')

  useEffect(() => {
    if (jump) {
      setJumpType(jump.jumpType || '')
      setDropzone(jump.dropzone || '')
      setDate(jump.date?.toDate().toISOString() || null) // Firestore Timestamp → JS Date
      setAircraft(jump.aircraft || '')
      setAltitude(jump?.altitude ?? 13000)
      setFreefallTime(jump?.freefallTime ?? 55)
      setCanopy(jump.canopy || '')
      setNotes(jump.notes || '')
    }
  }, [jump])

  
const handleSave = async () => {
  if (!jump || !user) return;

  try {
    await updateJump(user.uid, jump.id!, {
      jumpType,
      dropzone,
      // Convert ISO string → Date → Firestore Timestamp
      date: date ? Timestamp.fromDate(new Date(date)) : undefined,
      aircraft,
      altitude: Number(altitude),
      freefallTime: Number(freefallTime),
      canopy,
      notes,
    });
    setIsEditing(false);
  } catch (err) {
    console.error("Error updating jump:", err);
  }
};

  return (
    <Modal opened={opened} onClose={onClose}>
    <Stack>
      <Text size='lg' fw={900} >Jump {jumpNumber}</Text>

        <Stack>
          <TextInput 
            value={jumpType}
            onChange={(e) => setJumpType(e.currentTarget.value)}
            disabled={!isEditing}
          />
          <TextInput 
            value={dropzone}
            onChange={(e) => setDropzone(e.currentTarget.value)}
            disabled={!isEditing}
          />
          <DateInput
            value={date}
            onChange={setDate}
            disabled={!isEditing}
          />
          <TextInput 
            value={aircraft}
            onChange={(e) => setAircraft(e.currentTarget.value)}
            disabled={!isEditing}
          />
          <NumberInput 
            value={altitude}
            onChange={setAltitude}
            disabled={!isEditing}
          />
          <NumberInput 
            value={freefallTime}
            onChange={setFreefallTime}
            disabled={!isEditing}
          />
          <TextInput 
            value={canopy}
            onChange={(e) => setCanopy(e.currentTarget.value)}
            disabled={!isEditing}
          />
          <TextInput 
            value={notes}
            onChange={(e) => setNotes(e.currentTarget.value)}
            disabled={!isEditing}
          />
        </Stack>

        <Button
          color={isEditing ? 'green' : 'dark'}
          onClick={() => {
            if (isEditing) {
              handleSave()
            } else {
              setIsEditing(prev => !prev)
            }
          }}
        >
          {isEditing ? 'Save' : 'Edit'}
        </Button>
    </Stack>
    </Modal>
  )
}

export default JumpDetailsModal