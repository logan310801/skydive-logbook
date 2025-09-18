import { db } from '@/firebase/config'
import { Jump } from '@/types/jump'
import { Rig } from '@/types/rig'
import { collection, getDocs, query, orderBy, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { functions } from '@/firebase/config'
import { httpsCallable } from 'firebase/functions'

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

///

export async function addRig(uid: string, rigData: Omit<Rig, 'id' | 'createdAt'>) {
    const rigsRef = collection(db, 'users', uid, 'rigs')
    await addDoc(rigsRef, {
        ...rigData,
        createdAt: new Date().toISOString()
    })
}

export async function updateRig(uid: string, rigId: string, updatedFields: Partial<Rig>) {
    try {
        const rigRef = doc(db, 'users', uid, 'rigs', rigId)
        await updateDoc(rigRef, updatedFields)
        console.log('Rig updated', updatedFields)
    } catch (error) {
        console.error(error)
        throw error 
    }
}

export async function deleteRig(uid: string, rigId: string) {
    try {
        const rigRef = doc(db, 'users', uid, 'rigs', rigId)
        await deleteDoc(rigRef)
    } catch (error) {
        console.error(error)
        throw error
    }
}

///

export async function updateUser(uid: string, role: 'admin' | 'dropzone' | 'student' | 'instructor') {
    const setUserRole = httpsCallable(functions, 'setUserRole')
    try {
        const result = await setUserRole( {uid, role} )
        console.log(result.data)
    } catch (error) {
        console.error(error)
    }
}

///

export async function signOffJump(studentId: string | undefined, jumpId: string | undefined) {
    const callable = httpsCallable(functions, 'signOffJump')

    if (!studentId || !jumpId) throw new Error('Failed to get correct studentID and or JumpId for update in crud')
        
    try {
        const result = await callable({ studentId, jumpId })
        console.log(result.data)
    } catch (err) {
        console.error(err)
    }
}