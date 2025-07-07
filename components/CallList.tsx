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

    // Helper function to safely get meeting title
    const getMeetingTitle = (meeting: Call | CallRecording) => {
        if (type === 'recordings') {
            const recording = meeting as CallRecording;
            return recording.filename?.substring(0, 20) || 'Recording';
        } else {
            const call = meeting as Call;
            return call.state?.custom?.description?.substring(0, 60) || 
                   call.custom?.description?.substring(0, 60) || 
                   'No description';
        }
    };

    // Helper function to safely get meeting date
    const getMeetingDate = (meeting: Call | CallRecording) => {
        if (type === 'recordings') {
            const recording = meeting as CallRecording;
            return recording.start_time ? new Date(recording.start_time).toLocaleString() : 'No date';
        } else {
            const call = meeting as Call;
            return call.state?.startsAt ? new Date(call.state.startsAt).toLocaleString() :
                   call.starts_at ? new Date(call.starts_at).toLocaleString() : 'No date';
        }
    };

    // Helper function to safely get meeting ID
    const getMeetingId = (meeting: Call | CallRecording) => {
        if (type === 'recordings') {
            const recording = meeting as CallRecording;
            return recording.url || '';
        } else {
            const call = meeting as Call;
            return call.id || '';
        }
    };

    return (
        <div className='grid grid-cols-1 gap-5 xl:grid-cols-2'>
           {calls && calls.length > 0 ? calls.map((meeting: Call | CallRecording, index) => (
            <MeetingCard 
                key={getMeetingId(meeting) || index}
                icon={
                    type === 'ended'
                    ? '/icons/previous.svg'
                    : type === 'upcoming'
                    ? '/icons/upcoming.svg'
                    : '/icons/recordings.svg'
                }
                title={getMeetingTitle(meeting)}
                date={getMeetingDate(meeting)}
                isPreviousMeeting={type === 'ended'}
                buttonIcon1={type === 'recordings' ? '/icons/play.svg' : undefined}
                buttonText={type === 'recordings' ? 'Play' : 'Start Meeting'}
                handleClick={
                    type === 'recordings' 
                        ? () => router.push(`${(meeting as CallRecording).url}`) 
                        : () => router.push(`/meeting/${(meeting as Call).id}`)
                }
                link={
                    type === 'recordings' 
                        ? (meeting as CallRecording).url 
                        : `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${(meeting as Call).id}`
                }
            />
          )) : (
            <h1>{callsMessage}</h1>
          )}
                   
        </div>
    )
}

export default CallList
