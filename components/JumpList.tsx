'use client' 

import React, { useContext, useEffect, useState } from 'react'
import { Stack, Card, Group, Center, Loader, Text, Button } from '@mantine/core'
import { CheckCheck, Pencil, Trash2 } from 'lucide-react'
import { deleteJump } from '@/utils/actions/CRUD'
import { AuthContext } from './contexts/AuthProvider'
import { Jump } from '@/types/jump'
import { collection, orderBy, query, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase/config'
import JumpDetailsModal from './modals/JumpDetailsModal'

type JumpListProps = {
    jumps: Jump[]
    setJumps: React.Dispatch<React.SetStateAction<Jump[]>>
}

const JumpList = ({ jumps, setJumps }: JumpListProps ) => {
    const { user, loading } = useContext(AuthContext)
    const [loadingJumps, setLoadingJumps] = useState(true)
    const [selectedJump, setSelectedJump] = useState<Jump | null>(null)

    useEffect(() => {
        if (!loading && user) {
          setLoadingJumps(true);
      
          const jumpsRef = collection(db, "users", user.uid, "jumps");
          const q = query(jumpsRef, orderBy("date", "desc"));
      
          const unsubscribe = onSnapshot(q, (snapshot) => {
            const data: Jump[] = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            } as Jump));
            setJumps(data);
            setLoadingJumps(false);
          }, (error) => {
            console.error("Error fetching jumps:", error);
            setLoadingJumps(false);
          });
      
          // Cleanup on unmount
          return () => unsubscribe();
        }
      }, [loading, user]);


    const handleDelete = async (jumpId: string) => {
        try {
          if (!user) return;
          await deleteJump(user.uid, jumpId)
          console.log('Deleted jump', jumpId)
        } catch (error) {
          console.error(error)
        }
      }

  return (
    <>
    <JumpDetailsModal
      opened={!!selectedJump}
      onClose={() => setSelectedJump(null)}
      jump={selectedJump}
      jumpNumber={selectedJump ? jumps.length - jumps.findIndex(j => j.id === selectedJump.id) : 0}    />

    <Stack gap={3}>
            {loadingJumps ? <Center><Loader type='dots'/></Center> : 
                jumps.length === 0 ? <Text>No jumps</Text> : 
                jumps.map((jump, idx) => (
                  <Card m={0} p={6} key={jump.id}>
                    <Group pl="xs" pr="xs" justify="space-between">
                      <Group>
                        <Text size="0.7rem">Jump: #{jumps.length - idx}</Text>
                        <Text size="0.7rem">{jump.dropzone}</Text>
                      </Group>
                
                      <Group>
                        <Button onClick={() => {}} size="compact-xs" color="green" variant="transparent">
                          <CheckCheck size={12} />
                        </Button>
                        <Button
                          onClick={() => setSelectedJump(jump)}
                          size="compact-xs"
                          color="white"
                          variant="transparent"
                        >
                          <Pencil size={12} />
                        </Button>
                        <Button
                          onClick={() => jump.id && handleDelete(jump.id)}
                          size="compact-xs"
                          color="red"
                          variant="transparent"
                        >
                          <Trash2 size={12} />
                        </Button>
                      </Group>
                    </Group>
                  </Card>
                ))
            }
        </Stack>
    </>
  )
}

export default JumpList