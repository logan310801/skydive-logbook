// contexts/UserProfileContext.tsx
'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { db } from '@/firebase/config'
import { AuthContext } from './AuthProvider'
import { Rig } from '@/types/rig'

interface UserProfile {
  displayName: string
  dropzone: string
  license: string
  ratings: string[]
  rigs: Rig[]
  currentRig: string
}

interface UserProfileContextType {
  profile: UserProfile | null
  loading: boolean
  setProfileField: <K extends keyof UserProfile>(
    field: K,
    value: UserProfile[K]
  ) => void
  saveProfile: () => Promise<void>
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined)

export const UserProfileProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading: authLoading } = useContext(AuthContext)
  const [profile, setProfile] = useState<UserProfile | null>(null)
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
          rigs: data.rigs || [],
          currentRig: data.currentRig || ''
        })
      } else {
        // Create default profile
        await setDoc(ref, {
          displayName: user.displayName || '',
          dropzone: '',
          license: '',
          ratings: [],
          rigs: [],
          currentRig: '',
          createdAt: new Date()
        })
        setProfile({
          displayName: user.displayName || '',
          dropzone: '',
          license: '',
          ratings: [],
          rigs: [],
          currentRig: ''
        })
      }
      setLoading(false)
    }
    fetchProfile()
  }, [user, authLoading])

  // Update local profile state
  const setProfileField = <K extends keyof UserProfile>(
    field: K,
    value: UserProfile[K]
  ) => {
    setProfile((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  // Save profile to Firebase Auth + Firestore
  const saveProfile = async () => {
    if (!user || !profile) return
  
    try {
      // Update Firebase Auth displayName
      await updateProfile(user, { displayName: profile.displayName })
  
      // Update Firestore document
      const ref = doc(db, 'users', user.uid)
      const profileData = {
        displayName: profile.displayName,
        dropzone: profile.dropzone,
        license: profile.license,
        ratings: profile.ratings
      }
      await updateDoc(ref, profileData)
  
      console.log('Profile saved')
    } catch (error) {
      console.error('Error saving profile:', error)
    }
  }

  return (
    <UserProfileContext.Provider value={{ profile, loading, setProfileField, saveProfile }}>
      {children}
    </UserProfileContext.Provider>
  )
}

// Hook for easy usage
export const useUserProfile = () => {
  const context = useContext(UserProfileContext)
  if (!context) throw new Error('useUserProfile must be used within UserProfileProvider')
  return context
}