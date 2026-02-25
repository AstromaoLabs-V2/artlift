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
    <header className="sticky top-0 z-40 h-14 flex bg-[#F8F8F8]">
      <nav
        className="mx-auto w-full max-w-160 sm:max-w-160 md:max-w-3xl lg:max-w-5xl xl:max-w-246 
      flex flex-row items-center justify-between
      rounded-full
border border-zinc-200
bg-white/50
backdrop-blur-2xl backdrop-opacity-90
px-5 py-2.5
shadow-[0px_148px_41px_rgba(0,0,0,0),0px_94px_38px_rgba(0,0,0,0),0px_53px_32px_rgba(0,0,0,0.01),0px_24px_24px_rgba(0,0,0,0.02),0px_6px_13px_rgba(0,0,0,0.02)]
"
      >
        {/* thiswill be the logo icon -kai */}
        <div className="hidden lg:flex items-center gap-2 px-4 py-1">
          <button className="size-8 rounded-full bg-white flex justify-center items-center">
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
                    ? "block rounded-full px-3 py-2 text-sm leading-5 font-medium text-zinc-600"
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
          <div className="hidden lg:inline-flex items-center rounded-full border p-1 bg-white/20 backdrop-blur-[10px] border-b border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
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
                  ? "bg-blue-500/50 border border-blue-400"
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
