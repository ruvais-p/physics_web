import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Department Events',
  description: 'Upcoming seminars, lectures, workshops, and events at the Department of Physics, CUSAT.',
};

interface EventItem {
  id: string;
  title: string;
  date: string;
  day: string;
  month: string;
  year: string;
  desc: string;
  time?: string;
  venue?: string;
}

const EVENTS_ITEMS: EventItem[] = [
  {
    id: 'e1',
    title: '15th Department Endowment & Memorial Oration Lecture',
    date: '19 Jul 2026',
    day: '19',
    month: 'Jul',
    year: '2026',
    time: '10:00 AM - 01:00 PM',
    venue: 'Department Auditorium (Main Block)',
    desc: 'Distinguished national physicists will speak on breakthroughs in low-temperature magnetics and topological insulators, followed by an interactive research panel.',
  },
  {
    id: 'e2',
    title: 'Hands-On Workshop on FE-SEM & micro-Raman Spectroscopy',
    date: '06 Jul 2026',
    day: '06',
    month: 'Jul',
    year: '2026',
    time: '09:30 AM - 04:30 PM',
    venue: 'Central Instrumentation Facility (CIF)',
    desc: 'A focused session on equipment slot bookings and instrumentation data analysis for regional researchers. Participants will receive hands-on training on sample preparation.',
  },
  {
    id: 'e3',
    title: 'National Seminar on Cosmology & Quantum Gravity (CQG-2026)',
    date: '30 Jun 2026',
    day: '30',
    month: 'Jun',
    year: '2026',
    time: '09:00 AM - 05:00 PM',
    venue: 'Seminar Hall, Department of Physics',
    desc: 'Presenting recent simulations and mathematical formulations on gravitational waves and cosmic expansions. Guest lectures will be delivered by eminent scientists.',
  },
  {
    id: 'e4',
    title: 'Integrated M.Sc. Orientation & Interactive Session',
    date: '12 Jul 2026',
    day: '12',
    month: 'Jul',
    year: '2026',
    time: '10:00 AM - 12:30 PM',
    venue: 'Foyer, Department Entrance',
    desc: 'An orientation ceremony welcoming the newly admitted students to the Integrated M.Sc. Physics program, including a campus tour and interaction with research scholars.',
  },
  {
    id: 'e5',
    title: 'Alumni Meet 2026: Physics Department Silver Jubilee Celebration',
    date: '05 Aug 2026',
    day: '05',
    month: 'Aug',
    year: '2026',
    time: '11:00 AM - 04:00 PM',
    venue: 'Department Foyer & Seminar Hall',
    desc: 'A grand alumni reunion celebrating the silver jubilee of the department. Alumni working in prestigious global institutions will share their journeys.',
  },
];

export default function EventsPage() {
  return (
    <div className="pb-24 relative">
      
      {/* Top Banner (Campus Image Background with Oxford Blue Overlay) */}
      <div className="-mt-[116px] sm:-mt-[128px] relative bg-slate-900 text-white overflow-hidden">
        {/* Background Image with Dark Blue Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/campus.jpg"
            alt="CUSAT Campus"
            fill
            className="object-cover opacity-45"
            priority
          />
          <div className="absolute inset-0 bg-oxford/75 mix-blend-multiply" />
        </div>

        {/* Content (Centered) */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 pt-52 pb-32 sm:pt-64 sm:pb-44 text-center space-y-3">
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white uppercase">
            Department Events
          </h1>
          
          {/* Centered Breadcrumbs */}
          <div className="flex items-center justify-center space-x-2 text-xs sm:text-sm font-sans font-medium text-slate-300">
            <Link href="/" className="hover:text-cyan-accent transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-white font-semibold">Events</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <section className="max-w-5xl mx-auto px-6 sm:px-12 lg:px-16 py-16">
        <div className="space-y-12">
          {/* Color Accent line & Header */}
          <div className="space-y-4">
            <div className="w-16 h-1 bg-cyan-accent rounded-full" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford">
              Seminars, Lectures &amp; Workshops
            </h2>
            <p className="text-slate-600 max-w-2xl text-base sm:text-lg font-sans">
              Discover academic presentations, instrumentation workshops, national seminars, and community meetups happening at our department.
            </p>
          </div>

          {/* Events Stack */}
          <div className="space-y-8">
            {EVENTS_ITEMS.map((item) => (
              <div 
                key={item.id}
                id={item.id}
                className="bg-white border border-slate-200/85 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row gap-6 items-start hover:shadow-md transition-all duration-300 border-l-4 border-l-cyan-accent"
              >
                {/* Date Badge */}
                <div className="w-20 h-20 shrink-0 bg-cyan-accent text-white rounded-xl flex flex-col items-center justify-center text-center p-2 shadow-sm font-sans font-bold">
                  <span className="text-2xl leading-none">{item.day}</span>
                  <span className="text-xs uppercase tracking-wider leading-none mt-1">{item.month}</span>
                  <span className="text-[10px] font-medium leading-none mt-1">{item.year}</span>
                </div>

                {/* Details */}
                <div className="space-y-3 flex-grow">
                  <h3 className="font-sans text-lg sm:text-xl font-bold text-oxford leading-snug">
                    {item.title}
                  </h3>
                  
                  {/* Meta (Time and Venue) */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs sm:text-sm text-slate-500 font-sans font-medium">
                    {item.time && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-cyan-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {item.time}
                      </span>
                    )}
                    {item.venue && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4 text-cyan-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.venue}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed text-justify font-sans">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
