"use client";

import { useState, useContext } from "react";
import {
  Modal,
  TextInput,
  NumberInput,
  Textarea,
  Button,
  Group,
  Stack,
} from "@mantine/core";
import { DatePicker } from '@mantine/dates'
import { Jump } from "@/types/jump";
import { AuthContext } from "@/components/contexts/AuthProvider";
import { addJump } from "@/utils/actions/CRUD";
import { Timestamp } from 'firebase/firestore'

interface AddJumpModalProps {
  opened: boolean;
  onClose: () => void;
  onAdded?: (jump: Jump) => void; // optional callback after adding
}

export default function AddJumpModal({ opened, onClose, onAdded }: AddJumpModalProps) {
  const { user } = useContext(AuthContext);

  const [date, setDate] = useState<string | null>(new Date().toISOString());
  const [dropzone, setDropzone] = useState("");
  const [aircraft, setAircraft] = useState("");
  const [altitude, setAltitude] = useState<string | number | undefined>();
  const [freefallTime, setFreefallTime] = useState<string | number | undefined>();
  const [canopy, setCanopy] = useState("");
  const [jumpType, setJumpType] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user || !dropzone || !date) return;

    const newJump: Omit<Jump, "id" | "createdAt"> = {
      date: date ? Timestamp.fromDate(new Date(date)) : Timestamp.now(),
      dropzone,
      aircraft,
      altitude: Number(altitude),
      freefallTime: Number(freefallTime),
      canopy,
      jumpType,
      notes,
    };

    setLoading(true);
    try {
      const id = await addJump(user.uid, newJump);
      if (onAdded) onAdded({ id, ...newJump, createdAt: new Date().toISOString() });
      // reset form
      setDropzone("");
      setAircraft("");
      setAltitude(undefined);
      setFreefallTime(undefined);
      setCanopy("");
      setJumpType("");
      setNotes("");
      setDate(String(new Date()));
      onClose();
    } catch (error) {
      console.error("Error adding jump:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Add New Jump" size="lg">
      <Stack>
        <DatePicker
          value={date}
          onChange={(val) => setDate(val)}
        />
        <TextInput
          label="Dropzone"
          placeholder="Enter dropzone"
          value={dropzone}
          onChange={(e) => setDropzone(e.currentTarget.value)}
          required
        />
        <TextInput
          label="Aircraft"
          placeholder="Aircraft used"
          value={aircraft}
          onChange={(e) => setAircraft(e.currentTarget.value)}
        />
        <NumberInput
          label="Altitude (ft)"
          placeholder="e.g., 13000"
          value={altitude}
          onChange={setAltitude}
          min={0}
        />
        <NumberInput
          label="Freefall Time (s)"
          placeholder="e.g., 55"
          value={freefallTime}
          onChange={setFreefallTime}
          min={0}
        />
        <TextInput
          label="Canopy"
          placeholder="Canopy used"
          value={canopy}
          onChange={(e) => setCanopy(e.currentTarget.value)}
        />
        <TextInput
          label="Jump Type"
          placeholder="Formation, FS, AFF, etc."
          value={jumpType}
          onChange={(e) => setJumpType(e.currentTarget.value)}
        />
        <Textarea
          label="Notes"
          placeholder="Any additional info"
          value={notes}
          onChange={(e) => setNotes(e.currentTarget.value)}
          minRows={2}
        />
        <Group>
          <Button onClick={handleSubmit} loading={loading} variant="gradient">
            Add Jump
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}