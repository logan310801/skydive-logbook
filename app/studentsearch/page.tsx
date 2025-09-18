"use client";

import { useState, useEffect, useContext } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/config";
import StudentLogbookSearch from "@/components/StudentLogbookSearch";
import StudentLogbookList from "@/components/StudentLogbookList";
import { UserProfile, useUserProfile } from "@/components/contexts/UserProfileContext";
import ProtectedRoute from "@/components/redirects/ProtectedRoute";
import { Title } from '@mantine/core'
import { Jump } from "@/types/jump";
import SignOffJumpModal from "@/components/SignOffJumpModal";
import JumpDetailsModal from "@/components/modals/JumpDetailsModal";
import { AuthContext } from "@/components/contexts/AuthProvider";
import { notifications } from "@mantine/notifications";

export default function StudentsPage() {
  const [selectedStudent, setSelectedStudent] = useState<UserProfile | null>(null);
  const [selectedJump, setSelectedJump] = useState<Jump | null>(null)
  const [signOffModalOpen, setSignOffModalOpen] = useState<boolean>(false)
  const [jumpDetailsModalOpen, setJumpDetailsModalOpen] = useState<boolean>(false)
  const [logbook, setLogbook] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext)
  const { profile } = useUserProfile()

  // Fetch logbook when student changes
  useEffect(() => {
    if (!user || !selectedStudent?.id) return;
  
    setLoading(true);
    const jumpsRef = collection(db, "users", selectedStudent.id, "jumps");
  
    // Subscribe to real-time updates
    const unsubscribe = onSnapshot(jumpsRef, (snapshot) => {
      setLogbook(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
  
    return () => unsubscribe(); // cleanup listener when student changes
  }, [selectedStudent, user]);

  return (
    <ProtectedRoute allowedRoles={['admin', 'instructor', 'dropzone']} redirectTo="/profile">
        <Title ta='center'>
            Student Logbook
        </Title>
        <Title size={20}ta='center'>
            {selectedStudent ? `${selectedStudent.displayName} ${selectedStudent.license}` : 'Select a student...'}
        </Title>
        
      <SignOffJumpModal 
        jumpNumber={selectedJump ? logbook.length - logbook.findIndex(j => j.id === selectedJump.id) : 0}
        jumper={selectedStudent}
        jumpToSignOff={selectedJump} 
        opened={signOffModalOpen} 
        onClose={() => {
           setSignOffModalOpen(false);
           setJumpDetailsModalOpen(false);
           setSelectedJump(null)
          }}
      />

      <JumpDetailsModal 
        setSignOffModalOpen={setSignOffModalOpen}
        jumpNumber={selectedJump ? logbook.length - logbook.findIndex(j => j.id === selectedJump.id) : 0} 
        jump={selectedJump} 
        opened={jumpDetailsModalOpen} 
        onClose={() => {setJumpDetailsModalOpen(false); setSelectedJump(null)}}
      />

      {/* Pass down callback so search sets the student */}
      <StudentLogbookSearch selectedStudent={selectedStudent} onStudentSelect={setSelectedStudent} />

      {/* Show logbook if a student is selected */}
      {selectedStudent && (
        <StudentLogbookList
          selectedJump={selectedJump} 
          setSelectedJump={setSelectedJump} 
          setJumpDetailsModalOpen={setJumpDetailsModalOpen}
          setSignOffModalOpen={setSignOffModalOpen}
          student={selectedStudent}
          logbook={logbook}
          loading={loading}
        />
      )}

    </ProtectedRoute>
  );
}