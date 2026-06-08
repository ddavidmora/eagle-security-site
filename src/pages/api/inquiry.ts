import type { APIRoute } from 'astro';

export const prerender = false;

function textValue(formData: FormData, key: string) {
	const value = formData.get(key);
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
	const formData = await request.formData();

	const name = textValue(formData, 'name');
	const email = textValue(formData, 'email');
	const phone = textValue(formData, 'phone');
	const property = textValue(formData, 'property');
	const message = textValue(formData, 'message');
	const honeypot = textValue(formData, 'company');

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

	const emailResponse = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${apiKey}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			from,
			to: [to],
			subject: `New Security Inquiry: ${name}`,
			reply_to: email,
			text: lines.join('\n'),
		}),
	});

	if (!emailResponse.ok) {
		const details = await emailResponse.text();
		console.error('Resend error:', details);
		// Temporarily always include details for debugging
		return jsonResponse(502, {
			error: 'Unable to send your inquiry right now. Please try again soon.',
			details: String(details),
		});
	}

	return jsonResponse(200, { success: true });
};