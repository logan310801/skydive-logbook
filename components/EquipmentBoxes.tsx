import { Select, TextInput, Button, Stack, Grid, Group, Text} from '@mantine/core'
import React, { useContext, useState } from 'react'
import { useUserProfile } from './contexts/UserProfileContext'
import { AuthContext } from './contexts/AuthProvider'
import { Rig } from '@/types/rig'
import { addRig } from '@/utils/actions/CRUD'

const EquipmentBoxes = () => {
  const { profile } = useUserProfile()
  const { user } = useContext(AuthContext)

  const [selectedRig, setSelectedRig] = useState<Rig | null>(
    profile?.currentRig
      ? profile.rigs.find((rig) => rig.id === profile.currentRig) || null
      : null
  )

  const [container, setContainer] = useState<string>('')
  const [canopy, setCanopy] = useState<string>('')
  const [reserve, setReserve] = useState<string>('')
  const [aad, setAad] = useState<string>('')
  const [lineset, setLineset] = useState<string>('')

  const handleCreate = async () => {
    if (!user || !profile) return 
    const newRig = {
        container,
        canopy,
        aad,
        lineset,
        reserve
      }
    await addRig(user?.uid, newRig)
  }

  if (!profile || !user) return null

  return (
    <>
    <Group justify='space-between'>
        <Text>Current Rig: </Text>
        <Text>{selectedRig?.container}, {selectedRig?.canopy}</Text>
    </Group>
    
    <Select
      mt='md'
      label="Rigs"
      placeholder="Select a rig"
      // Select only accepts strings, so we bind to container
      value={selectedRig?.container || null}
      onChange={(val) => {
        // find the rig object that matches the selected value
        const rig = profile.rigs.find((r) => r.container === val) || null
        setSelectedRig(rig)
      }}
      data={profile.rigs ? profile.rigs.map((rig) => ({
        value: rig.container, // Select needs a string
        label: rig.container, // Shown to user
      })) : []}
    />

      <Group my='md' justify='space-between'>
        <Button variant='gradient'>Create rig</Button>
        <Button variant='gradient'>Save</Button>
      </Group>

    <Grid mt='md'>
        <Grid.Col span={6}>
            <Stack>
                <TextInput 
                    label='Container'
                    value={container}
                    onChange={(e) => setContainer(e.currentTarget.value)}
                />
                <TextInput 
                    label='Canopy'
                    value={canopy}
                    onChange={(e) => setCanopy(e.currentTarget.value)}
                />
                <TextInput 
                    label='Reserve'
                    value={reserve}
                    onChange={(e) => setReserve(e.currentTarget.value)}
                />
            </Stack>
        </Grid.Col>

        <Grid.Col span={6}>
            <Stack>
                <TextInput 
                    label='AAD'
                    value={aad}
                    onChange={(e) => setAad(e.currentTarget.value)}
                />
                <TextInput 
                    label='Lineset'
                    value={lineset}
                    onChange={(e) => setLineset(e.currentTarget.value)}
                />
            </Stack>
        </Grid.Col>
    </Grid> 

    </>
  )
}

export default EquipmentBoxes