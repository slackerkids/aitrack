import { cn } from "@/lib/utils";
import Marquee from "./ui/marquee";
import { useEffect, useState } from "react";
import axiosInstance from "./../app/axios/instance";

interface Doctor {
  id: number;
  name: string;
  email: string;
  doctor_type: string;
  avatar: string; // Add avatar property to the Doctor interface
}

export function MarqueeDemo() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get("/doctors");
        const doctorsWithAvatars = response.data.map((doctor: Doctor) => ({
          ...doctor,
          avatar: `https://avatar.vercel.sh/${doctor.name.toLowerCase()}`, // Generate avatar URL based on name
        }));
        setDoctors(doctorsWithAvatars);
      } catch (err) {
        setError("Failed to fetch doctors.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const firstRow = doctors.slice(0, Math.ceil(doctors.length));

  const ReviewCard = ({
    name,
    email,
    doctor_type,
    avatar,
  }: {
    name: string;
    email: string;
    doctor_type: string;
    avatar: string; // Include avatar prop
  }) => {
    return (
      <figure
        className={cn(
          "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
          "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
          "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
        )}
      >
        <div className="flex flex-row items-center gap-2">
          <img
            className="rounded-full"
            width="40"
            height="40"
            alt={`${name}'s avatar`}
            src={avatar} // Use the avatar URL
          />
          <div className="flex flex-col">
            <figcaption className="text-sm font-medium dark:text-white">{name}</figcaption>
            <p className="text-xs font-medium dark:text-white/40">{doctor_type}</p>
            <p className="text-xs font-medium dark:text-white/40">{email}</p>
          </div>
        </div>
      </figure>
    );
  };

  if (loading) {
    return <div>Loading...</div>; // Display loading state
  }

  if (error) {
    return <div>{error}</div>; // Display error message
  }

  return (
    <div className="relative flex h-[100px] w-[1300px] flex-col items-center justify-center overflow-hidden rounded-lg bg-transparent">
      <Marquee pauseOnHover className="[--duration:20s]">
        {firstRow.map((doctor) => (
          <ReviewCard key={doctor.id} {...doctor} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </div>
  );
}
