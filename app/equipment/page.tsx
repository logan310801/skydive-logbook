'use client'

import UserDetails from '@/components/UserDetails'
import EquipmentBoxes from '@/components/EquipmentBoxes'
import { Paper } from '@mantine/core'
import React from 'react'

const EquipmentPage = () => {
  return (
    <Paper withBorder radius='lg' shadow='lg' p='lg'>
        <UserDetails />
        <EquipmentBoxes />
    </Paper>
  )
}

export default EquipmentPage