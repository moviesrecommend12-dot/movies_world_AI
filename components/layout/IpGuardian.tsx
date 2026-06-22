'use client';

import React, { useEffect } from 'react';
import { useIpStore } from '@/store/ipStore';
import IpDialog from './IpDialog';

interface IpGuardianProps {
  children: React.ReactNode;
}

export default function IpGuardian({ children }: IpGuardianProps) {
  const { isRestricted, checkLocation } = useIpStore();

  useEffect(() => {
    checkLocation();
  }, [checkLocation]);

  return (
    <>
      {isRestricted && <IpDialog />}
      <div
        className={
          isRestricted
            ? 'pointer-events-none blur-md select-none transition-all duration-500 w-full min-h-screen flex flex-col'
            : 'w-full min-h-screen flex flex-col'
        }
      >
        {children}
      </div>
    </>
  );
}