import { Resend } from 'resend';

export interface ContactPayload {
	name?: string;
	email?: string;
	company?: string;
	message?: string;
}

export interface ContactResponseBody {
	success: boolean;
	mode?: 'simulation' | 'live';
	message?: string;
	id?: string;
	error?: string;
}

export interface ContactResult {
	status: number;
	body: ContactResponseBody;
}

function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

export async function handleContactSubmission(
	payload: ContactPayload,
): Promise<ContactResult> {
	const { name, email, company, message } = payload;

	if (!name || !email || !message) {
		return {
			status: 400,
			body: {
				success: false,
				error:
					"Missing required values: 'name', 'email', and 'message' are mandatory.",
			},
		};
	}

	const resendKey = process.env.RESEND_API_KEY;
	const fromAddress =
		process.env.RESEND_FROM ||
		'Griffin LeBlanc Portfolio <notifications@mail.griffinleblanc.ca>';
	const toAddress = 'griffin.leblanc@gmail.com';

	if (!resendKey || resendKey === 're_123456789') {
		console.log('RESEND_API_KEY is not defined. Responding in simulation mode.');
		return {
			status: 200,
			body: {
				success: true,
				mode: 'simulation',
				message: 'Message received in simulation mode.',
			},
		};
	}

	try {
		const resendObj = new Resend(resendKey);
		const safeName = escapeHtml(String(name));
		const safeEmail = escapeHtml(String(email));
		const safeCompany = escapeHtml(String(company || 'None'));
		const safeMessage = escapeHtml(String(message));

		const mailData = await resendObj.emails.send({
			from: fromAddress,
			to: toAddress,
			subject: `New Portfolio Message: ${name} from ${company || 'New Client'}`,
			replyTo: email,
			text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || 'None'}\n\nMessage:\n${message}`,
			html: `
          <div style="font-family: sans-serif; padding: 24px; color: #1c1c1f; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h2 style="color: #0ea5e9; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-top: 0;">Portfolio Briefing</h2>
            <p style="margin: 8px 0;"><strong>Name:</strong> ${safeName}</p>
            <p style="margin: 8px 0;"><strong>Email:</strong> ${safeEmail}</p>
            <p style="margin: 8px 0;"><strong>Company:</strong> ${safeCompany}</p>
            <div style="background-color: #f8fafc; padding: 16px; border-radius: 6px; margin-top: 16px; border-left: 4px solid #38bdf8; white-space: pre-line; line-height: 1.6;">
              ${safeMessage}
            </div>
          </div>
        `,
		});

		if (mailData.error) {
			console.error('Resend API returned error status:', mailData.error);
			return {
				status: 500,
				body: {
					success: false,
					error: mailData.error.message || 'Failed to send message.',
				},
			};
		}

		console.log(`Resend email sent successfully! ID: ${mailData.data?.id}`);
		return {
			status: 200,
			body: {
				success: true,
				mode: 'live',
				message: 'Message sent successfully.',
				id: mailData.data?.id,
			},
		};
	} catch (error: unknown) {
		console.error('Resend transmission failure:', error);
		const message =
			error instanceof Error ? error.message : 'Failed to send message.';
		return {
			status: 500,
			body: {
				success: false,
				error: message,
			},
		};
	}
}
