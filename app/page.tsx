"use client";

import { useContext, useEffect } from "react";
import { AuthContext } from "@/components/contexts/AuthProvider";
import { useRouter } from "next/navigation";

import { Grid, Loader, Center } from "@mantine/core";
import CRUD from "@/components/CRUD";
import MainSection from "@/components/MainSection";

export default function HomePage() {
  const { user, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return <Loader />;
  if (!user) return null;

  return (
    <Center >
      <Grid>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <CRUD />
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <MainSection />
        </Grid.Col>

      </Grid>
    </Center>
  );
}