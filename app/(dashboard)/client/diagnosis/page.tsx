"use client"
import SendForm from '@/components/FormClient';


export default function Dashboard() {
  
  return (
    <div className="flex">
      <div className="flex-1 pt-[50px]">
        <SendForm/>
      </div>
    </div>
  );
}