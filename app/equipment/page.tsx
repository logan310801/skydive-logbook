'use client'

import UserDetails from '@/components/UserDetails'
import EquipmentBoxes from '@/components/EquipmentBoxes'
import { Paper, Loader } from '@mantine/core'
import React from 'react'
import { useUserProfile } from '@/components/contexts/UserProfileContext'

const EquipmentPage = () => {
  const { profile } = useUserProfile()

  if (!profile) return <Loader variant='dots' />

  return (
    <Paper withBorder radius='lg' shadow='lg' p='lg'>
        <UserDetails profile={profile}/>
        <EquipmentBoxes />
    </Paper>
  )
}

export default EquipmentPage