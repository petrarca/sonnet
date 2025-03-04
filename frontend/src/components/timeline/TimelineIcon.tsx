import React from 'react';
import { MedicalRecordType } from '../../types/types';

interface TimelineIconProps {
  type: MedicalRecordType;
  size?: 'sm' | 'md';
}

export const TimelineIcon: React.FC<TimelineIconProps> = ({ type, size = 'md' }) => {
  const iconClasses = size === 'sm' ? 
    "w-5 h-5 rounded-md flex items-center justify-center text-white" :
    "w-8 h-8 rounded-md flex items-center justify-center text-white";
  
  const icons = {
    [MedicalRecordType.DIAGNOSIS]: <div className={`${iconClasses} bg-[#E53E3E]`}>
      <svg className={size === 'sm' ? "w-3 h-3" : "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    </div>,
    [MedicalRecordType.LAB_RESULT]: <div className={`${iconClasses} bg-[#3182CE]`}>
      <svg className={size === 'sm' ? "w-3 h-3" : "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    </div>,
    [MedicalRecordType.COMPLAINT]: <div className={`${iconClasses} bg-[#D69E2E]`}>
      <svg className={size === 'sm' ? "w-3 h-3" : "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>,
    [MedicalRecordType.VITAL_SIGNS]: <div className={`${iconClasses} bg-[#38A169]`}>
      <svg className={size === 'sm' ? "w-3 h-3" : "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    </div>,
    [MedicalRecordType.MEDICATION]: <div className={`${iconClasses} bg-[#7C3AED]`}>
      <svg className={size === 'sm' ? "w-3 h-3" : "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    </div>,
    [MedicalRecordType.PROCEDURE]: <div className={`${iconClasses} bg-[#4F46E5]`}>
      <svg className={size === 'sm' ? "w-3 h-3" : "w-4 h-4"} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    </div>
  };

  return icons[type];
};
