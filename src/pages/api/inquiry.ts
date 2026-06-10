import type { APIRoute } from 'astro';

export const prerender = false;

function textValue(source: Record<string, unknown>, key: string) {
	const value = source[key];
	return typeof value === 'string' ? value.trim() : '';
}

function isEmail(value: string) {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function jsonResponse(status: number, body: Record<string, string | boolean>) {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			'content-type': 'application/json; charset=utf-8',
		},
	});
}

export const POST: APIRoute = async ({ request }) => {
	const contentType = request.headers.get('content-type') || '';
	const rawBody = contentType.includes('application/json')
		? await request.json().catch(() => ({}))
		: Object.fromEntries((await request.formData()).entries());

	const name = textValue(rawBody, 'name');
	const email = textValue(rawBody, 'email');
	const phone = textValue(rawBody, 'phone');
	const property = textValue(rawBody, 'property');
	const message = textValue(rawBody, 'message');
	const honeypot = textValue(rawBody, 'company');

	if (honeypot) {
		return jsonResponse(200, { success: true });
	}

	if (name.length < 2 || name.length > 80) {
		return jsonResponse(400, { error: 'Please provide a valid name.' });
	}

	if (!isEmail(email) || email.length > 120) {
		return jsonResponse(400, { error: 'Please provide a valid email.' });
	}

	if (phone.length > 30) {
		return jsonResponse(400, { error: 'Phone number is too long.' });
	}

	if (property.length > 120) {
		return jsonResponse(400, { error: 'Property name is too long.' });
	}

	if (message.length < 20 || message.length > 2000) {
		return jsonResponse(400, {
			error: 'Message must be between 20 and 2000 characters.',
		});
	}

	const apiKey = import.meta.env.RESEND_API_KEY;
	// Default to your requested inbox if the environment variable isn't set
	const to = import.meta.env.INQUIRY_TO_EMAIL || 'info@eaglesecurityguardservices.com';
	const from =
		import.meta.env.INQUIRY_FROM_EMAIL || 'Apartment Security <onboarding@resend.dev>';

	if (!apiKey || !to) {
		return jsonResponse(500, {
			error:
				'Server email settings are missing. Add RESEND_API_KEY and INQUIRY_TO_EMAIL.',
		});
	}

	const lines = [
		`Name: ${name}`,
		`Email: ${email}`,
		`Phone: ${phone || 'Not provided'}`,
		`Property: ${property || 'Not provided'}`,
		'',
		'Message:',
		message,
	];

const emailAbortController = new AbortController();
	const emailTimeout = setTimeout(() => emailAbortController.abort(), 10000);

	try {
		const emailResponse = await fetch('https://api.resend.com/emails', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			signal: emailAbortController.signal,
			body: JSON.stringify({
				from,
				to: [to],
				subject: `New Security Inquiry: ${name}`,
				reply_to: email,
				text: lines.join('\n'),
			}),
		});

		clearTimeout(emailTimeout);

		if (!emailResponse.ok) {
			const details = await emailResponse.text();
			console.error('Resend API Error:', details);
			return jsonResponse(502, {
				error: 'Unable to send your inquiry right now. Please try again soon.',
			});
		}

		return jsonResponse(200, { success: true });

	} catch (error) {
		clearTimeout(emailTimeout);
		console.error('Function execution error:', error);
		
		if (error instanceof Error && error.name === 'AbortError') {
			return jsonResponse(504, { error: 'The connection to the email server timed out.' });
		}
		
		return jsonResponse(500, { error: 'An unexpected network error occurred.' });
	}
};