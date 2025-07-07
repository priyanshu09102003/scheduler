"use client"
import CallList from '@/components/CallList'
import MeetingOptions from '@/components/MeetingOptions'
import { useUser } from '@clerk/nextjs'
import { useGetCalls } from '@/hooks/useGetCalls'
import React, { useState, useEffect } from 'react'

const Home = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  
  useEffect(() => {
    // Update time immediately
    setCurrentTime(new Date())
    
    // Set up interval to update every second
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    // Cleanup interval on component unmount
    return () => clearInterval(timer)
  }, [])

  const time = currentTime.toLocaleTimeString('en-US', {
    hour: '2-digit', 
    minute: '2-digit'
  })
  
  const date = (new Intl.DateTimeFormat('en-US', {dateStyle: 'full'})).format(currentTime)

  const {user} = useUser();
  const getUserName = user?.firstName || user?.fullName || 'User'

  // Get the calls data
  const {upcomingCalls} = useGetCalls();
  
  // Get only the 2 most recent upcoming meetings
  const recentUpcomingCalls = upcomingCalls?.slice(0, 2) || [];

  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <div className='h-[300px] w-full rounded-[20px] bg-hero bg-cover'>
        <div className='flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11'>
          <h2 className='glassmorphism max-w-[270px] rounded py-2 text-center text-base font-normal'>
            Welcome, <span className='font-semibold'>{getUserName}</span>
          </h2>
          <div className='flex flex-col gap-2'>
            <h1 className='text-4xl font-extrabold lg:text-7xl'>
              {time}
            </h1>
            <p className='text-lg font-medium text-sky-1 lg:text-2xl'>
              {date}
            </p>
          </div>
        </div>
      </div>
      <MeetingOptions />
      {recentUpcomingCalls.length > 0 && (
        <>
          <h2 className='text-2xl font-extrabold lg:text-3xl'>Recently Added Meetings</h2>
          <CallList type='upcoming' limitedCalls={recentUpcomingCalls} />
        </>
      )}
    </section>
  )
}

export default Home