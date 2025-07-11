"use client"

import Image from 'next/image'
import React, { useState } from 'react'
import HomeCard from './HomeCard'
import { useRouter } from 'next/navigation'
import MeetingModal from './MeetingModal'
import { useUser } from '@clerk/nextjs'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { toast } from 'sonner'
import { Textarea } from "@/components/ui/textarea"
import ReactDatePicker from "react-datepicker"
import { Input } from "@/components/ui/input"

const MeetingOptions = () => {

    const router = useRouter();

    const [meetingState , setMeetingState] = useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()

    const {user} = useUser();

    const client = useStreamVideoClient();
    const [values, setValues] = useState({
        dateTime: new Date(),
        description: '',
        link: ''
    })

    const[callDetails, setCallDetails] = useState<Call>()
    

    const createMeeting = async() => {

        if(!client || !user) return;

        try {

            if(!values.dateTime){
                toast.error("Please select date and time")

                return;
            }

            const id = crypto.randomUUID();

            const call = client.call('default' , id);

            if(!call) throw new Error('Failed to create call')
            
            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();

            const description = values.description || 'Instant Meeting';

            await call.getOrCreate({
                data:{
                    starts_at: startsAt,
                    custom:{
                        description
                    }
                }
            })

            setCallDetails(call);

            if(!values.description){
                router.push(`/meeting/${call.id}`)
            }

            toast.success("Meeting generated successfully")
            
        } catch (error) {

            console.log(error);

            toast.error("Failed to create meeting")
            
        }
        
    }

    // Function to handle joining a meeting
    const handleJoinMeeting = () => {
        if (!values.link) {
            toast.error("Please enter a meeting link");
            return;
        }

        try {
            let cleanLink = values.link.trim();
            
            // Check if it's a full URL with protocol
            if (cleanLink.startsWith('http://') || cleanLink.startsWith('https://')) {
                const url = new URL(cleanLink);
                const path = url.pathname + url.search; // Include query parameters
                router.push(path);
            } 
            // Check if it's a domain without protocol (like sensaischeduler.vercel.app/meeting/...)
            else if (cleanLink.includes('.vercel.app') || cleanLink.includes('.com') || cleanLink.includes('.net') || cleanLink.includes('.') && cleanLink.includes('/')) {
                // Extract everything after the domain
                const parts = cleanLink.split('/');
                const domainIndex = parts.findIndex(part => part.includes('.'));
                if (domainIndex !== -1 && domainIndex < parts.length - 1) {
                    const pathParts = parts.slice(domainIndex + 1);
                    const path = '/' + pathParts.join('/');
                    router.push(path);
                } else {
                    // Fallback: try to find meeting path
                    const meetingIndex = cleanLink.indexOf('/meeting/');
                    if (meetingIndex !== -1) {
                        const path = cleanLink.substring(meetingIndex);
                        router.push(path);
                    } else {
                        throw new Error('Invalid link format');
                    }
                }
            }
            // Check if it's already a path
            else if (cleanLink.startsWith('/')) {
                router.push(cleanLink);
            } 
            // Handle meeting ID or partial path
            else {
                cleanLink = cleanLink.replace(/^\/+/, ''); // Remove leading slashes
                if (cleanLink.startsWith('meeting/')) {
                    router.push(`/${cleanLink}`);
                } else {
                    router.push(`/meeting/${cleanLink}`);
                }
            }
        } catch (error) {
            console.error('Error parsing meeting link:', error);
            toast.error("Invalid meeting link format");
        }
    };

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>

        <HomeCard 
            img = '/icons/add-meeting.svg'
            className='bg-orange-1'
            title = "New Meeting"
            description = "Start an instant meeting"
            handleClick = {() => setMeetingState('isInstantMeeting')}
        />

         <HomeCard
            img="/icons/join-meeting.svg"
            title="Join Meeting"
            description="via invitation link"
            className="bg-blue-1"
            handleClick={() => setMeetingState('isJoiningMeeting')}
        />

        <HomeCard 
            img = '/icons/schedule.svg'
            title = "Schedule Meeting"
            description = "Schedule your meeting seamlessly"
             className="bg-purple-1"
            handleClick = {() => setMeetingState('isScheduleMeeting')}
        />

        <HomeCard 
            img = '/icons/recordings.svg'
            title = "View Recordings"
            description = "View your recorded meetings"
            className="bg-yellow-1"
            handleClick = {() => router.push("/recordings")}
        />

        {!callDetails ? (
            <MeetingModal 
            isOpen = {meetingState === 'isScheduleMeeting'}
            onClose = {() => setMeetingState(undefined)}
            title = "Create Meeting"
            handleClick = {createMeeting}
            >

                <div className='flex flex-col gap-2.5'>
                    <label className='text-base text-normal leading-[22px] text-sky-2'>Add a description</label>

                    <Textarea className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0' onChange={(e) => {
                        setValues({...values, description: e.target.value})
                    }} />

                    

                </div>

                <div className='flex w-full flex-col gap-2.5'>
                    <label className='text-base text-normal leading-[22px] text-sky-2'>
                        Select Date and Time
                    </label>

                    <ReactDatePicker 
                    selected={values.dateTime}
                    onChange={(date) => setValues({
                        ...values, dateTime: date!
                    })}
                    showTimeSelect
                    timeFormat='HH:mm'
                    timeIntervals={15}
                    timeCaption='time'
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className='w-full rounded bg-dark-3 p-2 focus:outline-none'
                    />
                    

                </div>


            </MeetingModal> 
        ) : 
        (
            <MeetingModal 
            isOpen = {meetingState === 'isScheduleMeeting'}
            onClose = {() => setMeetingState(undefined)}
            title = "Meeting Created"
            className = "text-center"
            handleClick = {() => {
                navigator.clipboard.writeText(meetingLink);
                toast.success("Link copied");
            }}

            image = "/icons/checked.svg"
            buttonIcon = "/icons/copy.svg"
            buttonText = "Copy Meeting Link"
            />


            
        )
        }

        <MeetingModal 
        isOpen = {meetingState === 'isInstantMeeting'}
        onClose = {() => setMeetingState(undefined)}
        title = "Start an Instant Meeting"
        className = "text-center"
        buttonText = "Start Meeting"
        handleClick = {createMeeting}
        />

        <MeetingModal 
        isOpen = {meetingState === 'isJoiningMeeting'}
        onClose = {() => setMeetingState(undefined)}
        title = "Enter the Meeting Link"
        className = "text-center"
        buttonText = "Join Meeting"
        handleClick = {handleJoinMeeting}
        > 

        <Input 
        placeholder='Your Meeting Link' 
        className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
        onChange={(e) => setValues({...values, link:e.target.value})}
        />
        
        </MeetingModal>


    </section>
  )
}

export default MeetingOptions
