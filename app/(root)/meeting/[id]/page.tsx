"use client"

import Loader from '@/components/Loader';
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import { useGetCallbyId } from '@/hooks/useGetCallbyId';
import { useUser } from '@clerk/nextjs'
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useState } from 'react';


const Meeting = ({params : {id}}: {params: {id: string}}) => {

  const {user , isLoaded} = useUser();
  const [setupComplete , isSetupComplete] = useState(false);

  const {call , isCallLoading} = useGetCallbyId(id);

  if(!isLoaded || isCallLoading) return <Loader />

  return (
   
    <main className='h-screen w-full'>

      <StreamCall call={call}>
        <StreamTheme>

          {!setupComplete ? (
            <MeetingSetup isSetupComplete = {isSetupComplete} />
          ) : 
            <MeetingRoom />
        }
          

        </StreamTheme>
      </StreamCall>

    </main>
  )
}

export default Meeting
