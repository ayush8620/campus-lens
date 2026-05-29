"use client";

import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>
      <UserProfile
        path="/profile"
        routing="path"
        appearance={{
          elements: {
            rootBox: "w-full",
            card: "shadow-none border rounded-xl w-full",
          },
        }}
      />
    </div>
  );
}
