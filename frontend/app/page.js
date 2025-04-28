import Link from 'next/link';

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-center h-screen w-full bg-gradient-to-r from-cyan-900 to-indigo-950 text-white'>
      <div className='text-6xl font-bold mb-4 tracking-tight'>
        <span className='text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-300'>
          Welcome to FreEMR
        </span>
      </div>
      
      <p className='text-xl text-blue-200 mb-8 max-w-md text-center'>
        A free electronic medical record system for healthcare education
      </p>
      
      <div className='mt-8'>
        <Link 
          href="/scenario" 
          className='px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 inline-flex items-center'
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Open Application
        </Link>
      </div>

      <div className='mt-12 text-4xl text-blue-200 font-bold'>
          How do you use FreEMR as an Instructor?
          <div className='text-lg text-blue-300 mt-4 indent-10'>
            <p>1. Create Patients to add to scenarios </p>
            <p>2. Create Scenarios using those patients </p>
            <p>3. Press the "Link" button to send that scenario to students</p>
          </div>
      </div>

      <div className='mt-12 text-4xl text-blue-200 font-bold'>
          How do you use FreEMR as a Student?
          <div className='text-lg text-blue-300 mt-4 indent-10'>
            <p>1. Receive a link from your instructor </p>
            <p>2. Make changes as your instructor specifies </p>
            <p>3. Download a text file of your scenario changes or email the changes directly </p>
          </div>
      </div>

    </div>
  );
}
