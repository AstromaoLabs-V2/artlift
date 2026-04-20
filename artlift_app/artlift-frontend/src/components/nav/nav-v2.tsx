"use client";

import { Menu, Moon, Paintbrush, SunMedium, User } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import UserDropdown from "../user-dropdown";
import { links } from "./navlinks";
import { useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";

export default function NavBarV2() {
  const pathname = usePathname();

  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { toggleSidebar } = useSidebar();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;



  return (
    <header className="sticky top-0 z-40 h-14 flex rounded-full">
      <nav
        className="glass flex h-full w-full items-center justify-between rounded-full"
      >
        {/* thiswill be the logo icon -kai */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-1">
          <button className="size-8 rounded-full bg-purple flex justify-center items-center">
            <Paintbrush />
          </button>
        </div>

        {/* this is mobile menu hidden  -kai */}
        <div className="lg:hidden text-white px-3 py-1 rounded-lg">
          <Button onClick={toggleSidebar}>
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* links nav bar */}
        <div
          className="hidden relative
          lg:flex"
        >
          <div
          className="relative
          left-auto top-auto
          mt-0
         

          flex items-center
          w-auto

          rounded-none
          border-0
          bg-transparent
          p-0

          shadow-none"
          >
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={
                  pathname === link.href
                    ? "block rounded-full px-3 py-2 text-sm leading-5 font-medium bg-[radial-gradient(100%_100%_at_49.74%_0%,_#FFFFFF_0%,_#2C266C_91.83%)] backdrop-blur-[58px] text-white"
                    : "block rounded-full px-3 py-2 text-sm leading-5 font-medium text-zinc-600"
                }
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* this will be profile + theme buttons */}
        <div className="flex items-center gap-1.5">
          <div className=" lg:inline-flex items-center rounded-full border p-1 bg-white/20 backdrop-blur-[10px] border-b border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            <button
              onClick={() => setTheme("light")}
              className={`p-1.5 rounded-full transition ${
                resolvedTheme === "light"
                  ? "bg-white/25 border border-white/30"
                  : ""
              }`}
              aria-label="Light mode"
            >
              <SunMedium className="lucide lucide-sun text-white/80 size-4" />
            </button>

            <button
              onClick={() => setTheme("dark")}
              className={`p-1.5 rounded-full transition ${
                resolvedTheme === "dark"
                  ? "bg-border border border-blue-400"
                  : ""
              }`}
              aria-label="Dark mode"
            >
              <Moon className="lucide lucide-moon size-4 text-fd-muted-foreground" />
            </button>
          </div>
          {/* <button className="size-9 rounded-full flex justify-center items-center backdrop-blur-lg bg-background/80">
            <User size={22} />

          </button> */}
          <UserDropdown />
        </div>
      </nav>
    </header>
  );
}
