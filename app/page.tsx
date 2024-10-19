import React from 'react';
import Header from '@/app/Header'; // Импортируйте Header
import Button from '@/components/ui/buttonn';
import SectionWrapper from '@/app/SectionWrapper';

export const links = ['Home'];

export const descNums = [
  { num: 'Kazakhstan', text: 'all over' },
  { num: '20k+', text: 'Happy Patients to be' },
  { num: '550+', text: 'Medical experts to be' },
  { num: '20+', text: 'Partnerships to be' },
  { num: '24/7', text: 'Emergency Service' },
];

const Home = () => {
  return (
    <>
      <Header /> {/* Добавляем Header */}
      <SectionWrapper id="home">
        <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-10 text-center md:text-left">
          <div className="tracking-wider md:tracking-normal max-w-xs lg:max-w-xl">
            <h1 className="lg:text-7xl text-4xl font-bold">
              An AI-driven telehealth SaaS for preliminary diagnosis
            </h1>
            <p className="text-lg md:text-base lg:text-xl my-10">
              Input symptoms and upload a photo; HealHunter's AI agent generates preliminary diagnoses and 
              sends them directly to specialists, eliminating the need for time-consuming offline visits.
            </p>
            <Button>Request Demo Now</Button>
          </div>
          <div className="flex justify-center max-w-xs md:max-w-none">
            <img src={"/assets/hero.png"} alt="hero" className="object-contain" />
          </div>
        </div>
        <div className="flex px-10 xs:px-16 sm:px-5 md:px-0 gap-5 flex-wrap items-center md:flex-nowrap text-center justify-center md:justify-around mt-10">
          {descNums.map((descNum, index) => (
            <div
              className="rounded-3xl shadow-xl p-6 md:px-2 lg:w-1/5 w-xl bg-[#ffffffd1]"
              key={index}
            >
              <h3 className="lg:text-4xl text-2xl font-bold mb-2">{descNum.num}</h3>
              <p className="lg:text-base text-sm">{descNum.text}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
};

export default Home;