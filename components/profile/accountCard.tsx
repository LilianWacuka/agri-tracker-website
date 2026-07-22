"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/authContext";

export default function AccountCard() {

  const { logout } = useAuth();

  return (
    <Card>

      <CardHeader>
        <CardTitle>
          Account
        </CardTitle>
      </CardHeader>

      <CardContent>

        <Button
          variant="destructive"
          onClick={logout}
        >
          Logout
        </Button>

      </CardContent>

    </Card>
  );
}