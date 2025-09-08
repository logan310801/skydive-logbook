'use client'

import React from 'react'
import { AppShell, Burger, Group, Text } from '@mantine/core'

type HeaderProps = {
    opened: boolean
    toggle: () => void
}

const HeaderElement = ({ opened, toggle }: HeaderProps ) => {
  return (
    <AppShell.Header>
        <Group pl='xs' style={{ height: '100%' }}>
            <Burger
            opened={opened}
            onClick={toggle}
            size="sm"
            />
            <Text size='lg' fw={1000}>JLOG</Text>
        </Group>
    </AppShell.Header>
  )
}

export default HeaderElement