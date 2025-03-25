"use client"

import Image from "next/image";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator"
import { navItems } from "@/constants";
import Link from "next/link";
import { cn, useMediaQuery } from "@/lib/utils";
import { Button } from "./ui/button";
import { signoutUser } from "@/lib/actions/user.action";
import { LogOut } from 'lucide-react';
import { FileUploader } from "./FileUploader";



type mobileNavProps = {
  fullName: string,
  avatar: string,
  email: string,
  $id: string,
  accountId: string
}

export default function MobileNav({ fullName, avatar, email, $id, accountId }: mobileNavProps) {

  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 640px)")

  const path = usePathname()

  // Close the sheet when the screen size reaches desktop width
  useEffect(() => {
    if (isDesktop) {
      setOpen(false);
    }
  }, [isDesktop]);



  return (
    <div className="mobile-header">
      <Image src={'/assets/icons/logo-full.svg'} alt="logo" width={120} height={52} />

      <Sheet onOpenChange={setOpen} open={open}>
        <SheetTrigger>
          <Image src={"/assets/icons/menu.svg"} alt="menu" width={30} height={30} />
        </SheetTrigger>
        <SheetContent className="shad-sheet px-3 h-screen ">
          <SheetTitle>
            <div className="header-user">
              <Image src={avatar} alt="avatar" width={44} height={44} />

              <div>
                <p className='subtitle-2 capitalize'>{fullName}</p>
                <p className='caption'>{email}</p>
              </div>

              <Separator className="mb-4 bg-light-200/20" />
            </div>
          </SheetTitle>

          <nav className="mobile-nav">
            <ul className="mobile-nav-list">
              {navItems.map((item) => (

                <Link href={item.url} key={item.name} className='lg:w-full group'>
                  <li className={cn('mobile-nav-item group-hover:shad-active ', { 'shad-active': item.url == path })}>
                    <Image src={item.icon} width={24} height={24} alt={item.name} className={cn('nav-icon group-hover:nav-icon-active', { 'nav-icon-active': item.url == path })} />
                    <p>{item.name}</p>
                  </li>
                </Link>
              ))}
            </ul>
          </nav>

          <Separator className="my-5 bg-light-200/20" />

          <div className="flex flex-col justify-between gap-5 pb-5">
            <FileUploader ownerId={$id} accountId={accountId} />

            <Button onClick={async () => await signoutUser()} type='submit' className='mobile-sign-out-button '>
              <LogOut width={24} height={24} className="text-brand" />
              <p>Logout</p>
            </Button>
          </div>

        </SheetContent>
      </Sheet>

    </div>
  );
}
