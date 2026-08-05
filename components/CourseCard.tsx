import { Course } from '@/lib/data';

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
    <div id={course.id} className="scroll-mt-36 max-w-5xl mx-auto space-y-8 font-sans py-6">
      
      {/* Dark Blue Heading */}
      <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-oxford tracking-tight">
        {cleanTitle}
      </h1>

      {/* Section 1: Introduction Description */}
      <div className="prose max-w-none">
        <p className="text-slate-700 text-base sm:text-lg lg:text-xl leading-relaxed text-justify font-sans">
          {course.description}
        </p>
      </div>

      {/* Section 2: Eligibility */}
      <div className="space-y-3">
        <h4 className="font-serif text-2xl sm:text-3xl font-bold text-oxford border-b border-slate-100 pb-2">
          Eligibility
        </h4>
        <p className="text-slate-700 text-base sm:text-lg leading-relaxed text-justify font-sans font-normal">
          {course.eligibility}
        </p>
      </div>

      {/* Section 3: Application Procedure */}
      <div className="space-y-3">
        <h4 className="font-serif text-2xl sm:text-3xl font-bold text-oxford border-b border-slate-100 pb-2">
          Application Procedure
        </h4>
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
