"use client"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { links } from "./nav/navlinks"

export function AppSidebar() {
  const { isMobile, openMobile, setOpenMobile } = useSidebar()
  
  return (
<<<<<<< HEAD
    <Sidebar>
=======
    <Sidebar
    >
>>>>>>> d2dc1eb9596fdd4cfc89d08f2e6f43604ef00e7a
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>ArtLift</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((item) => {
                const Icon = item.icon

                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild>
                      <a
                        href={item.href}
                        onClick={() => {
                          if (isMobile) setOpenMobile(false)
                        }}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.name}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
