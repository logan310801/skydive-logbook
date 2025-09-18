"use client";

import { Card, Text, Loader, Stack, Group, Button, Center } from "@mantine/core";
import { Circle, CheckCheck, MoreHorizontal, Pencil, CircleCheck } from 'lucide-react'
import { UserProfile } from "@/components/contexts/UserProfileContext";
import JumpDetailsModal from "./modals/JumpDetailsModal";
import { Jump } from "@/types/jump";

interface Props {
  student: UserProfile;
  logbook: any[]; // array of jump documents
  loading: boolean;
  selectedJump: Jump | null;
  setSelectedJump: React.Dispatch<React.SetStateAction<Jump | null>>
  setSignOffModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setJumpDetailsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function StudentLogbookList({ setJumpDetailsModalOpen, setSignOffModalOpen, selectedJump, setSelectedJump, logbook, loading }: Props) {
  return (
    <>

    <Stack mt='lg' gap={3}>
            {loading ? <Center><Loader type='dots'/></Center> : 
                logbook.length === 0 ? <Text>No jumps</Text> : 
                logbook.map((jump, idx) => (
                  <Card m={0} p={6} key={jump.id}>
                    <Group pl="xs" pr="xs" justify="space-between">
                      <Group>
                        <Text size="0.7rem">Jump: #{logbook.length - idx}</Text>
                        <Text size="0.7rem">{jump.dropzone}</Text>
                      </Group>
                
                      <Group>
                        <Button onClick={() => {
                            setSelectedJump(jump)
                            setSignOffModalOpen(true)
                            }} size="compact-xs" variant="transparent">
                          {jump.signed ? 
                            <CircleCheck color='green' size={13} />
                            :
                            <Circle color='yellow' size={12} />
                          } 
                        </Button>
                        <Button
                          onClick={() => {
                            setSelectedJump(jump)
                            setJumpDetailsModalOpen(true)
                            }}
                          size="compact-xs"
                          color="blue.5"
                          variant="transparent"
                        >
                          <Pencil size={12} />
                        </Button>
                        <Button
                          size="compact-xs"
                          color="white"
                          variant="transparent"
                        >
                          <MoreHorizontal size={12} />
                        </Button>
                      </Group>
                    </Group>
                  </Card>
                ))
            }
        </Stack>

    </>

  );
}