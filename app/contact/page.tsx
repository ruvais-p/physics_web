import { Metadata } from 'next';
import ContactPageClient from '@/components/ContactPageClient';
import { getPageHero } from '@/lib/page-hero';

export const metadata: Metadata = {
  title: 'Contact Department | Department of Physics, CUSAT',
  description: 'Get in touch with the Department of Physics, Cochin University of Science and Technology (CUSAT). Office locations, phone contacts, and enquiry form.',
};

export const revalidate = 300;

export default async function ContactPage() {
  const heroData = await getPageHero('contact');
  return <ContactPageClient heroData={heroData} />;
}
