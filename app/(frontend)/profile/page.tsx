"use client";

import { useEffect, useState } from "react";

import ProfileCard from "@/components/profile/profileCard";
import PersonalInfoCard from "@/components/profile//personalInfoCard";
import AccountCard from "@/components/profile/accountCard";

import { useAuth } from "@/context/authContext";

interface User {

  id: string;

  userName: string;

  email: string;

  fullName: string;

  farmName: string;

  phoneNumber: string;
}

export default function ProfilePage() {

  const { userId } = useAuth();

  const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  async function fetchProfile() {

    if (!userId) return;

    try {

      const response = await fetch( `/api/profile?userId=${userId}`);

      const data = await response.json(); 
      setUser(data.user);

    } catch (error) { console.error(error);

    } finally {

      setLoading(false);

    }
  }

  useEffect(() => { fetchProfile(); }, [userId]);

  if (loading) {

    return (

      <div className="flex justify-center p-10">

        Loading profile...

      </div>

    );
  }

  if (!user) {

    return (

      <div className="flex justify-center p-10">

        User not found

      </div>

    );
  }

  return (

    <div className="max-w-7xl mx-auto p-8">

      <h1 className="text-3xl font-bold mb-8">

        My Profile

      </h1>

      <div className="grid lg:grid-cols-3 gap-6">

        <ProfileCard
          userName={user.userName}
          email={user.email}
        />

        <div className="lg:col-span-2">

          <PersonalInfoCard
            userId={user.id}
            userName={user.userName}
            email={user.email}
            fullName={user.fullName}
            farmName={user.farmName}
            phoneNumber={user.phoneNumber}
            onUpdate={fetchProfile}
          />

        </div>

      </div>

      <div className="mt-6">

        <AccountCard />

      </div>

    </div>

  );
}