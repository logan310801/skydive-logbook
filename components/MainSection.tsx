'use client' 

import React from 'react'
import { Paper, Stack, Text, Center, Loader, Card, Group, Button, Grid } from '@mantine/core'
import { Trash2, Pencil, MoreVertical } from 'lucide-react'
import { deleteJump } from '@/utils/actions/CRUD'
import { Jump } from '@/types/jump'
import { useState, useContext, useEffect} from 'react'
import { AuthContext } from './contexts/AuthProvider'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/config'
import UserDetails from './UserDetails'
import JumpList from './JumpList'
import { useUserProfile } from './contexts/UserProfileContext'

const MainSection = () => {
    const [jumps, setJumps] = useState<Jump[]>([])
    const { profile } = useUserProfile()

    if (!profile) return <Text>Error: no profile found</Text>

  return (
    <Paper withBorder shadow='lg' radius='lg' p='lg' >

        <UserDetails profile={profile}/>

        <JumpList jumps={jumps} setJumps={setJumps} />

    </Paper>
  )
}

export default MainSection

