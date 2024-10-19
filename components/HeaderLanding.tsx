"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Header = () => {
  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);
  const flexBetween = 'flex items-center justify-between';
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY === 0) {
        setIsTopOfPage(true);
      }
      if (window.scrollY !== 0) setIsTopOfPage(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`${flexBetween} ${
        isTopOfPage ? '' : 'bg-[#fff]'
      } transition fixed top-0 z-30 w-full p-5 md:px-16`}
    >
      <img className="w-32 sm:w-40" src={'/assets/images/HealHunter.svg'} alt="Logo" />
      <button className='btn btn-success' onClick={() => {router.push("/login")}}>Login</button>
    </div>
  );
};

export default Header;