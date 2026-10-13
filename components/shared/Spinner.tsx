import React from "react";

export default function Spinner({ message = "Loading dashboard..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative w-12 h-12 mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#F3EDE6] border-t-[#8B7355] animate-spin" />
      </div>
      <p className="text-sm font-medium text-[#8B7355] animate-pulse">{message}</p>
    </div>
  );
}
