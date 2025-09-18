import { Timestamp } from "firebase/firestore"

export interface Jump {
    id?: string         // optional because Firestore generates it
    date: Timestamp        // ISO string or "YYYY-MM-DD"    
    dropzone: string
    aircraft?: string
    altitude?: number
    freefallTime?: number
    canopy?: string
    container: string
    aad: string
    reserve: string
    lineset: string
    jumpType?: string
    notes?: string
    createdAt?: string    // optional, added by Firestore

    signed: boolean
    signedByUid?: string
    signedByDisplayName?: string
    signedByLicense?: string
    signedAt?: Timestamp
  }