'use client'

import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '@/components/contexts/AuthProvider';
import { UserProfile } from '@/components/contexts/UserProfileContext';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/config'
import DropzonesList from '@/components/DropzonesList';
import ProtectedRoute from '@/components/redirects/ProtectedRoute';

const DropzonesPage = () => {
  const [dropzones, setDropzones] = useState<UserProfile[]>([]);
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    if (loading || !user) return;

    const usersRef = collection(db, "users");
    const q = query(usersRef);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allUsers: UserProfile[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as UserProfile));

        // Filter only students
        const dropzoneUsers = allUsers.filter((u) => u.role === "dropzone");
        setDropzones(dropzoneUsers);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => unsubscribe(); // clean up listener
  }, [user, loading]);

  return (
    <ProtectedRoute allowedRoles={['admin']}>
      <DropzonesList dropzones={dropzones}/>
    </ProtectedRoute>
  );
}

export default DropzonesPage