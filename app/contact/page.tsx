'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, Building } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'M.Sc. Admission Enquiry',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
  };

  return (
    <div className="space-y-12 pb-20 relative">
      
      {/* Page Header (Campus image background) */}
      <div className="-mt-[116px] sm:-mt-[128px] relative w-full bg-slate-900 text-white overflow-hidden min-h-[620px] sm:min-h-[720px] lg:min-h-[780px] flex items-center justify-center">
        {/* Background Image with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/campus.jpg"
            alt="Contact Banner"
            fill
            className="object-cover opacity-45"
            priority
          />
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Top Left Breadcrumbs */}
        <div className="absolute top-36 sm:top-40 left-6 sm:left-12 lg:left-16 z-20 flex items-center space-x-2 text-xl sm:text-2xl font-sans font-semibold text-slate-300">
          <Link href="/" className="hover:text-cyan-accent transition-colors">Home</Link>
          <span>&gt;</span>
          <span className="text-white font-bold">Contact Us</span>
        </div>

        {/* Hero Title (Centered) */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 sm:px-12 lg:px-20 text-center space-y-4 pt-12">
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white uppercase drop-shadow-md">
            Contact Us
          </h1>
        </div>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6 font-sans">
            
            <div className="bg-white p-6 lg:p-8 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-cyan-accent uppercase tracking-widest block">
                  PHYSICAL LOCATION
                </span>
                <h2 className="font-serif text-2xl font-bold text-oxford">
                  Department Address
                </h2>
              </div>

              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-cyan-accent shrink-0 mt-1" />
                  <div>
                    <strong className="text-oxford block font-semibold font-serif text-base">Department of Physics</strong>
                    <span>Cochin University of Science and Technology (CUSAT)</span>
                    <span className="block text-slate-500 text-xs">South Kalamassery, Kochi – 682022, Kerala, India</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-cyan-accent shrink-0" />
                  <div>
                    <span className="text-xs text-slate-400 block">General Office Tel:</span>
                    <span className="font-semibold text-oxford">+91 484 2577404 / 2577401</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-cyan-accent shrink-0" />
                  <div>
                    <span className="text-xs text-slate-400 block">Official Email:</span>
                    <a href="mailto:phys@cusat.ac.in" className="font-semibold text-oxford hover:text-cyan-accent">
                      phys@cusat.ac.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pt-2 border-t border-slate-100">
                  <Clock className="w-5 h-5 text-cyan-accent shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-600">
                    <strong className="text-oxford block">Office Working Hours:</strong>
                    <span>Monday – Friday: 9:00 AM – 5:00 PM (IST)</span>
                    <span className="block text-slate-400">Head of Department Office Hours: 2:00 PM – 4:00 PM</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Access & Transit */}
            <div className="bg-oxford text-white p-6 rounded-xl border border-white/10 shadow-lg relative overflow-hidden space-y-3">
              <div className="flex items-center space-x-2">
                <Building className="w-5 h-5 text-cyan-accent" />
                <h3 className="font-serif text-lg font-bold">Campus Access & Transit</h3>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Located 15 km from Cochin International Airport (COK) and 2 km from CUSAT Metro Station / Kalamassery Railway Station.
              </p>
              <div className="pt-2 text-xs font-semibold text-cyan-accent">
                📍 Coordinates: 10.0436° N, 76.3242° E
              </div>
            </div>

          </div>

          {/* Contact Inquiry Form Column */}
          <div className="lg:col-span-7 font-sans">
            <div className="bg-white p-6 lg:p-10 rounded-xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-cyan-accent uppercase tracking-widest block">
                  ONLINE INQUIRY
                </span>
                <h2 className="font-serif text-2xl font-bold text-oxford">
                  Send a Message to the Department
                </h2>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-6 rounded-xl space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    <h3 className="font-serif text-lg font-bold">Inquiry Submitted Successfully</h3>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Thank you, <strong>{formData.name}</strong>. Your message regarding "<strong>{formData.category}</strong>" has been logged with the Department Office. We will respond to <strong>{formData.email}</strong> within 1-2 business days.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-semibold text-emerald-700 underline pt-2"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="Dr. / Mr. / Ms. Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-accent/50 text-slate-800"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-accent/50 text-slate-800"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Phone Number
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        placeholder="+91 Mobile Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-accent/50 text-slate-800"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-category" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Inquiry Category
                      </label>
                      <select
                        id="contact-category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-accent/50 text-slate-800"
                      >
                        <option>M.Sc. Admission Enquiry</option>
                        <option>Ph.D. Application & Fellowship</option>
                        <option>Integrated M.Sc. Query</option>
                        <option>Instrument Slot Booking (FE-SEM/XRD)</option>
                        <option>Research Collaboration Proposal</option>
                        <option>General Information</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Your Message *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      placeholder="Please specify your query or research interest in detail..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-accent/50 text-slate-800"
                    />
                  </div>

                  <button
                    id="contact-submit-btn"
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-oxford hover:bg-oxford-dark text-white font-semibold text-sm px-8 py-3.5 rounded-lg shadow-md transition-colors"
                  >
                    <span>Submit Department Inquiry</span>
                    <Send className="w-4 h-4 text-cyan-accent" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
