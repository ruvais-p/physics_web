import { Course } from '@/lib/data';
import { Clock, Users, CreditCard } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  // Format title (e.g., "MSc in Physics")
  const cleanTitle = course.level === 'MSc' 
    ? 'MSc in Physics' 
    : course.level === 'PhD' 
      ? 'PhD in Physics' 
      : 'Integrated MSc in Physics';

  return (
    <div id={course.id} className="scroll-mt-36 max-w-5xl mx-auto space-y-10 font-sans py-6">
      
      {/* Course Title & Quick Facts Bar */}
      <div className="space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford tracking-tight">
          {cleanTitle}
        </h1>
        
        {/* Quick Facts Bar (Flat, borderless but grouped) */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-slate-600">
          <div className="flex items-center space-x-1.5">
            <Clock className="w-4.5 h-4.5 text-cyan-accent" />
            <span>Duration: {course.duration}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <Users className="w-4.5 h-4.5 text-cyan-accent" />
            <span>Annual Intake: {course.intake} Seats</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <CreditCard className="w-4.5 h-4.5 text-cyan-accent" />
            <span>Fees: {course.fees}</span>
          </div>
        </div>
      </div>

      {/* Section 1: Introduction Description */}
      <div className="space-y-3">
        <p className="text-slate-700 text-base sm:text-lg lg:text-xl leading-relaxed text-justify font-sans">
          {course.description}
        </p>
      </div>

      {/* Section 2: Eligibility */}
      <div className="space-y-3">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-oxford border-b border-slate-100 pb-2">
          Eligibility Criteria
        </h2>
        <p className="text-slate-700 text-base sm:text-lg leading-relaxed text-justify font-sans font-normal font-sans">
          {course.eligibility}
        </p>
      </div>

      {/* Section 3: Highlights */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-oxford border-b border-slate-100 pb-2">
          Program Highlights
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-slate-700 text-base">
          {course.highlights.map((highlight, index) => (
            <li key={index} className="flex items-start space-x-2.5">
              <span className="text-cyan-accent text-lg shrink-0 mt-0.5">✦</span>
              <span>{highlight}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Section 4: Curriculum / Syllabus Structure */}
      <div className="space-y-4">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-oxford border-b border-slate-100 pb-2">
          Curriculum Overview
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {course.syllabus.map((sem, index) => (
            <div key={index} className="bg-slate-50/60 p-4 rounded-xl border border-slate-100 space-y-2">
              <span className="font-bold text-oxford text-sm uppercase tracking-wider block border-b border-slate-200 pb-1.5">
                {sem.semester}
              </span>
              <ul className="space-y-1.5 text-slate-600 text-xs sm:text-sm">
                {sem.subjects.map((sub, subIndex) => (
                  <li key={subIndex} className="flex items-center space-x-1.5">
                    <span className="text-slate-450 shrink-0">•</span>
                    <span>{sub}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Section 5: Application Procedure */}
      <div className="space-y-3">
        <h2 className="font-serif text-2xl sm:text-3xl font-bold text-oxford border-b border-slate-100 pb-2">
          Application Procedure
        </h2>
        <p className="text-slate-700 text-base sm:text-lg leading-relaxed text-justify font-sans font-normal">
          {course.level === 'PhD' ? (
            "Applications are to be made in the prescribed application form in response to the notification for Ph.D. admissions. Admission is based on the candidate's performance in GATE / CSIR-UGC NET-JRF or the Departmental Admission Test (DAT) followed by a technical interview before the Departmental Research Committee (DRC)."
          ) : (
            "Applications are to be made in the prescribed application form and in response to a notification for Common Admission Test (CAT) issued by the Cochin University of Science and Technology. Selection will be based on the merit of the applicants as determined through an admission test conducted for Physics subject to satisfying other prescribed eligibility criteria."
          )}
        </p>
      </div>

    </div>
  );
}
