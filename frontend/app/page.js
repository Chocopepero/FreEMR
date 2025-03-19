import Link from 'next/link';
import NavBar from './components/NavBar';

export default function Home() {
  return (
    <div>
      <NavBar />
      <h1>Welcome</h1>
      <Link href="/scenario">
        <button>Open Application</button>
      </Link>
    </div>
  );
}
