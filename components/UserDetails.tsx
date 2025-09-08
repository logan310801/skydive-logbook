import React from 'react'
import { Group, Card, Loader, Stack, Text } from '@mantine/core'
import { useUserProfile } from './contexts/UserProfileContext'

const UserDetails = () => {
    const { profile } = useUserProfile()

    if ( !profile ) return <Loader />
  return (
    <Stack mb='md'>
        <Card >
            <Group justify='space-between'>
                <Text>
                {profile.displayName}
                </Text>
                <Text>
                {profile.license}
                </Text>
            </Group>

        </Card>
    </Stack>

  )
}

export default UserDetails