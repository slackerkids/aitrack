"use client";

import { useState, useEffect } from 'react';

const Header = () => {
  const [isTopOfPage, setIsTopOfPage] = useState<boolean>(true);
  const flexBetween = 'flex items-center justify-between';

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
        isTopOfPage ? '' : 'bg-[#84ceff]'
      } transition fixed top-0 z-30 w-full p-5 md:px-16`}
    >
      <img className="w-32 sm:w-40" src={'/assets/HealHunter.svg'} alt="Logo" />
    </div>
  );
};

export default Header;