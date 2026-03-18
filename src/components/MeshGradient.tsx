"use client";

interface Props {
  colors: [string, string, string, string];
}

export default function MeshGradient({ colors }: Props) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none transition-all duration-1000">
      <div
        className="absolute w-[150%] h-[150%] -top-[25%] -left-[25%] opacity-40 animate-mesh gpu"
        style={{
          background: `
            radial-gradient(at 0%   0%,   ${colors[0]} 0px, transparent 50%),
            radial-gradient(at 50%  0%,   ${colors[1]} 0px, transparent 50%),
            radial-gradient(at 100% 0%,   ${colors[2]} 0px, transparent 50%),
            radial-gradient(at 0%   50%,  ${colors[1]} 0px, transparent 50%),
            radial-gradient(at 50%  50%,  ${colors[3]} 0px, transparent 50%),
            radial-gradient(at 100% 50%,  ${colors[0]} 0px, transparent 50%),
            radial-gradient(at 0%   100%, ${colors[2]} 0px, transparent 50%),
            radial-gradient(at 50%  100%, ${colors[1]} 0px, transparent 50%),
            radial-gradient(at 100% 100%, ${colors[0]} 0px, transparent 50%)
          `,
        }}
      />
    </div>
  );
}
