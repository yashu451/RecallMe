import React from 'react';

/**
 * Ambient background lighting with subtle floating warm depth orbs.
 * Adds tactile depth to empty background areas without distracting from typography or content.
 */
export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden" aria-hidden="true">
      {/* Top right floating warm sand ambient glow */}
      <div 
        className="ambient-orb-1 absolute -top-40 -right-40 w-[550px] h-[550px] rounded-full blur-[110px]"
        style={{
          background: 'radial-gradient(circle, rgba(232, 183, 134, 0.16) 0%, rgba(247, 243, 237, 0) 70%)',
        }}
      />

      {/* Bottom left floating subtle burnt orange ambient glow */}
      <div 
        className="ambient-orb-2 absolute -bottom-48 -left-48 w-[600px] h-[600px] rounded-full blur-[130px]"
        style={{
          background: 'radial-gradient(circle, rgba(198, 93, 50, 0.08) 0%, rgba(247, 243, 237, 0) 70%)',
        }}
      />

      {/* Subtle fine texture overlay for paper depth */}
      <div 
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(#222222 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />
    </div>
  );
}

