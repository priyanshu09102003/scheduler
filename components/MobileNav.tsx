"use client"

import React from 'react'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'



const MobileNav = () => {
    const pathname = usePathname();
  return (
    <section className='w-full max-w-[264px]'>
        <Sheet>
            <SheetTrigger asChild>
                <Image 
                src="/icons/hamburger.svg"
                className='cursor-pointer sm:hidden'
                alt='hamburger'
                width={36}
                height={36}
                />
            </SheetTrigger>


            <SheetContent side='left' className='border-none bg-dark-1'>
                
                <Link className='flex items-center gap-1 mt-3' href='/'>

                    <Image 
                        src="/icons/logo.svg"
                        width={32}
                        height={32}
                        alt='logo'
                        className='max-sm:size-10'
                    />

                    <p className='text-[26px] font-extrabold text-white'>SCHEDULER</p>
        
                </Link>

                <div className='flex h-[calc(100vh-72px)] flex-col justify-between overflow-y-auto'>

                    <SheetClose asChild>

                        <section className='flex h-full flex-col gap-6 pt-16 text-white'>

                            {sidebarLinks.map((link) => {
                                        const isActive = pathname === link.route;
                            
                                        return(
                                            <SheetClose asChild key={link.route}>
                                                <Link href={link.route} key={link.label} className={cn('flex gap-4 items-center p-4 rounded-lg w-full max-w-60', {
                                                'bg-blue-1': isActive
                                                    })}>
                            
                                                        <Image src={link.imgUrl} 
                                                        alt='link'
                                                        width={20}
                                                        height={20}
                                                        />
                                        
                                                        <p className='font-semibold'>
                                                            {link.label}
                                                        </p>
                            
                                                </Link>
                                            </SheetClose>
                                        )
                                      })}

                        </section>

                    </SheetClose>

                </div>
                
            </SheetContent>
        </Sheet>



    </section>
  )
}

export default MobileNav
