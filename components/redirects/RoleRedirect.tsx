"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/components/contexts/UserProfileContext";
import { AuthContext } from "@/components/contexts/AuthProvider";
import { Center, Loader } from "@mantine/core";

interface RoleRedirectProps {
  children: React.ReactNode;
  fallback?: React.ReactNode; // optional: show something while loading
}

export default function RoleRedirect({ children, fallback }: RoleRedirectProps) {
  const { profile, loading: profileLoading } = useUserProfile();
  const { user, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();

  const loading = profileLoading || authLoading;

  // Redirect effect
  useEffect(() => {
    console.log(profile?.role)
    if (!loading && user && profile) {
      if (profile.role === "admin") {
        router.replace("/admin");
      }
      // You can add dropzone, instructor, etc. here
    }
  }, [profile, user, loading, router]);

  // Show spinner while auth/profile are loading
  if (loading) {
    return fallback ?? (
      <Center style={{ height: "100%" }}>
        <Loader size="lg" />
      </Center>
    );
  }

  // If not logged in, just show the page (e.g. /login)
  if (!user) {
    return <>{children}</>;
  }

  // If logged in, children will be immediately replaced by redirect
  return <>{children}</>;
}