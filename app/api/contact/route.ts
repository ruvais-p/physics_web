import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { prisma } from '@/lib/prisma';
import { decryptSecret } from '@/lib/settings-crypto';
import { consumeRateLimit, getClientAddress } from '@/lib/rate-limit';

export const runtime = 'nodejs';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => {
    const entities: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;',
    };
    return entities[character];
  });
}

function cleanHeader(value: string) {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim().toLowerCase();
    const phone = String(body.phone || '').trim();
    const category = String(body.category || 'General Inquiry').trim();
    const message = String(body.message || '').trim();
    const website = String(body.website || '').trim();

    // Honeypot fields are silently accepted so automated submissions do not retry.
    if (website) {
      return NextResponse.json({ success: true });
    }

    if (!name || name.length > 100) {
      return NextResponse.json(
        { error: 'Enter a valid name.' },
        { status: 400 },
      );
    }

    if (!EMAIL_PATTERN.test(email) || email.length > 254) {
      return NextResponse.json(
        { error: 'Enter a valid email address.' },
        { status: 400 },
      );
    }

    if (!message || message.length > 5000) {
      return NextResponse.json(
        { error: 'The inquiry message is required and must be under 5,000 characters.' },
        { status: 400 },
      );
    }

    if (phone.length > 50 || category.length > 120) {
      return NextResponse.json(
        { error: 'The submitted inquiry contains an invalid field.' },
        { status: 400 },
      );
    }

    const rateLimit = consumeRateLimit(
      `inquiry:${getClientAddress(request)}`,
      RATE_LIMIT_MAX_REQUESTS,
      RATE_LIMIT_WINDOW_MS,
    );
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Too many inquiries were submitted. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } },
      );
    }

    const settings = await prisma.generalSettings.findUnique({
      where: { id: 'general' },
      select: {
        departmentEmail: true,
        departmentEmailAppPassword: true,
        hodEmail: true,
      },
    });

    if (
      !settings?.departmentEmail ||
      !settings.departmentEmailAppPassword ||
      !settings.hodEmail
    ) {
      return NextResponse.json(
        { error: 'Online inquiries are temporarily unavailable. Please contact the department directly.' },
        { status: 503 },
      );
    }

    const appPassword = decryptSecret(settings.departmentEmailAppPassword);
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: settings.departmentEmail,
        pass: appPassword,
      },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeCategory = escapeHtml(category);
    const safeMessage = escapeHtml(message).replace(/\n/g, '<br />');
    const subjectCategory = cleanHeader(category);

    await Promise.all([
      transporter.sendMail({
        from: {
          name: 'Department of Physics',
          address: settings.departmentEmail,
        },
        to: settings.hodEmail,
        replyTo: { name: cleanHeader(name), address: email },
        subject: `Online inquiry: ${subjectCategory}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Phone: ${phone || 'Not provided'}`,
          `Category: ${category}`,
          '',
          message,
        ].join('\n'),
        html: `
          <h2>New Online Inquiry</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Phone:</strong> ${safePhone || 'Not provided'}</p>
          <p><strong>Category:</strong> ${safeCategory}</p>
          <hr />
          <p>${safeMessage}</p>
        `,
        disableFileAccess: true,
        disableUrlAccess: true,
      }),
      transporter.sendMail({
        from: {
          name: 'Department of Physics',
          address: settings.departmentEmail,
        },
        to: email,
        replyTo: settings.departmentEmail,
        subject: 'We received your inquiry',
        text: [
          `Dear ${name},`,
          '',
          `Thank you for contacting the Department of Physics. We received your inquiry regarding "${category}" and will respond as soon as possible.`,
          '',
          'Regards,',
          'Department of Physics',
        ].join('\n'),
        html: `
          <p>Dear ${safeName},</p>
          <p>Thank you for contacting the Department of Physics.</p>
          <p>We received your inquiry regarding <strong>${safeCategory}</strong> and will respond as soon as possible.</p>
          <p>Regards,<br /><strong>Department of Physics</strong></p>
        `,
        disableFileAccess: true,
        disableUrlAccess: true,
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to send online inquiry:', error);
    return NextResponse.json(
      { error: 'We could not send your inquiry right now. Please try again later.' },
      { status: 502 },
    );
  }
}
