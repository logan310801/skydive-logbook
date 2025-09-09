'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { doc, getDoc, setDoc, updateDoc, collection, onSnapshot } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { db } from '@/firebase/config'
import { AuthContext } from './AuthProvider'
import { Rig } from '@/types/rig'

export interface UserProfile {
  displayName: string
  dropzone: string
  license: string
  ratings: string[]
  currentRig: string
  role: 'student' | 'instructor' | 'admin'
}

interface UserProfileContextType {
  profile: UserProfile | null
  rigs: Rig[]
  loading: boolean
  setProfileField: <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => void
  saveProfile: () => Promise<void>
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [rigs, setRigs] = useState<Rig[]>([])
  const [loading, setLoading] = useState(true)

  // Load profile from Firestore
  useEffect(() => {
    if (authLoading || !user) return

    const fetchProfile = async () => {
      const ref = doc(db, 'users', user.uid)
      const snap = await getDoc(ref)

      if (snap.exists()) {
        const data = snap.data()
        setProfile({
          displayName: data.displayName || user.displayName || '',
          dropzone: data.dropzone || '',
          license: data.license || '',
          ratings: data.ratings || [],
          currentRig: data.currentRig || '',
          role: data.role
        })
      } else {
        // Create default profile
        const defaultProfile: UserProfile = {
          displayName: user.displayName || '',
          dropzone: '',
          license: '',
          ratings: [],
          currentRig: '',
          role: 'student'
        }
        await setDoc(ref, { ...defaultProfile, createdAt: new Date() })
        setProfile(defaultProfile)
      }
      setLoading(false)
    }
    fetchProfile()
  }, [user, authLoading])

  // Load rigs subcollection
  useEffect(() => {
    if (!user) return

    const rigsRef = collection(db, 'users', user.uid, 'rigs')
    const unsubscribe = onSnapshot(rigsRef, (snapshot) => {
      const data: Rig[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      } as Rig))
      setRigs(data)
    })

    return () => unsubscribe()
  }, [user])

  // Update local profile state
  const setProfileField = <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  // Save profile to Firebase Auth + Firestore
  const saveProfile = async () => {
    if (!user || !profile) return

    try {
      await updateProfile(user, { displayName: profile.displayName })

      const ref = doc(db, 'users', user.uid)
      await updateDoc(ref, {
        displayName: profile.displayName,
        dropzone: profile.dropzone,
        license: profile.license,
        ratings: profile.ratings,
        currentRig: profile.currentRig,
      })

      console.log('Profile saved')
    } catch (error) {
      console.error('Error saving profile:', error)
    }
  }

  return (
    <UserProfileContext.Provider value={{ profile, rigs, loading, setProfileField, saveProfile }}>
      {children}
    </UserProfileContext.Provider>
  )
}

// Hook for easy usage
export const useUserProfile = (): UserProfileContextType => {
  const context = useContext(UserProfileContext)
  if (!context) throw new Error('useUserProfile must be used within UserProfileProvider')
  return context
}