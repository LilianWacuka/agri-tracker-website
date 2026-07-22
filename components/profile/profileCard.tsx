"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ProfileCardProps {
  userName: string;
  email: string;
}

export default function ProfileCard({
  userName,
  email,
}: ProfileCardProps) {
  const initials = userName
    ? userName
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <Card>
      <CardContent className="flex flex-col items-center py-8">

        <Avatar className="h-24 w-24">
          <AvatarFallback className="bg-green-100 text-green-700 text-2xl">
            {initials}
          </AvatarFallback>
        </Avatar>

        <h2 className="mt-4 text-xl font-bold">
          {userName}
        </h2>

        <p className="text-muted-foreground">
          {email}
        </p>

      </CardContent>
    </Card>
  );
}