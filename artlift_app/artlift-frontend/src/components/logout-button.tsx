"use client";

import { logoutAction } from "@/app/(auth)/auth";
import { Button } from "./ui/button";

export default function LogoutButton() {
  const logout = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    await logoutAction();
  };

  return (
    <Button onClick={logout} className="bg-red">
      Logout
    </Button>
  );
}