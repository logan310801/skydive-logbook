'use client'

import React from 'react'
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '@/components/contexts/AuthProvider';
import { UserProfile } from '@/components/contexts/UserProfileContext';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase/config'
import InstructorsList from '@/components/InstructorsList';
import ProtectedRoute from '@/components/redirects/ProtectedRoute';

const InstructorsPage = () => {
  const [instructors, setInstructors] = useState<UserProfile[]>([]);
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
        const instructorUsers = allUsers.filter((u) => u.role === "instructor");
        setInstructors(instructorUsers);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => unsubscribe(); // clean up listener
  }, [user, loading]);

  return (
    <ProtectedRoute allowedRoles={['dropzone', 'admin']} >
      <InstructorsList instructors={instructors} />
    </ProtectedRoute>
  );
};

export default InstructorsPage