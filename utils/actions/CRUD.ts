import { db } from '@/firebase/config'
import { Jump } from '@/types/jump'
import { Rig } from '@/types/rig'
import { collection, getDocs, query, orderBy, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore'

export async function getJumps(uid: string): Promise<Jump[]> {
    const jumpsRef = collection(db, 'users', uid, 'jumps')
    const q = query(jumpsRef, orderBy('date', 'desc'))
    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Jump[]
}

export async function addJump(uid: string, jumpData: Omit<Jump, 'id' | 'createdAt'>) {
    const jumpsRef = collection(db, 'users', uid, 'jumps')
    const docRef = await addDoc(jumpsRef, {
        ...jumpData,
        createdAt: new Date().toISOString(),
    })
    return docRef.id
}

export async function updateJump(uid: string, jumpId: string, updatedFields: Partial<Jump>) {
    try {
        const jumpRef = doc(db, 'users', uid, 'jumps', jumpId)
        await updateDoc(jumpRef, updatedFields)
        console.log('Jump updated', updatedFields)
    } catch (error) {
        console.error('Error updating jump', updatedFields)
        throw error
    }
}

export async function deleteJump(uid: string, jumpId: string) {
    const jumpRef = doc(db, 'users', uid, 'jumps', jumpId)
    await deleteDoc(jumpRef)
}

export async function addRig(uid: string, rigData: Omit<Rig, 'id' | 'createdAt'>) {
    const rigsRef = collection(db, 'users', uid, 'rigs')
    await addDoc(rigsRef, {
        ...rigData,
        createdAt: new Date().toISOString()
    })
}