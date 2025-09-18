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
  Select,
} from "@mantine/core";
import { DatePicker } from '@mantine/dates'
import { Jump } from "@/types/jump";
import { AuthContext } from "@/components/contexts/AuthProvider";
import { addJump } from "@/utils/actions/CRUD";
import { Timestamp } from 'firebase/firestore'
import { useUserProfile } from "../contexts/UserProfileContext";
import { Rig } from '@/types/rig'

interface AddJumpModalProps {
  opened: boolean;
  onClose: () => void;
  onAdded?: (jump: Jump) => void; // optional callback after adding
}

export default function AddJumpModal({ opened, onClose, onAdded }: AddJumpModalProps) {
  const { user } = useContext(AuthContext);
  const { profile, rigs } = useUserProfile()

  const [date, setDate] = useState<string | null>(new Date().toISOString());
  const [dropzone, setDropzone] = useState(profile?.dropzone || '');
  const [aircraft, setAircraft] = useState("C208");
  const [altitude, setAltitude] = useState<string | number | undefined>(14000);
  const [freefallTime, setFreefallTime] = useState<string | number | undefined>(55);
  const [rig, setRig] = useState<Rig | null>(rigs.find(r => r.id === profile?.currentRig) || null);
  const [jumpType, setJumpType] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user || !dropzone || !date || !rig) return;
  
    const newJump: Omit<Jump, "id" | "createdAt"> = {
      date: date ? Timestamp.fromDate(new Date(date)) : Timestamp.now(),
      dropzone,
      aircraft,
      altitude: Number(altitude),
      freefallTime: Number(freefallTime),
      canopy: rig.canopy,
      container: rig.container,
      aad: rig.aad,
      reserve: rig.reserve,
      lineset: rig.lineset,
      jumpType,
      notes,

      signed: false,
    }
  
    setLoading(true)
    try {
      const id = await addJump(user.uid, newJump)
      if (onAdded) onAdded({ id, ...newJump, createdAt: new Date().toISOString() })
      // reset form
      setDropzone(profile?.dropzone || '')

      setJumpType('')
      setNotes('')
      setDate(new Date().toISOString())
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

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
        <Select
          label="Rig"
          placeholder="Select a rig"
          data={rigs.map(r => ({
            value: r.id!,       // unique string ID for the rig
            label: r.container // user-friendly label
          }))}
          value={rig?.id || null}           // selected rig's id
          onChange={(id) => {
            // find the full rig object by its id
            const selected = rigs.find(r => r.id === id) || null
            setRig(selected)
          }}
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