'use client'

import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { useRouter } from 'next/navigation'

import { Text, PasswordInput, Center, Stack, Paper, TextInput, Button } from '@mantine/core'

export default function SignUpPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const router = useRouter()

    const handleRedirect = () => {
        router.push('/login')
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await createUserWithEmailAndPassword(auth, email, password)
            router.push('/')
        } catch (error: any) {
            console.error(error.message)
        }
    }

    return (
        <Center style={{ height: '100vh' }}>
            <Paper withBorder shadow='xl' radius='lg' p='xl'>
            <form onSubmit={handleSignup}>
                <Stack gap='xl'>
                    
                    <Text ta='center' size='xl'>Create an account</Text>
                    <TextInput 
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        type='email'
                        radius='xl'
                    />
                    <PasswordInput 
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        radius='xl'
                    />
                    <Button variant='transparent' size='xs' c='blue' onClick={handleRedirect}>Already have an account?</Button>
                    <Button radius='xl' type='submit'>Sign up</Button>
                    
                </Stack>
                </form>
            </Paper>
        </Center>
    )
}