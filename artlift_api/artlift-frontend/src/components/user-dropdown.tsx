"use client";

import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "./ui/avatar";
import { User } from "@/types/props";
import { logoutAction } from "@/app/(auth)/auth";
import {
  LogInIcon,
  LogOutIcon,
  PencilRuler,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function UserDropdown() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    fetch("http://127.0.0.1:8000/current_user/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        else return null;
      })
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  const logout = async () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    await logoutAction();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar
          className="size-9 cursor-pointer rounded-full 
             backdrop-blur-[10px] 
             bg-white/20 
             border border-white/30 
             shadow-[0_4px_30px_rgba(0,0,0,0.1)]
             flex items-center justify-center"
        >
          <AvatarImage
            src={user?.artist?.img || "/default-avatar.png"}
            alt={user?.username || "Guest"}
            className="object-cover"
          />
          <AvatarFallback className="bg-transparent text-white/80 font-medium">
            {user?.username?.[0] || "G"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        {user ? (
          <>
            <DropdownMenuItem>{user.username}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                router.push("/dashboard/me");
              }}
            >
              <UserIcon />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PencilRuler />
              Artworks
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SettingsIcon />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={logout}>
              <LogOutIcon />
              Logout
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem>
              <UserIcon />
              Guest
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/signin")}>
              <LogInIcon />
              Login
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
