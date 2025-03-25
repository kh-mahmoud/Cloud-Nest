"use client"

import { navItems } from '@/constants';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';


type SidebarProps = {
  fullName: string,
  avatar: string,
  email: string
}

const Sidebar = ({ fullName, avatar, email }: SidebarProps) => {
  const path = usePathname();

  return (
    <div className='sidebar !h-auto border-r-2 border-light-200/20'>
      <Link href={"/"}>
        <Image src={"/assets/icons/logo-full.svg"} alt='logo' width={160} height={60} className='hidden lg:block' />
        <Image src={"/assets/icons/logo.png"} alt='logo' width={52} height={52} className='lg:hidden' />
      </Link>

      <nav className='sidebar-nav'>
        <ul className='flex flex-col gap-4'>
          {navItems.map((item) => (

            <Link href={item.url} key={item.name} className='lg:w-full group'>
              <li className={cn('sidebar-nav-item group-hover:shad-active ', { 'shad-active': item.url == path })}>
                <Image src={item.icon} width={24} height={24} alt={item.name} className={cn('nav-icon group-hover:nav-icon-active', { 'nav-icon-active': item.url == path })} />
                <p className='hidden lg:block'>{item.name}</p>
              </li>
            </Link>
          ))}
        </ul>
      </nav>

      {/* <Image src={"/assets/images/files.png"} alt='log' width={105} height={120} className='hidden lg:block ml-4' /> */}

      <div className='sidebar-user-info'>
        <div className='rounded-full h-10 w-10 flex items-center justify-center overflow-hidden'>
          <Image src={avatar} width={44} height={44} alt='avatar' />
        </div>
        <div className='hidden lg:block'>
          <p className='subtitle-2 capitalize'>{fullName}</p>
          <p className='caption'>{email}</p>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
