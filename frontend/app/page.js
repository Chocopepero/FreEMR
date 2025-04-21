import Link from 'next/link';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center h-screen w-full bg-gradient-to-r from-cyan-900 to-indigo-950'>
      <div className=''>
      <h1>Welcome</h1>
      <Link href="/scenario">
        Open Application
      </Link>
      </div>
    </div>
  );
}
