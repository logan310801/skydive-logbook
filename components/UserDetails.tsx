import React from 'react'
import { Group, Card, Loader, Stack, Text } from '@mantine/core'
import { UserProfile, useUserProfile } from './contexts/UserProfileContext'

type Props = {
  profile: UserProfile
}

const UserDetails = ({ profile }: Props) => {

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