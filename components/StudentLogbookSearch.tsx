"use client";

import { useState, useEffect } from "react";
import { Autocomplete } from "@mantine/core";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "@/firebase/config";
import { UserProfile } from "@/components/contexts/UserProfileContext";

interface Props {
    selectedStudent: UserProfile | null
  onStudentSelect: (student: UserProfile | null) => void;
}

export default function StudentLogbookSearch({ selectedStudent, onStudentSelect }: Props) {
  const [input, setInput] = useState(selectedStudent?.displayName || '');
  const [options, setOptions] = useState<UserProfile[]>([]);

  useEffect(() => {
    if (input.length < 2) {
      setOptions([]);
      return;
    }

    const fetchStudents = async () => {
      const usersRef = collection(db, "users");
      const q = query(
        usersRef,
        where("role", "==", "student"),
        where("displayName", ">=", input),
        where("displayName", "<=", input + "\uf8ff"),
        limit(10)
      );
      const snapshot = await getDocs(q);
      setOptions(
        snapshot.docs.map((doc) => ({
          id: doc.id, // student uid
          ...doc.data(),
        })) as UserProfile[]
      );
    };

    fetchStudents();
  }, [input]);

  return (
    <Autocomplete
      mt='md'
      placeholder="Type student name..."
      value={input}
      onChange={setInput}
      data={options.map((s) => s.displayName)} // only names in dropdown
      onOptionSubmit={(item) => {
        const student = options.find((s) => s.displayName === item);
        onStudentSelect(student || null);
      }}
    />
  );
}