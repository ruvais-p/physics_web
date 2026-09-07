'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Hero from '@/components/Hero';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ExternalLink,
  Building2,
  Sparkles,
  MessageSquare,
  Compass,
  ArrowUpRight
} from 'lucide-react';

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
    <div className="min-h-screen bg-slate-50 font-sans pb-24 relative">
      
      {/* Hero Header matching main website design */}
      <Hero
        title="CONTACT US"
        badge="HOME > CONTACT"
        subtitle="Department Office, South Kalamassery, Kochi – 682022, Kerala, India."
        bgImage="/campus.jpg"
        align="center"
      />

      <section className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 mt-10 sm:mt-12 space-y-12">
        
        {/* 1. Top Contact Info Strip (Pill Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-2">
          {/* General Office */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-oxford/10 text-oxford flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5 text-oxford" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Office Telephones</span>
              <a href="tel:+914842577404" className="text-sm sm:text-base font-bold text-oxford hover:text-cyan-dark transition-colors block">
                +91 484 2577404
              </a>
              <span className="text-xs text-slate-500 block">+91 484 2577401 (Direct)</span>
            </div>
          </div>

          {/* Email Support */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-cyan-accent/15 text-cyan-dark flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 text-cyan-dark" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Official Email</span>
              <a href="mailto:phys@cusat.ac.in" className="text-sm sm:text-base font-bold text-oxford hover:text-cyan-dark transition-colors block">
                phys@cusat.ac.in
              </a>
              <span className="text-xs text-slate-500 block">General &amp; Research Queries</span>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-oxford/10 text-oxford flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-oxford" />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Office Hours</span>
              <span className="text-sm sm:text-base font-bold text-oxford block">Mon – Fri: 9:00 AM – 5:00 PM</span>
              <span className="text-xs text-slate-500 block">IST (Excl. Public Holidays)</span>
            </div>
          </div>
        </div>

        {/* 2. Main Grid: Inquiry Form (Left) & Department Address + Map (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Online Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm space-y-8">
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-widest text-cyan-dark flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-cyan-accent" />
                  <span>Online Inquiry</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-oxford">
                  Send a Message to the Department
                </h2>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Have questions regarding degree admissions, Ph.D. positions, instrumentation bookings, or research collaborations? Send us your message below.
                </p>
              </div>

              {submitted ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-8 rounded-2xl space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-bold text-emerald-900">Inquiry Submitted Successfully</h3>
                      <p className="text-xs text-emerald-700">Your query has been logged with the Department Office.</p>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed pt-2 border-t border-emerald-200/60">
                    Thank you, <strong>{formData.name}</strong>. Your message regarding <em>"{formData.category}"</em> has been received. Our office will respond to <strong>{formData.email}</strong> within 1-2 business days.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ name: '', email: '', phone: '', category: 'M.Sc. Admission Enquiry', message: '' });
                      setSubmitted(false);
                    }}
                    className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-950 underline pt-2 cursor-pointer transition-colors"
                  >
                    <span>Submit Another Inquiry</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        placeholder="e.g. Dr. / Prof. / Alex John"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-accent/50 focus:border-cyan-500 text-slate-800 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        placeholder="e.g. name@domain.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-accent/50 focus:border-cyan-500 text-slate-800 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Phone Number
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        placeholder="+91 Mobile Number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-accent/50 focus:border-cyan-500 text-slate-800 transition-all"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="contact-category" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Inquiry Category
                      </label>
                      <select
                        id="contact-category"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-accent/50 focus:border-cyan-500 text-slate-800 transition-all cursor-pointer"
                      >
                        <option>M.Sc. Admission Enquiry</option>
                        <option>Ph.D. Application &amp; Fellowship</option>
                        <option>Integrated M.Sc. Query</option>
                        <option>Instrument Slot Booking (FE-SEM/XRD/Raman)</option>
                        <option>Research Collaboration Proposal</option>
                        <option>General Academic Information</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      placeholder="Please describe your inquiry, course interest, or research questions in detail..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 text-sm bg-slate-50/70 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-accent/50 focus:border-cyan-500 text-slate-800 transition-all resize-y"
                    />
                  </div>

                  <button
                    id="contact-submit-btn"
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-oxford hover:bg-cyan-900 text-white font-bold text-sm sm:text-base px-8 py-3.5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  >
                    <span>Send Message</span>
                    <Send className="w-4 h-4 text-cyan-accent group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Department Address & Interactive Google Map */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm space-y-7">
              
              <div className="space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-widest text-cyan-dark flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-oxford" />
                  <span>Department Address</span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-oxford">
                  Physical Location
                </h2>
              </div>

              {/* Address & Contact Info List */}
              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-oxford/10 text-oxford flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="space-y-0.5">
                    <strong className="text-oxford block font-bold font-serif text-base">Department of Physics</strong>
                    <span className="text-slate-700 font-medium block">Cochin University of Science and Technology (CUSAT)</span>
                    <span className="text-slate-500 text-xs block">South Kalamassery, Kochi – 682022, Kerala, India</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-accent/15 text-cyan-dark flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Office Line:</span>
                    <span className="font-bold text-oxford font-mono text-sm">+91 484 2577404 / 2577401</span>
                  </div>
                </div>

                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-oxford/10 text-oxford flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Official Email:</span>
                    <a href="mailto:phys@cusat.ac.in" className="font-bold text-oxford hover:text-cyan-dark transition-colors font-mono text-sm">
                      phys@cusat.ac.in
                    </a>
                  </div>
                </div>
              </div>

              {/* Embedded Google Map */}
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-cyan-dark" />
                    <span>Campus Map &amp; Navigation</span>
                  </span>
                  <a
                    href="https://www.google.com/maps/place/Department+of+Applied+Chemistry+and+Department+of+Physics+,+CUSAT/@10.0459694,76.3265267,17.8z/data=!4m6!3m5!1s0x3b080c370e2c0b3b:0x83497fa6cb0e123a!8m2!3d10.044099!4d76.327021!16s%2Fg%2F1vjdnhd_?hl=en&entry=ttu&g_ep=EgoyMDI2MDcyOS4wIKXMDSoASAFQAw%3D%3D"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-bold text-cyan-dark hover:text-oxford transition-colors"
                  >
                    <span>Open in Google Maps</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="w-full h-64 sm:h-72 rounded-2xl overflow-hidden border border-slate-200 shadow-inner relative">
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

