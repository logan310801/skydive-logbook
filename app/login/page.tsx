'use client'

import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/config'
import { useRouter } from 'next/navigation'

import { Text, PasswordInput, Center, Stack, Group, Paper, TextInput, Button, Loader } from '@mantine/core'
import { AuthContext } from '@/components/contexts/AuthProvider'

export default function LoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [submittingDetails, setSubmittingDetails] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handleRedirect = () => {
        router.push('/signup')
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmittingDetails(true)
        try {
            await signInWithEmailAndPassword(auth, email, password)
            router.push('/')
        } catch (error: any) {
            setError(error.message)
            console.error(error.message)
        }
        setSubmittingDetails(false)
    }

    return (
        <Center style={{ height: '100vh' }}>
            <Paper withBorder shadow='xl' radius='lg' p='xl'>
            <form onSubmit={handleLogin}>
                <Stack gap='xl'>
                    
                    <Text size='xl' ta='center'>Login</Text>
                    <TextInput 
                        placeholder='example@email.com'
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        type='email'
                        radius='xl'
                    />
                    <PasswordInput 
                        placeholder='*********'
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        radius='xl'
                    />
                    <Text ta='center'>{error}</Text>
                    <Button variant='transparent' size='xs' c='blue' onClick={handleRedirect}>Create an account</Button>      
                    {submittingDetails ? <Group justify='center'><Loader type='dots' /></Group> : <Button variant='gradient' radius='xl' type='submit'>Login</Button>}
                    
                </Stack>
                </form>
            </Paper>
        </Center>
    )
}