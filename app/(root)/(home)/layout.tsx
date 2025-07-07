
import NavigationBar from '@/components/NavigationBar'
import SidebarComponent from '@/components/SidebarComponent'
import React, { ReactNode } from 'react'
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: "SensAI - Scheduler",
  description: "A video conferencng app",
  icons:{
    icon: "/icons/logo.svg"
  }
};
const HomeLayout = ({children} : {children: ReactNode}) => {
  return (

    //Structuring the home layout
    <main className='relative'>
        <NavigationBar />

        <div className='flex'>

            <SidebarComponent />

            <section className='flex min-h-screen flex-1 flex-col px-6 pb-6 pt-28 max-md:pb-14 sm:px-14'>

                <div className='w-full'>

                    {children}

                </div>
                
            </section>

        </div>


    </main>
  )
}

export default HomeLayout
