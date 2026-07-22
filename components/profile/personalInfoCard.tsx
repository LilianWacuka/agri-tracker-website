"use client";

import { useState } from "react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Props {
  userId: string;

  userName: string;
  email: string;
  fullName: string;
  farmName: string;
  phoneNumber: string;

  onUpdate: () => void;
}

export default function PersonalInfoCard({
  userId,
  userName,
  email,
  fullName,
  farmName,
  phoneNumber,
  onUpdate,
}: Props) {

  const [form, setForm] = useState({
    userName,
    email,
    fullName,
    farmName,
    phoneNumber,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          userId,
          ...form,
        }),
      });

      const data = await response.json();

      alert(data.message);

      onUpdate();

    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <Card>

      <CardHeader>
        <CardTitle>
          Personal Information
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">

        <div>
          <Label>Username</Label>

          <Input
            name="userName"
            value={form.userName}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Email</Label>

          <Input
            name="email"
            value={form.email}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Full Name</Label>

          <Input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Phone Number</Label>

          <Input
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div>
          <Label>Farm Name</Label>

          <Input
            name="farmName"
            value={form.farmName}
            onChange={handleChange}
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={loading}
          className="w-full"
        >
          {loading ? "Saving..." : "Save Changes"}
        </Button>

      </CardContent>
    </Card>
  );
}