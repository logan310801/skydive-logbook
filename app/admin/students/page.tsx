'use client'

import { useState, useEffect, useContext } from "react";
import { collection, query, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import { AuthContext } from "@/components/contexts/AuthProvider";
import { UserProfile } from "@/components/contexts/UserProfileContext";
import StudentsList from "@/components/StudentsList";
import ProtectedRoute from "@/components/redirects/ProtectedRoute";

const StudentsPage = () => {
  const [students, setStudents] = useState<UserProfile[]>([]);
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

        const studentUsers = allUsers.filter((u) => u.role === "student");
        setStudents(studentUsers);
      },
      (error) => {
        console.error(error);
      }
    );

    return () => unsubscribe(); // clean up listener
  }, [user, loading]);

  return (
    <ProtectedRoute allowedRoles={['dropzone', 'admin', 'instructor']} >
        <StudentsList students={students} />
    </ProtectedRoute>
  );
};

export default StudentsPage;