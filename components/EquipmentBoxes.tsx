'use client'

import { Select, TextInput, Button, Stack, Grid, Group, Text} from '@mantine/core'
import React, { useContext, useEffect, useState } from 'react'
import { useUserProfile } from './contexts/UserProfileContext'
import { AuthContext } from './contexts/AuthProvider'
import { Rig } from '@/types/rig'
import { addRig, deleteRig, updateRig } from '@/utils/actions/CRUD'
import { collection, query, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/config'

const EquipmentBoxes = () => {
  const { profile, rigs, setProfileField, saveProfile } = useUserProfile()
  const { user, loading } = useContext(AuthContext)

  const [selectedRig, setSelectedRig] = useState<Rig | null>(
    profile?.currentRig
      ? rigs.find((rig) => rig.id === profile.currentRig) || null
      : null
  )

  useEffect(() => {
    if (profile?.currentRig && rigs.length > 0) {
      const rig = rigs.find((r) => r.id === profile.currentRig) || null;
      setSelectedRig(rig);
      console.log("Loaded currentRig:", profile.currentRig, "Resolved rig:", rig);
    }
  }, [profile?.currentRig, rigs]);

  const [container, setContainer] = useState<string>(selectedRig ? selectedRig?.container : '')
  const [canopy, setCanopy] = useState<string>(selectedRig ? selectedRig?.canopy : '')
  const [reserve, setReserve] = useState<string>(selectedRig ? selectedRig?.reserve : '')
  const [aad, setAad] = useState<string>(selectedRig ? selectedRig?.aad : '')
  const [lineset, setLineset] = useState<string>(selectedRig ? selectedRig?.lineset : '')

  const handleCreate = async () => {
    if (!user || !profile) return 
    const newRig = {
        container,
        canopy,
        aad,
        lineset,
        reserve
      }
      try {
        await addRig(user?.uid, newRig)

        setContainer('')
        setCanopy('')
        setReserve('')
        setAad('')
        setLineset('')
        
        setSelectedRig(null)

      } catch (error) {
        console.error(error)
      }
      user.reload()
  }

  const handleDelete = async () => {
    if (!user || !selectedRig || !selectedRig.id || !profile) return 
    try {
      await deleteRig(user.uid, selectedRig.id)
      setContainer('')
      setCanopy('')
      setReserve('')
      setAad('')
      setLineset('')
        
      setSelectedRig(null)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSave = async () => {
    if (!selectedRig || !selectedRig.id || !user || !profile) return;
  
    try {
      await updateRig(user.uid, selectedRig.id, {
        container,
        canopy,
        reserve,
        aad,
        lineset,
      });

      setContainer('')
      setCanopy('')
      setReserve('')
      setAad('')
      setLineset('')

      setSelectedRig(null)
      console.log("Rig updated successfully");
    } catch (error) {
      console.error("Error saving rig:", error);
    }
  };

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
        const rig = rigs.find((r) => r.container === val) || null
        if (!rig || !rig.id) return

        setSelectedRig(rig)
        setProfileField('currentRig', rig.id)
        saveProfile()
        setContainer(rig.container)
        setCanopy(rig.canopy)
        setReserve(rig.reserve)
        setAad(rig.aad)
        setLineset(rig.lineset)
      }}
      data={rigs ? rigs.map((rig) => ({
        value: rig.container, // Select needs a string
        label: rig.container, // Shown to user
      })) : []}
    />

      <Group my='md' justify='space-between'>
        <Button variant='gradient' onClick={handleCreate}>Create rig</Button>
        <Button variant='gradient' onClick={handleDelete}>Delete</Button> 
        <Button variant='gradient' onClick={handleSave}>Save</Button>
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