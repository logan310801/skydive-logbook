'use client'

import { Paper, Stack, Text, Button, TextInput, Loader, MultiSelect } from '@mantine/core'
import { useState } from 'react'

import { useUserProfile } from '@/components/contexts/UserProfileContext'

export default function ProfilePage() {
    const { profile, loading, setProfileField, saveProfile } = useUserProfile()
    const [isEditing, setIsEditing] = useState(false)

    if (loading || !profile ) return <Loader />

    return (
          <Paper withBorder shadow="xl" radius="lg" p="xl">
            <Stack>
              <Text ta="center" size="xl">
                Profile Page
              </Text>
              <Text ta="center" size="lg">
                {profile.displayName}
              </Text>
    
              <TextInput
                label="Name"
                value={profile.displayName}
                onChange={(e) => setProfileField('displayName', e.currentTarget.value)}
                disabled={!isEditing}
              />
              <TextInput
                label="Dropzone"
                value={profile.dropzone}
                onChange={(e) => setProfileField('dropzone', e.currentTarget.value)}
                disabled={!isEditing}
              />
              <TextInput
                label="License Number"
                value={profile.license}
                onChange={(e) => setProfileField('license', e.currentTarget.value)}
                disabled={!isEditing}
              />

              <MultiSelect 
                label='Ratings'
                data={['Tandem', 'AFF', 'Static Line']}
                value={profile.ratings}
                onChange={(val) => setProfileField('ratings', val)}
                disabled={!isEditing}
              />

              <Text>Account type: {profile.role}</Text>

    
              <Button
                color={isEditing ? "green" : "dark"}
                onClick={() => {
                  if (isEditing) {
                    saveProfile();
                    setIsEditing(false)
                  } else setIsEditing(true);
                }}
              >
                {isEditing ? "Save changes" : "Edit profile"}
              </Button>
            </Stack>
          </Paper>
      );
    }
