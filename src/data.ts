import { OperatingPrinciple, Project } from './types';

export const profile = {
	title: 'Full Stack Software Engineer',
	tagline: 'complex, messy',
	taglineSuffix: 'workflows.',
	summary:
		'Full-stack engineer in regulated fintech. I automate manual configuration work, ship state-based compliance features across thousands of kiosks, and stay close to production logs when things break.',
	availability: 'AVAILABLE FOR NEW PRODUCTION WORK · OTTAWA, CANADA',
};

export const projects: Project[] = [
	{
		id: 'bitcoin-depot',
		title: 'Bitcoin Depot / Bitaccess',
		subtitle: 'Regulated fintech · Bitcoin ATM fleet',
		role: 'Full Stack Software Engineer',
		description:
			'Full-stack work on transaction-critical kiosk software—from QA and technical operations through production engineering on a fleet generating $600M+ in annual revenue.',
		highlights: [
			'Automated legacy configuration logic for transaction-critical flows, eliminating 100% of manual configuration errors.',
			'Led state-based regulatory projects with custom UI/UX across the Bitcoin ATM fleet.',
			'Upgraded repositories from Node 18 to 20, improving performance by 10–15%.',
			'Validated behavior across 9,000+ kiosks and enabled remote BTM simulator testing, saving ~20 minutes per hour of QA capacity.',
			'Recognized as the highest-performing developer in 2025 performance reviews.',
		],
		links: [{ label: 'Bitcoin Depot', url: 'https://bitcoindepot.com' }],
		techStack: [
			'Node.js',
			'React',
			'TypeScript',
			'json-rules-engine',
			'Playwright',
			'Vitest',
			'Express.js',
			'MongoDB',
			'Docker',
		],
		metric: '$600M+',
		metricLabel: 'Annual Fleet Revenue',
		type: 'fintech',
		architecturalInsight: {
			label: 'Regulated kiosk transaction pipeline',
			description:
				'State-based regulatory rules with json-rules-engine, full-flow regression testing before commits, and production troubleshooting with Mezmo, Grafana, and Amplitude across a Linux-based kiosk fleet.',
		},
	},
	{
		id: 'permipro',
		title: 'PermiPro',
		subtitle: 'Municipal permit SaaS',
		role: 'Founding Engineer',
		description:
			'Founding engineer on a municipal permit platform that reduces administrative costs by 60% and turnaround time by 75%.',
		highlights: [
			'Built core SaaS infrastructure: authentication, role-based permissions, and multi-tenant access control.',
			'Implemented transactional email, multi-step forms, and workflow automation for permit applications.',
			'Designed systems for applicants, inspectors, and administrators across municipal workflows.',
		],
		links: [{ label: 'Visit PermiPro', url: 'https://permipro.io' }],
		techStack: [
			'React',
			'TypeScript',
			'Next.js',
			'Node.js',
			'PostgreSQL',
			'Tailwind CSS',
			'RBAC',
			'Transactional Email',
		],
		metric: '75%',
		metricLabel: 'Turnaround Time Reduction',
		type: 'startup',
		architecturalInsight: {
			label: 'Multi-role municipal workflow portal',
			description:
				'Role-based permissions for applicants, inspectors, and administrators—with multi-step forms, file attachments, and automated workflow transitions across tenant municipalities.',
		},
	},
	{
		id: 'faceout',
		title: 'Faceout',
		subtitle: 'Web studio for local businesses',
		role: 'Founder',
		description:
			'Founded and built a web studio platform for local business websites, SEO, and Google Business Profile management.',
		highlights: [
			'Built the platform with Next.js, React, TypeScript, and Tailwind on Vercel.',
			'Integrated Resend for transactional email and Vitest for automated testing.',
			'Generating $1K in monthly recurring revenue.',
		],
		links: [{ label: 'Visit Faceout Studio', url: 'https://faceout.ca' }],
		techStack: [
			'Next.js',
			'React',
			'TypeScript',
			'Tailwind CSS',
			'Vercel',
			'Resend',
			'Vitest',
		],
		metric: '$1K',
		metricLabel: 'Monthly Recurring Revenue',
		type: 'agency',
		architecturalInsight: {
			label: 'Local business web platform',
			description:
				'Next.js and React on Vercel with Resend for client communications, Vitest for regression coverage, and SEO tooling for regional business visibility.',
		},
	},
];

export const operatingPrinciples: OperatingPrinciple[] = [
	{
		title: 'I automate messy workflows.',
		subtitle: 'Product ⇄ Operations ⇄ Code',
		description:
			'The best fixes remove manual steps before they become production incidents. I focus on automating configuration and compliance logic that ops teams previously had to handle by hand.',
		iconName: 'git-branch',
		caseStudy: {
			problem:
				'Legacy configuration logic for transaction-critical flows relied on manual steps, introducing configuration errors in production.',
			solution:
				'Automated the configuration pipeline for transaction-critical flows—replacing manual updates with validated, repeatable automation.',
			impact: 'Eliminated 100% of manual configuration errors in those flows.',
		},
	},
	{
		title: 'I care about rollouts.',
		subtitle: 'Beyond the local dev server',
		description:
			'Features are not done until they survive real hardware, real regions, and real regulatory constraints. I have led rollouts across Canada, Australia, Hong Kong, Brazil, and Mexico.',
		iconName: 'rocket',
		caseStudy: {
			problem:
				'State-based regulatory requirements demanded custom UI/UX across a large Bitcoin ATM fleet, with high risk if rollouts broke in the field.',
			solution:
				'Led state-based regulatory projects and served as lead operator for multi-region production rollouts while onboarding Bitcoin Depot as a strategic Bitaccess client.',
			impact:
				'Delivered compliant kiosk experiences at scale; helped scale the strategic client relationship to $50M+ in monthly revenue during the Bitaccess acquisition period.',
		},
	},
	{
		title: 'I stay close to production.',
		subtitle: 'Logs, telemetry, and customer reality',
		description:
			'I came up through QA and technical operations before full-stack engineering. I debug with logs, simulators, and the same tools ops teams use when kiosks misbehave in the field.',
		iconName: 'activity',
		caseStudy: {
			problem:
				'Validating behavior across 9,000+ kiosks was slow, and production escalations required fast cross-system debugging under time pressure.',
			solution:
				'Enabled remote BTM simulator testing, wrote detailed tickets with logs and reproduction steps, and investigated incidents using Mezmo, Grafana, Amplitude, and admin panels.',
			impact:
				'Improved QA throughput by ~20 minutes per hour while supporting workflows tied to millions of customer transactions.',
		},
	},
];

export const educationAndDetails = {
	address: 'Ottawa, ON, Canada',
	phone: '(613) 869-5116',
	email: 'griffin.leblanc@gmail.com',
	website: 'https://griffinleblanc.ca',
	github: 'https://github.com/g8-bd',
	linkedin: 'https://www.linkedin.com/in/griffinleblanc',
	resumeUrl: '/griffin-leblanc-resume.pdf',
	education: 'Bachelor of Commerce, Finance — Dalhousie University (2020)',
};
