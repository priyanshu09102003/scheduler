"use client"

import { cn } from '@/lib/utils'
import { 
  CallControls, 
  CallingState, 
  CallParticipantsList, 
  CallStatsButton, 
  PaginatedGridLayout, 
  SpeakerLayout, 
  useCallStateHooks,
  useCall
} from '@stream-io/video-react-sdk'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList, Users } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import EndCallButton from './EndCallButton'
import Loader from './Loader'

type CallLayoutType = 'grid' | 'speaker-left' | 'speaker-right'

const MeetingRoom = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isPersonalRoom = !!searchParams.get('personal')
    const [layout, setLayout] = useState<CallLayoutType>('speaker-left')
    const [showParticipants, setShowParticipants] = useState(false)
    const { useCallCallingState } = useCallStateHooks();
    const callingState = useCallCallingState();
    const call = useCall();

    // Method 1: Listen for calling state changes and cleanup
    useEffect(() => {
        if (callingState === CallingState.LEFT) {
            // Clean up media devices before redirecting
            if (call) {
                call.camera.disable();
                call.microphone.disable();
            }
            // Small delay to ensure cleanup completes
            setTimeout(() => {
                router.push('/');
            }, 100);
        }
    }, [callingState, router, call]);

    // Cleanup effect when component unmounts
    useEffect(() => {
        return () => {
            // Cleanup media devices when component unmounts
            if (call) {
                call.camera.disable();
                call.microphone.disable();
            }
        };
    }, [call]);

    if (callingState !== CallingState.JOINED) return <Loader />

    const CallLayout = () => {
        switch (layout) {
            case 'grid':
                return <PaginatedGridLayout />
            case 'speaker-right':
                return <SpeakerLayout participantsBarPosition="left" />
            default:
                return <SpeakerLayout participantsBarPosition="right" />
        }
    }

    return (
        <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
            <div className='relative flex size-full items-center justify-center'>
                <div className='flex size-full max-w-[1000px] items-center'>
                    <CallLayout />
                </div>
                <div className={cn('h-[calc(100vh-86px)] hidden ml-2', {
                    'show-block': showParticipants
                })}>
                    <CallParticipantsList onClose={() => setShowParticipants(false)} />
                </div>
            </div>

            <div className='fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap'>
                <CallControls />
                <DropdownMenu>
                    <div className='flex items-center'>
                        <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-4 hover:bg-[#4c535b]'>
                            <LayoutList size={20} className='text-white' />
                        </DropdownMenuTrigger>
                    </div>

                    <DropdownMenuContent className='border-dark-1 bg-dark-1 text-white'>
                        {['Grid', 'Speaker-Left', 'Speaker-Right'].map((item, index) => (
                            <div key={index}>
                                <DropdownMenuItem className='cursor-pointer' onClick={() => {
                                    setLayout(item.toLowerCase() as CallLayoutType)
                                }}>
                                    {item}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className='border-dark-1' />
                            </div>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <CallStatsButton />
                <button onClick={() => setShowParticipants((prev) => !prev)}>
                    <div className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-4 hover:bg-[#4c535b]'>
                        <Users size={20} className='text-white' />
                    </div>
                </button>

                {!isPersonalRoom &&
                    <EndCallButton />
                }
            </div>
        </section>
    )
}

export default MeetingRoom