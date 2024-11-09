"use client"
import Chat from '@/components/Chat';

export default function Dashboard() {
  
  return (
    <div className="flex">
      <div className="flex-1 pt-[50px]">
        <Chat/>
      </div>
    </div>
  );
}