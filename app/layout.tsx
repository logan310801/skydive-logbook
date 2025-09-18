"use client";

import type { Metadata } from "next";
import { MantineProvider, AppShell } from "@mantine/core";
import { useDisclosure, useHeadroom } from "@mantine/hooks";
import AuthProvider from "@/components/contexts/AuthProvider";
import HeaderElement from "@/components/HeaderElement";
import NavBar from "@/components/NavBar";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { UserProfileProvider } from "@/components/contexts/UserProfileContext";
import RoleRedirect from "@/components/redirects/RoleRedirect";
import { Notifications } from "@mantine/notifications";
import '@mantine/notifications/styles.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [opened, { toggle }] = useDisclosure();
  const pinned = useHeadroom({ fixedAt: 120 });

  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>
        <MantineProvider defaultColorScheme="dark">
          <AuthProvider>
            <UserProfileProvider>
              <AppShell
                header={{ height: 60, collapsed: !pinned }}
                navbar={{
                  width: 200,
                  breakpoint: "sm",
                  collapsed: { mobile: !opened },
                }}
                padding="md"
              >
                {/* Header */}
                <HeaderElement opened={opened} toggle={toggle} />

                {/* Navbar */}
                <NavBar toggle={toggle}/>

                {/* Page content */}
                <AppShell.Main>
                <Notifications />
                  <RoleRedirect>
                    {children}
                  </RoleRedirect>
                </AppShell.Main>
              </AppShell>
            </UserProfileProvider>
          </AuthProvider>
        </MantineProvider>
      </body>
    </html>
  );
}