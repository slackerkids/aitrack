import React from 'react';
import Header from '@/components/HeaderLanding';
import Button from '@/components/ui/buttonn';
import SectionWrapper from '@/components/SectionWrapper';

export const links = ['Home'];

export const descNums = [
  { num: 'Kazakhstan', text: 'All over' },
  { num: '20k+', text: 'Happy Patients to be' },
  { num: '550+', text: 'Medical Experts to be' },
  { num: '20+', text: 'Partnerships to be' },
];

const Home: React.FC = () => {
  return (
    <>
      <Header /> {/* Header */}
      <SectionWrapper id="home">
        <div className="flex flex-col-reverse md:flex-row items-center justify-center gap-10 text-center md:text-left">
          {/* Text Content */}
          <div className="max-w-lg lg:max-w-xl tracking-wide space-y-6">
            <h1 className="text-4xl lg:text-7xl font-bold">
              An AI-driven telehealth SaaS for preliminary diagnosis
            </h1>
            <p className="text-lg lg:text-xl">
              Input symptoms and upload a photo. HealHunter’s AI agent generates preliminary diagnoses 
              and sends them directly to specialists, eliminating the need for offline visits.
            </p>
            <Button>Request Demo Now</Button>
          </div>

          {/* Hero Image */}
          <div className="flex justify-center max-w-xs md:max-w-md lg:max-w-lg">
            <img
              src="/assets/images/hero.png"
              alt="Illustration of AI-driven telehealth"
              className="object-contain w-full h-auto"
              loading="lazy"
            />
          </div>
        </div>

        {/* Statistics Section */}
        <div className="flex flex-wrap justify-center gap-5 mt-10 px-6 md:px-0">
          {descNums.map((descNum, index) => (
            <div
              key={index}
              className="w-full sm:w-[calc(50%-1rem)] md:w-1/5 bg-white/90 shadow-lg rounded-2xl p-6 text-center"
            >
              <h3 className="text-2xl lg:text-4xl font-bold mb-2">{descNum.num}</h3>
              <p className="text-sm lg:text-base">{descNum.text}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
};

export default Home;