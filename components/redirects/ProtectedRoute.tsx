"use client";

import { useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useUserProfile } from "@/components/contexts/UserProfileContext";
import { AuthContext } from "@/components/contexts/AuthProvider";

interface ProtectedRouteProps {
  allowedRoles: string[];
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ allowedRoles, children, redirectTo = "/" }: ProtectedRouteProps) {
  const { profile, loading } = useUserProfile();
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !profile || !allowedRoles.includes(profile.role))) {
      router.replace(redirectTo);
    }
  }, [user, profile, loading, allowedRoles, router, redirectTo]);

  if (loading || !user || !profile) return null; // or a loading spinner

  return <>{children}</>;
}