"use client"

import { DeviceSettings, useCall, VideoPreview } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { useUser } from '@clerk/nextjs';

const MeetingSetup = ({isSetupComplete} : {isSetupComplete: (value: boolean) => void}) => {
    
    const [isMicCamToggledOn , setIsMicCamToggledOn] = useState(false);
    
    const call = useCall();
    const { user } = useUser();
    
    if(!call){
        throw new Error("Use Call must be used within the Stream Component")
    }
    
    useEffect(() => {
        if(isMicCamToggledOn){
            call?.camera.disable(); 
            call?.microphone.disable();
        } 
        else{
           call?.camera.enable();
           call?.microphone.enable(); 
        }
    } , [isMicCamToggledOn , call?.camera , call?.microphone])

    return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-6 text-white'>
        <h1 className='text-2xl font-bold'>Meeting Setup</h1>
        
        {/* Responsive Video Preview Container */}
        <div className='w-full max-w-sm md:max-w-md lg:max-w-lg xl:max-w-md 2xl:max-w-lg rounded-xl overflow-hidden flex items-center justify-center min-h-[300px] bg-gray-800 relative'>
            {isMicCamToggledOn ? (
                // Show profile photo when camera is off
                <div className='flex flex-col items-center justify-center gap-3'>
                    <div className='w-32 h-32 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center'>
                        {user?.imageUrl ? (
                            <img 
                                src={user.imageUrl} 
                                alt="Profile" 
                                className='w-full h-full object-cover'
                            />
                        ) : (
                            <div className='w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold'>
                                {user?.firstName?.charAt(0) || user?.emailAddresses?.[0]?.emailAddress?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>
                    <p className='text-sm text-gray-300'>Camera is off</p>
                </div>
            ) : (
                // Show video preview when camera is on
                <VideoPreview />
            )}
        </div>
        
        <div className='flex items-center justify-center gap-3 flex-wrap'>
            <label className='flex items-center justify-center gap-2 font-medium'>
                <input
                type='checkbox'
                checked = {isMicCamToggledOn}
                onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
                />
                Join with Mic and Camera Off
            </label>
            <DeviceSettings />    
        </div>
        
        <Button className='rounded-md bg-green-500 px-4 py-2.5 cursor-pointer hover:bg-green-700'
        onClick={() => {
            call.join(); 
            isSetupComplete(true)
        }}>
            Join Meeting
        </Button>
    </div>
  )
}

export default MeetingSetup