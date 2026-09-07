'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Hero from '@/components/Hero';
import { MapPin, Phone, Mail, Clock, Send, CheckCircle2, ExternalLink } from 'lucide-react';

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
      
      {/* Hero Header matching main homepage design */}
      <Hero
        title="CONTACT US"
        badge="HOME > CONTACT"
        subtitle="Department Office, South Kalamassery, Kochi – 682022, Kerala, India."
        bgImage="/campus.jpg"
      />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Contact Inquiry Form (Email / Message) */}
          <div className="lg:col-span-7 font-sans">
            <div className="bg-white p-6 lg:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-cyan-accent uppercase tracking-widest block">
                  ONLINE INQUIRY
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-oxford">
                  Send a Message to the Department
                </h2>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">
                  Have questions about admissions, research programs, or facilities? Drop us a message below.
                </p>
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
                    className="text-xs font-semibold text-emerald-700 underline pt-2 cursor-pointer"
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
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-accent/50 text-slate-800"
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
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-accent/50 text-slate-800"
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
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-accent/50 text-slate-800"
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
                        className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-accent/50 text-slate-800"
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
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-accent/50 text-slate-800"
                    />
                  </div>

                  <button
                    id="contact-submit-btn"
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-oxford hover:bg-cyan-900 text-white font-semibold text-sm px-8 py-3.5 rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    <span>Submit Department Inquiry</span>
                    <Send className="w-4 h-4 text-cyan-accent" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Department Address & Embedded Google Map Container */}
          <div className="lg:col-span-5 space-y-6 font-sans">
            <div className="bg-white p-6 lg:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              
              <div>
                <span className="text-xs font-bold text-cyan-accent uppercase tracking-widest block">
                  PHYSICAL LOCATION
                </span>
                <h2 className="font-serif text-2xl font-bold text-oxford">
                  Department Address
                </h2>
              </div>

              {/* Address & Contact Info List */}
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
                    <a href="mailto:phys@cusat.ac.in" className="font-semibold text-oxford hover:text-cyan-accent transition-colors">
                      phys@cusat.ac.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start space-x-3 pt-2 border-t border-slate-100">
                  <Clock className="w-5 h-5 text-cyan-accent shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-600">
                    <strong className="text-oxford block">Office Working Hours:</strong>
                    <span>Monday – Friday: 9:00 AM – 5:00 PM (IST)</span>
                    <span className="block text-slate-400">HOD Consultation: 2:00 PM – 4:00 PM</span>
                  </div>
                </div>
              </div>

              {/* Embedded Google Map inside Department Address Container */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Campus Map View
                  </span>
                  <a
                    href="https://www.google.com/maps/place/Department+of+Applied+Chemistry+and+Department+of+Physics+,+CUSAT/@10.0459694,76.3265267,17.8z/data=!4m6!3m5!1s0x3b080c370e2c0b3b:0x83497fa6cb0e123a!8m2!3d10.044099!4d76.327021!16s%2Fg%2F1vjdnhd_?hl=en&entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-cyan-accent hover:text-cyan-700 transition-colors"
                  >
                    <span>Open in Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <div className="w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-slate-200 shadow-inner relative">
                  <iframe
                    title="Department of Physics CUSAT Google Map Location"
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3928.6534591461974!2d76.32483837494498!3d10.04543949006198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080c361eb00001%3A0xe54e60e81c00fdfb!2sDepartment%20of%20Physics%2C%20CUSAT!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
