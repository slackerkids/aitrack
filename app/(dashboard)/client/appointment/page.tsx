// pages/index.tsx
import Head from 'next/head';
import MyCalendar from '@/components/Calendar';

const Home: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <Head>
        <title>My Calendar App</title>
        <meta name="description" content="A simple calendar app with events" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-4">Welcome to My Calendar App</h1>
        <MyCalendar />
      </main>
    </div>
  );
};

export default Home;
