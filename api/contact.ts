import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleContactSubmission } from './_contactLogic.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
	try {
		if (req.method !== 'POST') {
			return res
				.status(405)
				.json({ success: false, error: 'Method not allowed.' });
		}

		const result = await handleContactSubmission(req.body ?? {});
		return res.status(result.status).json(result.body);
	} catch (error: unknown) {
		console.error('Contact API handler failure:', error);
		const message =
			error instanceof Error ? error.message : 'Internal server error.';
		return res.status(500).json({ success: false, error: message });
	}
}
