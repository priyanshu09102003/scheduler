//@ts-nocheck

"use client";

import { useGetCalls } from '@/hooks/useGetCalls'
import { Call, CallRecording } from '@stream-io/video-react-sdk';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import MeetingCard from './MeetingCard';
import Loader from './Loader';
import { toast } from 'sonner';

const CallList = ({type, limitedCalls} : {type: 'ended' | 'upcoming' | 'recordings', limitedCalls?: Call[]}) => {
    
    const {endedCalls , upcomingCalls , callRecordings , isLoading} = useGetCalls();
    const router = useRouter();
    const [recordings , setRecordings] = useState<CallRecording[]>([])
    
    const getCalls = () =>{
        switch (type) {
            case 'ended':
                return endedCalls;
                        
            case 'recordings':
                return recordings;
                        
            case 'upcoming':
                // Use limitedCalls if provided, otherwise use all upcomingCalls
                return limitedCalls || upcomingCalls;
            
            default:
                return[];
        }
    }
        
    const getNoCallsMessage = () =>{
        switch (type) {
            case 'ended':
                return 'No Previous Meetings';
                        
            case 'recordings':
                return 'No Recordings';
                        
            case 'upcoming':
                return "You don't have any Upcoming Meetings";
            
            default:
                return '';
        }
    }

    useEffect(() => {

        const fetchRecordings = async() => {

            try {

                const callData = await Promise.all(callRecordings.map((meeting) => meeting.queryRecordings()));

                const recordings = callData
                    .filter(call => call.recordings.length>0)
                    .flatMap(call => call.recordings)

                setRecordings(recordings);
                
            } catch (error) {

                toast.error("Try again later")
                
            }

               
        }

        if(type === 'recordings') fetchRecordings();

    }, [type , callRecordings])
    
    const calls = getCalls();
    const callsMessage = getNoCallsMessage();
    
    if(isLoading) return <Loader />

  return (
    <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
       {calls && calls.length > 0 ? calls.map((meeting: Call | CallRecording) => (
        <MeetingCard 
            key = {(meeting as Call).id}
            icon = {
                type === 'ended'
                ? '/icons/previous.svg'
                : type === 'upcoming'
                ? '/icons/upcoming.svg'
                : '/icons/recordings.svg'
            }
            title = {(meeting as Call).state?.custom.description.substring(0 , 60) || meeting.filename.substring(0 , 20) || 'No decription'}
            
            date = {meeting.state?.startsAt.toLocaleString() || meeting.start_time?.toLocaleString()}
            
            isPreviousMeeting = {type === 'ended'}
            
            buttonIcon1 = {type === 'recordings' ? '/icons/play.svg' : undefined}
            buttonText = {type === 'recordings' ? 'Play' : 'Start Meeting'}
                        
            handleClick = {type === 'recordings' ? () => router.push(`${meeting.url}`) : () => router.push(`/meeting/${meeting.id}`)}
            
            link = {type === 'recordings' ? meeting.url : `
                ${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${meeting.id}`}
        />
      )) : (
        <h1>{callsMessage}</h1>
      )}
              
    </div>
  )
}

export default CallList