import {
  Activity,
  AlertCircle,
  ArrowRight,
  Check,
  ChevronRight,
  Clock,
  Cpu,
  Database,
  ExternalLink,
  FileText,
  GitBranch,
  Github,
  Linkedin,
  Mail,
  Menu,
  Play,
  Rocket,
  ShieldCheck,
  Sliders,
  Terminal,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useRef, useState } from 'react';
import {
  educationAndDetails,
  operatingPrinciples,
  profile,
  projects,
} from './data';
import {
  OperatingPrinciple,
  Project,
  RuleEvaluationResult,
  RuleInput,
} from './types';

export default function App() {
	// Navigation & UI States
	const [activeSection, setActiveSection] = useState('hero');
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [selectedPrinciple, setSelectedPrinciple] = useState<number>(0);
	const [selectedProject, setSelectedProject] =
		useState<string>('bitcoin-depot');

	// Local clock state for Ottawa local time (Eastern Standard/Daylight offset)
	const [ottawaTime, setOttawaTime] = useState('');

	// Regulatory sandbox model states
	const [sandboxAmount, setSandboxAmount] = useState<number>(2500);
	const [sandboxKyc, setSandboxKyc] = useState<
		'unverified' | 'phone_verified' | 'id_verified'
	>('phone_verified');
	const [sandboxProvince, setSandboxProvince] = useState<string>('ON');
	const [sandboxPEP, setSandboxPEP] = useState<boolean>(false);
	const [sandboxIsEvaluating, setSandboxIsEvaluating] =
		useState<boolean>(false);
	const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);
	const [sandboxResult, setSandboxResult] =
		useState<RuleEvaluationResult | null>(null);

	// Message board interactive logs
	const [contactName, setContactName] = useState('');
	const [contactEmail, setContactEmail] = useState('');
	const [contactCompany, setContactCompany] = useState('');
	const [contactMsg, setContactMsg] = useState('');
	const [messagesLog, setMessagesLog] = useState<
		{
			id: string;
			timestamp: string;
			sender: string;
			company: string;
			payload: string;
		}[]
	>([]);
	const [isSendingMessage, setIsSendingMessage] = useState(false);
	const [messageSuccess, setMessageSuccess] = useState(false);
	const [contactError, setContactError] = useState<string | null>(null);
	const [resendStatus, setResendStatus] = useState<'live' | 'simulated' | null>(
		null,
	);

	// Set Ottawa Live Time (UTC-4 during Daylight Saving, otherwise UTC-5)
	useEffect(() => {
		const updateTime = () => {
			const now = new Date();
			// Format specifically to Eastern Time
			const formatter = new Intl.DateTimeFormat('en-US', {
				timeZone: 'America/Toronto',
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: true,
			});
			setOttawaTime(formatter.format(now));
		};

		updateTime();
		const interval = setInterval(updateTime, 1000);
		return () => clearInterval(interval);
	}, []);

	// Preset quick buttons for compliance engine
	const applySandboxScenario = (
		amount: number,
		kyc: 'unverified' | 'phone_verified' | 'id_verified',
		prov: string,
		pep: boolean,
	) => {
		setSandboxAmount(amount);
		setSandboxKyc(kyc);
		setSandboxProvince(prov);
		setSandboxPEP(pep);
		setSandboxResult(null);
		setSandboxLogs(['State synchronized. Ready to validate rules.']);
	};

	// Rule engine simulation evaluation logic (clean TypeScript, client-side, zero delay bugs)
	const runRuleEngine = () => {
		setSandboxIsEvaluating(true);
		setSandboxResult(null);
		setSandboxLogs(['Initializing compliance execution context...']);

		const logs: string[] = [];
		const pushLog = (txt: string) => {
			logs.push(`[${new Date().toLocaleTimeString()}] ${txt}`);
		};

		setTimeout(() => {
			pushLog('Connecting to local rules policy provider...');
			pushLog(
				`Payload loaded: amount=${sandboxAmount}, kyc=${sandboxKyc}, province=${sandboxProvince}, PEP=${sandboxPEP}`,
			);
			pushLog(
				`Verifying active rule schemas corresponding to province constraint: ${sandboxProvince}`,
			);

			// Evaluate Rule 1: Restricted Party AML Screening
			let r1Result: 'SKIPPED' | 'PASSED' | 'FAILED' = 'PASSED';
			if (sandboxPEP) {
				r1Result = 'FAILED';
				pushLog(
					'Rule Match: CRITICAL_PEP_ALERT triggers. Politically Exposed Persons list triggers override check.',
				);
			} else {
				pushLog('Rule Skip: User clean of PEP Sanctions list scans.');
			}

			// Evaluate Rule 2: KYC threshold limits
			let r2Result: 'SKIPPED' | 'PASSED' | 'FAILED' = 'PASSED';
			let r2Msg = '';
			pushLog("Evaluating limits verification rule: 'validate_aml_thresholds'");

			if (sandboxAmount >= 9000) {
				r2Result = 'FAILED';
				r2Msg = `Transaction volume ($${sandboxAmount}) sits above maximum compliance regulatory cap of $9,000 for local cash points.`;
				pushLog(
					`Rule Match: MAX_TRANSACTION_CEILING_EXCEEDED (Amount $${sandboxAmount} exceeds $9,000 limit)`,
				);
			} else if (sandboxAmount >= 1500 && sandboxKyc !== 'id_verified') {
				r2Result = 'FAILED';
				r2Msg = `Transaction amount $${sandboxAmount} exceeds anonymous ceiling of $1,500. Identity Verification is strictly required.`;
				pushLog(
					`Rule Match: KYC_ELEVATION_REQUIRED (Present KYC: ${sandboxKyc})`,
				);
			} else if (sandboxAmount >= 500 && sandboxKyc === 'unverified') {
				r2Result = 'FAILED';
				r2Msg = `Transactions above $500 require phone verification to combat remote kiosk scam risk.`;
				pushLog(
					`Rule Match: PHONE_AUTHENTICATION_REQUIRED (Present KYC: unverified)`,
				);
			} else {
				pushLog(
					'Rule Pass: Transaction amount sits within boundaries for present verification states.',
				);
			}

			// Evaluate Rule 3: Geographic Restrict list (Regulatory compliance)
			let r3Result: 'SKIPPED' | 'PASSED' | 'FAILED' = 'PASSED';
			let r3Msg = '';
			pushLog(
				`Evaluating state restriction schema: 'verify_geographic_rules' for ${sandboxProvince}`,
			);

			// Suppose NY and QC have restricted rules
			if (sandboxProvince === 'NY' && sandboxAmount > 1000) {
				r3Result = 'FAILED';
				r3Msg =
					'New York BitLicense rules impose maximum anonymous limits of $1000 in local operations.';
				pushLog(
					'Rule Match: GEOGRAPHIC_COMPLIANCE_LIMIT (NY BitLicense limitation triggered on active amount)',
				);
			} else {
				pushLog(
					`Rule Pass: Geographic jurisdiction validation accepted for ${sandboxProvince}.`,
				);
			}

			// Final aggregation
			let finalAction:
				| 'APPROVE'
				| 'USER_ID_PROMPT'
				| 'BLOCK_TRANSACTION'
				| 'ESCALATE_MANUAL' = 'APPROVE';
			let finalReason =
				'Transaction fits within risk profile. Approved to advance to cashier payout queue.';

			if (sandboxPEP) {
				finalAction = 'BLOCK_TRANSACTION';
				finalReason =
					'Compliance block. Politically Exposed Person match detected. Transaction aborted and reported to FINTRAC logs.';
			} else if (sandboxAmount >= 9000) {
				finalAction = 'BLOCK_TRANSACTION';
				finalReason = r2Msg;
			} else if (sandboxAmount >= 1500 && sandboxKyc !== 'id_verified') {
				finalAction = 'USER_ID_PROMPT';
				finalReason = r2Msg;
			} else if (sandboxAmount >= 500 && sandboxKyc === 'unverified') {
				finalAction = 'USER_ID_PROMPT';
				finalReason = r2Msg;
			} else if (sandboxProvince === 'NY' && sandboxAmount > 1000) {
				finalAction = 'ESCALATE_MANUAL';
				finalReason = r3Msg;
			}

			pushLog('Compiling final regulatory evaluation framework results.');
			pushLog(
				`Result: ${finalAction} | Code: ${finalAction === 'APPROVE' ? '200' : '403'}`,
			);

			setSandboxLogs([...logs]);
			setSandboxResult({
				passed: finalAction === 'APPROVE',
				actionRequired: finalAction,
				reason: finalReason,
				stepsEvaluated: [
					{
						ruleName: 'CRITICAL_PEP_ALERT',
						result: r1Result,
						log: sandboxPEP
							? 'Matched sanction restriction list.'
							: 'No sanction matches found.',
					},
					{
						ruleName: 'VALIDATE_AML_THRESHOLDS',
						result: r2Result,
						log: r2Msg || 'Transaction value within boundaries.',
					},
					{
						ruleName: 'VERIFY_GEOGRAPHIC_RULES',
						result: r3Result,
						log: r3Msg || 'No geographic exceptions triggered.',
					},
				],
			});
			setSandboxIsEvaluating(false);
		}, 1200);
	};

	// Run initial default sandbox scenario on mount
	useEffect(() => {
		runRuleEngine();
	}, []);

	// Contact simulated message handler with secure Express proxy call to Resend
	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!contactName || !contactEmail || !contactMsg) return;

		setIsSendingMessage(true);
		setContactError(null);
		setResendStatus(null);
		setMessageSuccess(false);

		try {
			const response = await fetch('/api/contact', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: contactName,
					email: contactEmail,
					company: contactCompany,
					message: contactMsg,
				}),
			});

			const contentType = response.headers.get('content-type') ?? '';
			if (!contentType.includes('application/json')) {
				throw new Error(
					'Contact API unavailable. Email griffin.leblanc@gmail.com directly.',
				);
			}

			const data = await response.json();

			if (!response.ok || !data.success) {
				throw new Error(
					data.error || 'Failed to transmit message payload safely.',
				);
			}

			// Successful dispatch
			const simulatedId =
				data.id || `TX-${Math.floor(1000 + Math.random() * 9000)}`;
			const isSimulation = data.mode === 'simulation';

			setResendStatus(isSimulation ? 'simulated' : 'live');

			const newMsg = {
				id: simulatedId,
				timestamp: new Date().toLocaleTimeString(),
				sender: contactName,
				company: contactCompany || 'Independent',
				payload: isSimulation
					? `[SIMULATED TRANSMISSION] ${contactMsg}`
					: contactMsg,
			};

			setMessagesLog((prev) => [newMsg, ...prev]);
			setMessageSuccess(true);

			// Clear inputs
			setContactName('');
			setContactEmail('');
			setContactCompany('');
			setContactMsg('');

			setTimeout(() => setMessageSuccess(false), 8000);
		} catch (err: any) {
			console.error('Transmission error:', err);
			setContactError(
				err.message || 'An unexpected network error was recorded.',
			);
		} finally {
			setIsSendingMessage(false);
		}
	};

	return (
		<div className="min-h-screen bg-brand-obsidian text-brand-silver font-sans relative overflow-x-hidden antialiased selection:bg-brand-mint selection:text-brand-obsidian">
			{/* Elegant Dark Ambient Gradients */}
			<div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-mint/5 rounded-full blur-[120px] -mr-48 -mt-48 pointer-events-none z-0" />
			<div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -ml-32 -mb-32 pointer-events-none z-0" />

			{/* Decorative Matrix Background - Subtle Lines */}
			<div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(28,28,31,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(28,28,31,0.4)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none z-0" />

			{/* HEADER NAVBAR */}
			<header className="sticky top-0 z-50 backdrop-blur-md bg-brand-obsidian/85 border-b border-brand-slate py-4 px-6 md:px-12 transition-all">
				<div className="max-w-7xl mx-auto flex items-center justify-between">
					<a
						href="#top"
						className="flex items-center gap-3 group"
						id="nav-logo"
					>
						<span className="h-9 w-9 bg-brand-slate border border-brand-mint/30 text-brand-mint font-display font-medium text-lg flex items-center justify-center rounded-none shadow-[0_0_10px_rgba(56,189,248,0.05)] group-hover:border-brand-mint group-hover:shadow-[0_0_15px_rgba(56,189,248,0.2)] transition-all">
							GL
						</span>
						<div className="flex flex-col">
							<span className="font-display font-medium text-sm tracking-wide text-brand-silver group-hover:text-brand-mint transition-colors">
								GRIFFIN LEBLANC
							</span>
							<span className="font-mono text-[10px] text-brand-concrete tracking-wider">
								{profile.title.toUpperCase()}
							</span>
						</div>
					</a>

					{/* Desktop Navigation */}
					<nav className="hidden md:flex items-center gap-8">
						<a
							href="#operating-style"
							className="font-mono text-xs text-brand-concrete hover:text-brand-mint transition-colors tracking-widest uppercase"
						>
							// 01. OPERATING STYLE
						</a>
						<a
							href="#regulatory-sandbox"
							className="font-mono text-xs text-brand-concrete hover:text-brand-mint transition-colors tracking-widest uppercase"
						>
							// 02. COMPLIANCE SANDBOX
						</a>
						<a
							href="#featured-work"
							className="font-mono text-xs text-brand-concrete hover:text-brand-mint transition-colors tracking-widest uppercase"
						>
							// 03. FEATURED WORK
						</a>
						<a
							href="#contact"
							className="font-mono text-xs text-brand-concrete hover:text-brand-mint transition-colors tracking-widest uppercase"
						>
							// 04. CONTACT/PING
						</a>
					</nav>

					{/* Status Monitor (Real Ottawa local clock and live deployment signifier) */}
					<div className="hidden lg:flex items-center gap-5 border-l border-brand-slate pl-6 font-mono text-xs text-brand-concrete">
						<div className="flex items-center gap-2">
							<span className="relative flex h-2 w-2">
								<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-mint opacity-75"></span>
								<span className="relative inline-flex rounded-full h-2 w-2 bg-brand-mint"></span>
							</span>
							<span className="text-brand-silver font-semibold tracking-wider text-[11px]">
								STATUS: RESILIENT
							</span>
						</div>
						<div className="flex items-center gap-1.5 text-brand-concrete text-[11px]">
							<Clock size={12} className="text-brand-mint" />
							<span>OTTAWA (EST) {ottawaTime || 'DYNAMIC CLOCK'}</span>
						</div>
					</div>

					{/* Mobile Hamburguer Control */}
					<button
						type="button"
						className="md:hidden text-brand-concrete hover:text-brand-mint transition-colors"
						onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
						id="mobile-menu-btn"
					>
						{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
					</button>
				</div>
			</header>

			{/* Mobile Drawer */}
			<AnimatePresence>
				{mobileMenuOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						transition={{ duration: 0.2 }}
						className="md:hidden border-b border-brand-slate bg-brand-coal/95 relative z-40 px-6 py-6"
						id="mobile-drawer"
					>
						<div className="flex flex-col gap-5 font-mono text-sm">
							<a
								href="#operating-style"
								className="text-brand-concrete hover:text-brand-mint py-2 border-b border-brand-slate/50"
								onClick={() => setMobileMenuOpen(false)}
							>
								// 01. Operating Style
							</a>
							<a
								href="#regulatory-sandbox"
								className="text-brand-concrete hover:text-brand-mint py-2 border-b border-brand-slate/50"
								onClick={() => setMobileMenuOpen(false)}
							>
								// 02. Compliance Sandbox
							</a>
							<a
								href="#featured-work"
								className="text-brand-concrete hover:text-brand-mint py-2 border-b border-brand-slate/50"
								onClick={() => setMobileMenuOpen(false)}
							>
								// 03. Featured Work
							</a>
							<a
								href="#contact"
								className="text-brand-concrete hover:text-brand-mint py-2"
								onClick={() => setMobileMenuOpen(false)}
							>
								// 04. Contact & Telemetry
							</a>

							<div className="pt-4 border-t border-brand-slate flex flex-col gap-3 text-xs text-brand-concrete">
								<div className="flex items-center gap-2">
									<span className="h-2 w-2 rounded-full bg-brand-mint"></span>
									<span className="text-brand-silver">
										System: SECURE & READY
									</span>
								</div>
								<div className="flex items-center gap-2">
									<Clock size={12} className="text-brand-mint" />
									<span>Ottawa Time: {ottawaTime || 'EST'}</span>
								</div>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			<main className="max-w-7xl mx-auto px-6 md:px-12 py-12 relative z-10">
				{/* HERO SECTION */}
				<section
					className="min-h-[80vh] flex flex-col justify-center py-12 md:py-20"
					id="hero"
				>
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
						<div className="lg:col-span-7 space-y-8">
							<motion.div
								initial={{ opacity: 0, y: 15 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5 }}
								className="inline-flex items-center gap-2 px-3 py-1 bg-brand-slate/80 border border-brand-slate rounded-none shadow-inner"
							>
								<span className="relative flex h-2 w-2">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-mint opacity-100"></span>
									<span className="relative inline-flex rounded-full h-2 w-2 bg-brand-mint"></span>
								</span>
								<span className="font-mono text-[9px] tracking-widest text-brand-mint uppercase font-semibold">
									{profile.availability}
								</span>
							</motion.div>

							<div className="space-y-4">
								<motion.h1
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: 0.1 }}
									className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.08]"
								>
									I craft products for <br />
									<span className="italic font-serif text-brand-mint font-normal text-5xl sm:text-6.5xl lg:text-[76px] tracking-tight block my-1">
										{profile.tagline}
									</span>
									{profile.taglineSuffix}
								</motion.h1>

								<motion.p
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.5, delay: 0.2 }}
									className="text-brand-concrete text-base sm:text-lg max-w-xl leading-relaxed font-sans"
								>
									{profile.summary}
								</motion.p>
							</div>

							{/* Action Rows */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.5, delay: 0.3 }}
								className="flex flex-wrap gap-4 pt-4"
							>
								<a
									href="#regulatory-sandbox"
									className="inline-flex items-center gap-2 bg-brand-mint hover:bg-brand-mint-accent text-brand-obsidian font-bold uppercase tracking-wider px-6 py-3.5 rounded-none text-xs transition-colors shadow-[0_4px_20px_rgba(56,189,248,0.15)] hover:shadow-[0_4px_25px_rgba(56,189,248,0.3)] transform hover:-translate-y-0.5"
								>
									<Terminal size={16} />
									Run Regulatory Sandbox
								</a>
								<a
									href="#featured-work"
									className="inline-flex items-center gap-2 bg-brand-slate hover:bg-brand-slate/80 border border-brand-slate text-brand-silver hover:text-white font-bold uppercase tracking-wider px-6 py-3.5 rounded-none text-xs transition-colors"
								>
									Featured Work
									<ArrowRight size={16} />
								</a>
								<a
									href={educationAndDetails.resumeUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-2 bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 text-brand-concrete hover:text-brand-silver px-6 py-3.5 rounded-none text-xs transition-all font-mono"
								>
									<FileText size={16} />
									Resume.pdf
								</a>
							</motion.div>

							{/* Quick Profile Links */}
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 0.5, delay: 0.4 }}
								className="flex items-center gap-6 pt-4 text-brand-concrete text-xs font-mono"
							>
								<span className="text-white font-bold">// DIRECT PINGS</span>
								<a
									href={educationAndDetails.linkedin}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-1 hover:text-brand-mint transition-colors"
								>
									<Linkedin size={14} /> /griffinleblanc
								</a>
								<a
									href={educationAndDetails.github}
									target="_blank"
									rel="noopener noreferrer"
									className="flex items-center gap-1 hover:text-brand-mint transition-colors"
								>
									<Github size={14} /> /g8-bd
								</a>
								<a
									href={`mailto:${educationAndDetails.email}`}
									className="flex items-center gap-1 hover:text-brand-mint transition-colors"
								>
									<Mail size={14} /> griffin.leblanc@gmail.com
								</a>
							</motion.div>
						</div>

						{/* TELEMETRY VISUAL SIDEBAR CONTAINER */}
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.6, delay: 0.2 }}
							className="lg:col-span-5 relative"
						>
							<div className="absolute inset-0 bg-brand-mint/5 blur-3xl rounded-full pointer-events-none" />

							{/* Fake Terminal Dashboard */}
							<div className="relative bg-brand-coal border border-brand-slate rounded-xl overflow-hidden shadow-2xl">
								{/* Window header */}
								<div className="bg-brand-slate/40 border-b border-brand-slate px-4 py-3 flex items-center justify-between">
									<div className="flex items-center gap-2">
										<span className="w-3 h-3 rounded-full bg-red-500/85"></span>
										<span className="w-3 h-3 rounded-full bg-yellow-500/85"></span>
										<span className="w-3 h-3 rounded-full bg-green-500/85"></span>
										<span className="font-mono text-xs text-brand-concrete ml-2">
											griffin-production-agent.sh
										</span>
									</div>
									<span className="font-mono text-[9px] px-2 py-0.5 rounded bg-brand-slate text-brand-mint border border-brand-mint/10">
										LIVE METRIC
									</span>
								</div>

								<div className="p-6 space-y-6 font-mono text-xs">
									{/* Status Indicator Bar */}
									<div className="space-y-2 border-b border-brand-slate/40 pb-5">
										<p className="text-brand-concrete">
											// PRODUCTION STACK VALIDATED
										</p>
										<div className="grid grid-cols-2 gap-3 text-[11px]">
											<div className="bg-brand-slate/30 p-2.5 rounded border border-brand-slate/50">
												<span className="text-brand-concrete block text-[10px]">
													CONFIG AUTOMATION
												</span>
												<span className="text-brand-mint font-semibold">
													100% ERRORS ELIMINATED
												</span>
											</div>
											<div className="bg-brand-slate/30 p-2.5 rounded border border-brand-slate/50">
												<span className="text-brand-concrete block text-[10px]">
													KIOSK NETWORK
												</span>
												<span className="text-brand-silver font-semibold">
													9,000+ VALIDATED
												</span>
											</div>
										</div>
									</div>

									{/* Operational Telemetry Metrics */}
									<div className="space-y-3 pb-5 border-b border-brand-slate/40">
										<div className="flex justify-between items-center text-[11px]">
											<span className="text-brand-concrete text-xs flex items-center gap-1.5">
												<Cpu size={14} className="text-brand-mint" />
												Node 18 → 20 upgrade
											</span>
											<span className="text-brand-mint-accent">
												10–15% faster
											</span>
										</div>
										{/* Fake visual bar */}
										<div className="w-full h-1.5 bg-brand-slate rounded-full overflow-hidden">
											<div className="bg-brand-mint h-full rounded-full w-[88%]" />
										</div>

										<div className="flex justify-between items-center text-[11px]">
											<span className="text-brand-concrete text-xs flex items-center gap-1.5">
												<Database size={14} className="text-brand-mint" />
												Remote BTM simulator QA
											</span>
											<span className="text-brand-mint-accent">
												~20 min/hr saved
											</span>
										</div>
										<div className="w-full h-1.5 bg-brand-slate rounded-full overflow-hidden">
											<div className="bg-brand-mint h-full rounded-full w-[82%]" />
										</div>

										<div className="flex justify-between items-center text-[11px]">
											<span className="text-brand-concrete text-xs flex items-center gap-1.5">
												<Activity size={14} className="text-brand-mint" />
												Faceout studio MRR
											</span>
											<span className="text-brand-mint-accent">
												$1K / month
											</span>
										</div>
										<div className="w-full h-1.5 bg-brand-slate rounded-full overflow-hidden">
											<div className="bg-brand-mint h-full rounded-full w-full" />
										</div>
									</div>

									{/* Shell Code Printout */}
									<div className="space-y-1 text-brand-concrete text-[10.5px]">
										<p className="text-brand-mint">
											$ npm run deploy -- --profile=griffin
										</p>
										<p className="text-brand-silver">
											✓ Loaded: Bitcoin Depot, PermiPro, Faceout
										</p>
										<p className="text-brand-silver">
											✓ Node 20 upgrade validated across repos
										</p>
										<p className="text-brand-silver">
											✓ json-rules-engine compliance sandbox ready
										</p>
										<p className="text-[#34D399] animate-pulse-slow">
											&gt; Top performer 2025 · Ottawa, ON
										</p>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</section>

				{/* SECTION 1: OPERATING STYLE */}
				<section
					className="py-20 border-t border-brand-slate"
					id="operating-style"
				>
					<div className="space-y-10">
						<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
							<div className="space-y-2">
								<span className="font-mono text-xs text-brand-mint tracking-wider uppercase">
									// 01. CRITICAL PHILOSOPHY
								</span>
								<h2 className="font-display text-3xl font-bold tracking-tight text-white mb-2">
									Operating style built for the real world.
								</h2>
								<p className="text-brand-concrete max-w-xl text-sm">
									I came up through QA and technical operations at Bitaccess and
									Bitcoin Depot before moving into full-stack engineering. These
									are real problems I have worked on—not hypotheticals.
								</p>
							</div>
							<div className="text-right">
								<span className="font-mono text-xs text-brand-concrete">
									SELECT PRINCIPLE TO VIEW CASE STUDY
								</span>
							</div>
						</div>

						{/* Operating style visual tabs card layout */}
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
							{/* TABS SELECTOR */}
							<div className="lg:col-span-5 flex flex-col gap-4">
								{operatingPrinciples.map((principle, index) => {
									const isSelected = selectedPrinciple === index;
									return (
										<button
											key={principle.title}
											type="button"
											onClick={() => setSelectedPrinciple(index)}
											className={`text-left p-5 rounded-none border transition-all relative overflow-hidden group ${
												isSelected
													? 'bg-brand-coal border-brand-mint/45 shadow-md'
													: 'bg-transparent border-brand-slate hover:bg-brand-coal/30 hover:border-brand-concrete/30'
											}`}
										>
											{isSelected && (
												<div className="absolute top-0 left-0 bottom-0 w-1 bg-brand-mint" />
											)}

											<div className="flex items-start gap-4">
												<div
													className={`p-2.5 rounded-none border ${
														isSelected
															? 'bg-brand-slate text-brand-mint border-brand-mint/20'
															: 'bg-brand-coal border-brand-slate text-brand-concrete group-hover:text-brand-mint transition-colors'
													}`}
												>
													{index === 0 && <GitBranch size={18} />}
													{index === 1 && <Rocket size={18} />}
													{index === 2 && <Activity size={18} />}
												</div>
												<div className="space-y-1">
													<h3
														className={`font-display font-semibold text-base ${
															isSelected
																? 'text-white'
																: 'text-brand-silver group-hover:text-white transition-colors'
														}`}
													>
														{principle.title}
													</h3>
													<p className="font-mono text-[11px] text-brand-mint uppercase tracking-wider">
														{principle.subtitle}
													</p>
													<p className="text-brand-concrete/90 text-xs line-clamp-2 md:line-clamp-none font-sans pt-1">
														{principle.description}
													</p>
												</div>
											</div>
										</button>
									);
								})}
							</div>

							{/* LIVE CASE STUDY VIEWER */}
							<div className="lg:col-span-7">
								<AnimatePresence mode="wait">
									<motion.div
										key={selectedPrinciple}
										initial={{ opacity: 0, x: 20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: -20 }}
										transition={{ duration: 0.3 }}
										className="bg-brand-coal border border-brand-slate rounded-none p-6 md:p-8 space-y-6 h-full flex flex-col justify-between"
									>
										<div className="space-y-4">
											<div className="flex items-center justify-between border-b border-brand-slate/40 pb-4">
												<div className="flex items-center gap-2">
													<span className="p-1.5 rounded-none bg-brand-mint/10 border border-brand-mint/20 text-brand-mint">
														<ShieldCheck size={14} />
													</span>
													<span className="font-mono text-xs text-brand-concrete uppercase tracking-widest">
														PRODUCTION METRIC LOGS INFO
													</span>
												</div>
												<span className="font-mono text-[11px] text-brand-concrete">
													CASE STUDY #0{selectedPrinciple + 1}
												</span>
											</div>

											<div className="space-y-1">
												<span className="text-brand-concrete text-xs font-mono uppercase tracking-widest block">
													SELECTED PHILOSOPHY:
												</span>
												<h3 className="font-display font-bold text-2xl text-white">
													{operatingPrinciples[selectedPrinciple].title}
												</h3>
												<p className="font-mono text-xs text-brand-mint">
													{operatingPrinciples[selectedPrinciple].subtitle}
												</p>
											</div>

											<p className="text-brand-concrete text-sm leading-relaxed">
												A real engineering challenge from Bitcoin Depot,
												Bitaccess, or PermiPro—what broke, what I built, and
												what changed downstream.
											</p>

											{/* Problem, Solution, Impact flow Grid */}
											<div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
												<div className="bg-brand-slate/20 border border-brand-slate/40 p-4 rounded-none space-y-2">
													<span className="font-mono text-[10px] text-red-500 font-semibold uppercase tracking-wider block">
														THE REAL WORK / PROBLEM:
													</span>
													<p className="text-xs text-brand-silver leading-relaxed">
														{
															operatingPrinciples[selectedPrinciple].caseStudy
																.problem
														}
													</p>
												</div>

												<div className="bg-brand-slate/20 border border-brand-slate/40 p-4 rounded-none space-y-2">
													<span className="font-mono text-[10px] text-brand-mint font-semibold uppercase tracking-wider block">
														THE ENGINEER'S COUNTERMEASURE:
													</span>
													<p className="text-xs text-brand-silver leading-relaxed">
														{
															operatingPrinciples[selectedPrinciple].caseStudy
																.solution
														}
													</p>
												</div>
											</div>
										</div>

										{/* Highlighted core highlight banner */}
										<div className="bg-brand-mint/5 border border-brand-mint/20 rounded-none p-4 flex items-center justify-between">
											<div className="space-y-1">
												<span className="font-mono text-[10px] text-brand-mint font-semibold uppercase tracking-widest block">
													VERIFIED ROLLOUT OUTCOME:
												</span>
												<span className="text-xs text-white antialiased">
													{
														operatingPrinciples[selectedPrinciple].caseStudy
															.impact
													}
												</span>
											</div>
											<div className="h-2 w-2 rounded-full bg-brand-mint animate-pulse-slow shrink-0 ml-4 hidden sm:block" />
										</div>
									</motion.div>
								</AnimatePresence>
							</div>
						</div>
					</div>
				</section>

				{/* SECTION 2: INTERACTIVE COMPLIANCE DECISION SANDBOX */}
				<section
					className="py-20 border-t border-brand-slate relative"
					id="regulatory-sandbox"
				>
					<div className="space-y-10">
						<div className="space-y-2">
							<span className="font-mono text-xs text-brand-mint tracking-wider uppercase">
								// 02. INTERACTIVE DEMO
							</span>
							<h2 className="font-display text-3xl font-bold tracking-tight text-white">
								Interactive State Rules Compliance Sandbox
							</h2>
							<p className="text-brand-concrete max-w-2xl text-sm">
								At Bitcoin Depot, I built and optimized state-based regulatory
								checking with{' '}
								<code className="font-mono text-brand-mint bg-brand-coal px-1.5 py-0.5 rounded text-xs">
									json-rules-engine
								</code>
								. Adjust the inputs below to see a simplified model of how
								regional compliance rules are evaluated at physical kiosks.
							</p>
						</div>

						{/* Dry-run scenarios container */}
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
							{/* Compliance sliders and inputs */}
							<div className="lg:col-span-5 bg-brand-coal border border-brand-slate rounded-xl p-6 lg:p-8 space-y-6 flex flex-col justify-between">
								<div className="space-y-5">
									<div className="flex items-center justify-between border-b border-brand-slate/40 pb-3">
										<span className="font-mono text-xs text-brand-concrete uppercase flex items-center gap-1.5">
											<Sliders size={14} className="text-brand-mint" />
											Sandbox Input Payload
										</span>
										<span className="text-[10px] font-mono bg-brand-slate px-2 py-0.5 rounded text-brand-silver border border-brand-slate">
											RULE VARIABLES
										</span>
									</div>

									{/* Quick Scenarios selector */}
									<div className="space-y-2">
										<span className="font-mono text-[10px] text-brand-concrete block uppercase tracking-wider">
											Quick presets:
										</span>
										<div className="grid grid-cols-3 gap-2">
											<button
												type="button"
												onClick={() =>
													applySandboxScenario(450, 'unverified', 'ON', false)
												}
												className="font-mono text-[10px] bg-brand-slate/45 hover:bg-brand-slate border border-brand-slate hover:border-brand-mint/30 text-brand-silver rounded py-1.5 text-center transition-all"
											>
												Kiosk Limit Pass
											</button>
											<button
												type="button"
												onClick={() =>
													applySandboxScenario(
														2500,
														'phone_verified',
														'AB',
														false,
													)
												}
												className="font-mono text-[10px] bg-brand-slate/45 hover:bg-brand-slate border border-brand-slate hover:border-brand-mint/30 text-brand-silver rounded py-1.5 text-center transition-all"
											>
												KYC Flow Trigger
											</button>
											<button
												type="button"
												onClick={() =>
													applySandboxScenario(1200, 'unverified', 'NY', true)
												}
												className="font-mono text-[10px] bg-brand-slate/45 hover:bg-brand-slate border border-brand-slate hover:border-brand-mint/30 text-brand-silver rounded py-1.5 text-center transition-all"
											>
												Sanctions Block
											</button>
										</div>
									</div>

									{/* Variable sliders - Amount */}
									<div className="space-y-2">
										<div className="flex justify-between items-center">
											<span className="text-xs text-brand-silver font-semibold">
												Cash Transaction Amount:
											</span>
											<span className="font-mono text-brand-mint font-bold text-sm">
												${sandboxAmount.toLocaleString()} CAD
											</span>
										</div>
										<input
											type="range"
											min="100"
											max="10000"
											step="100"
											value={sandboxAmount}
											onChange={(e) => {
												setSandboxAmount(parseInt(e.target.value));
												setSandboxResult(null); // invalidate cached calculation
											}}
											className="w-full accent-brand-mint h-1 rounded bg-brand-slate appearance-none cursor-pointer"
										/>
										<div className="flex justify-between text-[10px] text-brand-concrete font-mono uppercase">
											<span>Min ($100)</span>
											<span>KYC Prompt Threshold ($1,500)</span>
											<span>Max Cap ($10,000)</span>
										</div>
									</div>

									{/* Variable 2: KYC state */}
									<div className="space-y-2">
										<span className="text-xs text-brand-silver font-semibold block">
											Present Customer KYC Status:
										</span>
										<div className="grid grid-cols-3 gap-2">
											{(
												['unverified', 'phone_verified', 'id_verified'] as const
											).map((kyc) => (
												<button
													key={kyc}
													type="button"
													onClick={() => {
														setSandboxKyc(kyc);
														setSandboxResult(null);
													}}
													className={`font-mono text-[11px] py-2 rounded text-center transition-all border ${
														sandboxKyc === kyc
															? 'bg-brand-slate border-brand-mint text-brand-mint font-semibold shadow-sm'
															: 'bg-brand-slate/20 border-brand-slate/50 text-brand-concrete hover:border-brand-slate'
													}`}
												>
													{kyc === 'unverified' && 'Unverified'}
													{kyc === 'phone_verified' && 'Phone Verified'}
													{kyc === 'id_verified' && 'Govt ID Verified'}
												</button>
											))}
										</div>
									</div>

									{/* Row layout - Province & Restricted Lists */}
									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<span className="text-xs text-brand-silver font-semibold block">
												Kiosk Jurisdiction:
											</span>
											<select
												value={sandboxProvince}
												onChange={(e) => {
													setSandboxProvince(e.target.value);
													setSandboxResult(null);
												}}
												className="w-full bg-brand-slate border border-brand-slate hover:border-brand-slate/80 text-brand-silver text-xs rounded p-2 focus:ring-1 focus:ring-brand-mint focus:outline-none"
											>
												<option value="ON">Ontario (ON)</option>
												<option value="QC">Quebec (QC)</option>
												<option value="AB">Alberta (AB)</option>
												<option value="BC">British Columbia (BC)</option>
												<option value="NY">New York (NY) BitLicense</option>
												<option value="TX">Texas (TX)</option>
											</select>
										</div>

										<div className="space-y-2">
											<span className="text-xs text-brand-silver font-semibold block">
												Sanction List Screen:
											</span>
											<button
												type="button"
												onClick={() => {
													setSandboxPEP(!sandboxPEP);
													setSandboxResult(null);
												}}
												className={`w-full font-mono text-[11px] py-2 rounded text-center transition-all border flex items-center justify-center gap-1.5 ${
													sandboxPEP
														? 'bg-red-950/40 border-red-500/80 text-red-400 font-bold'
														: 'bg-brand-slate/20 border-brand-slate/50 text-brand-concrete'
												}`}
											>
												<span
													className={`h-2.5 w-2.5 rounded-full ${sandboxPEP ? 'bg-red-500 animate-pulse' : 'bg-brand-slate'}`}
												/>
												{sandboxPEP ? 'KNOWN PEP (ALERT)' : 'PEP Clear'}
											</button>
										</div>
									</div>
								</div>

								{/* Validate Rule action */}
								<button
									type="button"
									onClick={runRuleEngine}
									disabled={sandboxIsEvaluating}
									className="w-full bg-brand-mint hover:bg-brand-mint-accent disabled:bg-brand-slate text-brand-obsidian font-bold py-3.5 px-4 rounded-lg text-sm transition-all flex items-center justify-center gap-2"
								>
									{sandboxIsEvaluating ? (
										<>
											<span className="animate-spin rounded-full h-4 w-4 border-2 border-brand-obsidian border-t-transparent" />
											Evaluating Rules Chain...
										</>
									) : (
										<>
											<Play size={15} fill="currentColor" />
											Evaluate Compliance Rules Engine
										</>
									)}
								</button>
							</div>

							{/* Engine Output Console Logs & IDE Visualizer */}
							<div className="lg:col-span-7 flex flex-col gap-6">
								{/* Visual JSON Rule Engine representation */}
								<div className="bg-brand-coal border border-brand-slate rounded-xl overflow-hidden shadow-xl flex flex-col h-full">
									<div className="bg-brand-slate/40 border-b border-brand-slate px-4 py-2.5 flex justify-between items-center font-mono text-xs">
										<span className="text-brand-concrete flex items-center gap-1.5">
											<span className="h-2 w-2 rounded-full bg-brand-mint animate-pulse" />
											json-rules-engine Policy Schema Analyzer
										</span>
										<span className="text-[10px] text-brand-concrete select-none">
											rules_policy.json
										</span>
									</div>

									<div className="p-4 bg-[#0a0c0e] font-mono text-[10.5px] leading-relaxed flex-1 overflow-auto max-h-[220px]">
										<span className="text-brand-concrete font-sans text-xs italic block mb-2">
											// Declared active JSON regulatory constraints:
										</span>
										<pre className="text-brand-concrete">
											{`{
  "name": "LimitThresholdVerification",
  "conditions": {
    "all": [
      { "fact": "amount", "operator": "greaterThanOrEqual", "value": 1500 },
      { "fact": "kyc_state", "operator": "notIn", "value": ["id_verified"] }
    ]
  },
  "event": {
    "type": "MUTATE_SCREEN",
    "params": { 
      "route": "/kyc-verify", 
      "tier": "LEVEL_2",
      "reason": "Governments enforce full user ID checks past limits."
    }
  }
}`}
										</pre>
									</div>

									{/* LIVE DRY-RUN CONSOLE OUTPUTS */}
									<div className="border-t border-brand-slate p-5 space-y-4 bg-brand-coal">
										<span className="font-mono text-xs text-brand-silver font-semibold block">
											Dry-Run Evaluation Flow:
										</span>

										{/* Step log list */}
										<div className="bg-brand-obsidian/80 border border-brand-slate p-4 rounded-lg font-mono text-[11px] space-y-1.5 text-brand-concrete max-h-[140px] overflow-y-auto">
											{sandboxLogs.map((log, idx) => (
												<p
													key={idx}
													className={
														log.includes('Rule Match') ||
														log.includes('Rule FAILED')
															? 'text-yellow-400'
															: log.includes('Rule Pass')
																? 'text-brand-mint'
																: 'text-brand-concrete'
													}
												>
													{log}
												</p>
											))}
											{sandboxIsEvaluating && (
												<p className="text-brand-mint animate-pulse-slow">
													&gt; Simulating network query feedback packet...
												</p>
											)}
										</div>

										{/* Result Ticket */}
										{sandboxResult && (
											<motion.div
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												className={`p-4 rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
													sandboxResult.passed
														? 'bg-brand-mint/10 border-brand-mint/30'
														: sandboxResult.actionRequired === 'USER_ID_PROMPT'
															? 'bg-yellow-950/30 border-yellow-500/40'
															: 'bg-red-950/20 border-red-500/40'
												}`}
											>
												<div className="space-y-1">
													<div className="flex items-center gap-2">
														<span
															className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded tracking-wide uppercase ${
																sandboxResult.passed
																	? 'bg-brand-mint text-brand-obsidian'
																	: sandboxResult.actionRequired ===
																		  'USER_ID_PROMPT'
																		? 'bg-yellow-500 text-brand-obsidian'
																		: 'bg-red-500 text-white'
															}`}
														>
															STATUS:{' '}
															{sandboxResult.actionRequired.replace('_', ' ')}
														</span>
														<span className="text-[11px] font-mono text-brand-concrete">
															Policy Result code 200
														</span>
													</div>
													<p className="text-xs text-brand-silver font-medium pt-1">
														{sandboxResult.reason}
													</p>
												</div>

												{/* Interactive Checklist checks */}
												<div className="space-y-1 border-t md:border-t-0 md:border-l border-brand-slate/50 pt-3 md:pt-0 md:pl-5 shrink-0 font-mono text-[10px] flex flex-col gap-1 text-brand-concrete">
													{sandboxResult.stepsEvaluated.map((step) => (
														<div
															key={step.ruleName}
															className="flex items-center gap-2"
														>
															<span
																className={`h-1.5 w-1.5 rounded-full ${
																	step.result === 'PASSED'
																		? 'bg-brand-mint'
																		: step.result === 'FAILED'
																			? 'bg-red-500'
																			: 'bg-brand-concrete'
																}`}
															/>
															<span>
																{step.ruleName}:{' '}
																<b
																	className={
																		step.result === 'PASSED'
																			? 'text-brand-mint'
																			: step.result === 'FAILED'
																				? 'text-red-400'
																				: 'text-brand-concrete'
																	}
																>
																	{step.result}
																</b>
															</span>
														</div>
													))}
												</div>
											</motion.div>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* SECTION 3: FEATURED WORK */}
				<section
					className="py-20 border-t border-brand-slate"
					id="featured-work"
				>
					<div className="space-y-10">
						<div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
							<div className="space-y-2">
								<span className="font-mono text-xs text-brand-mint tracking-wider uppercase">
									// 03. FEATURED PROJECTS
								</span>
								<h2 className="font-display text-3xl font-bold tracking-tight text-white mb-2">
									What I've been building lately.
								</h2>
								<p className="text-brand-concrete max-w-xl text-sm">
									Production fintech engineering at Bitcoin Depot, founding work
									on PermiPro, and Faceout—the web studio I built and operate.
								</p>
							</div>
							<div className="flex gap-2">
								{projects.map((proj) => (
									<button
										key={proj.id}
										type="button"
										onClick={() => setSelectedProject(proj.id)}
										className={`font-mono text-xs px-4 py-2 rounded-lg border transition-all ${
											selectedProject === proj.id
												? 'bg-brand-mint text-brand-obsidian border-brand-mint font-bold'
												: 'bg-brand-slate/40 border-brand-slate text-brand-concrete hover:text-brand-silver'
										}`}
									>
										{proj.title.split(' / ')[0]}
									</button>
								))}
							</div>
						</div>

						{/* Expansive Selected Project Showcase */}
						<div className="bg-brand-coal border border-brand-slate rounded-xl overflow-hidden shadow-2xl">
							{/* Project banner row */}
							{projects.map((proj) => {
								if (proj.id !== selectedProject) return null;
								return (
									<motion.div
										key={proj.id}
										initial={{ opacity: 0, scale: 0.99 }}
										animate={{ opacity: 1, scale: 1 }}
										transition={{ duration: 0.3 }}
										className="grid grid-cols-1 lg:grid-cols-12"
									>
										{/* LEFT PANEL: DETAILS */}
										<div className="lg:col-span-7 p-6 md:p-8 space-y-6 flex flex-col justify-between">
											<div className="space-y-5">
												<div className="flex flex-wrap items-center gap-3">
													<span className="font-mono text-xs text-brand-mint uppercase bg-brand-slate border border-brand-mint/20 px-2.5 py-0.5 rounded">
														{proj.role}
													</span>
													<span className="font-mono text-xs text-brand-concrete gray-pill bg-brand-slate px-2.5 py-0.5 rounded border border-brand-slate">
														{proj.subtitle}
													</span>
												</div>

												<div className="space-y-2">
													<h3 className="font-display text-3xl font-bold text-white tracking-tight">
														{proj.title}
													</h3>
													<p className="text-brand-concrete text-sm leading-relaxed max-w-xl">
														{proj.description}
													</p>
												</div>

												{/* List Accomplishments */}
												<div className="space-y-3">
													<span className="font-mono text-[10px] text-brand-concrete uppercase block tracking-wider">
														Direct impact:
													</span>
													<ul className="space-y-2.5 text-xs text-brand-silver font-sans">
														{proj.highlights.map((hlt, i) => (
															<li key={i} className="flex items-start gap-2.5">
																<span className="h-5 w-5 rounded-full bg-brand-mint/15 text-brand-mint border border-brand-mint/20 flex items-center justify-center shrink-0 mt-0.5">
																	<Check size={11} />
																</span>
																<span className="leading-relaxed leading-6">
																	{hlt}
																</span>
															</li>
														))}
													</ul>
												</div>
											</div>

											{/* Tech stack badges */}
											<div className="space-y-3 border-t border-brand-slate/40 pt-6">
												<span className="font-mono text-[10px] text-brand-concrete uppercase block tracking-wider">
													Technologies Deployed:
												</span>
												<div className="flex flex-wrap gap-2">
													{proj.techStack.map((tech) => (
														<span
															key={tech}
															className="font-mono text-[11px] bg-brand-slate/40 text-brand-concrete border border-brand-slate px-2.5 py-1 rounded"
														>
															{tech}
														</span>
													))}
												</div>
											</div>
										</div>

										{/* RIGHT PANEL: TELEMETRY & CALL TO ACTION */}
										<div className="lg:col-span-5 bg-brand-slate/20 border-t lg:border-t-0 lg:border-l border-brand-slate p-6 md:p-8 flex flex-col justify-between space-y-8">
											{/* Metric visual block */}
											<div className="bg-brand-coal border border-brand-slate rounded-lg p-6 text-center space-y-2 relative overflow-hidden group">
												<div className="absolute top-0 right-0 h-10 w-10 bg-brand-mint/5 group-hover:bg-brand-mint/10 rounded-bl-3xl transition-all border-b border-l border-brand-slate/30" />

												{proj.id === 'faceout' && (
													<img
														src="/faceout-inverse.svg"
														alt="Faceout"
														className="mx-auto h-16 w-16 mb-2"
													/>
												)}

												<span className="font-mono text-xs text-brand-concrete block tracking-widest uppercase">
													{proj.metricLabel}
												</span>
												<span className="font-display font-bold text-5xl text-brand-mint block tracking-tight">
													{proj.metric}
												</span>
												<p className="font-sans text-[11px] text-brand-concrete font-medium pt-1">
													Measured outcome from production or founding work
												</p>
											</div>

											{/* Code/Architecture insight block */}
											<div className="space-y-3 border-t border-brand-slate/30 pt-6">
												<span className="font-mono text-[10px] text-brand-concrete uppercase block tracking-wider">
													Architectural Insight:
												</span>
												<div className="bg-brand-obsidian/60 border border-brand-slate/55 p-4 rounded font-mono text-[11px] text-brand-concrete space-y-2">
													{proj.architecturalInsight && (
														<>
															<p className="text-brand-mint">
																// {proj.architecturalInsight.label}
															</p>
															<p className="text-[10px] leading-relaxed">
																{proj.architecturalInsight.description}
															</p>
														</>
													)}
												</div>
											</div>

											{/* Direct Link button */}
											{proj.links && proj.links.length > 0 && (
												<a
													href={proj.links[0].url}
													target="_blank"
													rel="noopener noreferrer"
													className="w-full bg-transparent hover:bg-white/5 border border-white/10 hover:border-white/20 text-brand-silver hover:text-white font-mono text-xs py-3 rounded-lg text-center flex items-center justify-center gap-2 transition-all mt-auto"
												>
													<ExternalLink size={13} />
													{proj.links[0].label}
												</a>
											)}
										</div>
									</motion.div>
								);
							})}
						</div>
					</div>
				</section>

				{/* SECTION 4: INTERACTIVE CONTACT TERMINAL & FEEDBACK PING */}
				<section className="py-20 border-t border-brand-slate" id="contact">
					<div className="space-y-10">
						<div className="space-y-2">
							<span className="font-mono text-xs text-brand-mint tracking-wider uppercase">
								// 04. ENDPOINT TRANSMISSION
							</span>
							<h2 className="font-display text-3xl font-bold tracking-tight text-white animate-pulse-slow">
								Initiate Communication Ping
							</h2>
							<p className="text-brand-concrete max-w-xl text-sm">
								Recruiters, founders, or product heads: submit a dynamic payload
								below. The message will trigger a simulated API submission and
								append directly to the client-side session telemetry list.
							</p>
						</div>

						<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
							{/* Form Input Card */}
							<div className="lg:col-span-5 bg-brand-coal border border-brand-slate rounded-xl p-6 lg:p-8 space-y-6">
								<span className="font-mono text-xs text-brand-silver font-semibold border-b border-brand-slate/40 pb-3 block uppercase tracking-wide">
									Submit Payload POST
								</span>

								<form onSubmit={handleSendMessage} className="space-y-4">
									<div className="space-y-1.5">
										<label className="font-mono text-[10px] text-brand-concrete uppercase block font-semibold">
											Sender Name: (Required)
										</label>
										<input
											type="text"
											required
											value={contactName}
											onChange={(e) => setContactName(e.target.value)}
											placeholder="e.g. Rachel Bowman"
											className="w-full bg-brand-slate border border-brand-slate hover:border-brand-slate/80 text-brand-silver text-xs rounded p-2.5 focus:ring-1 focus:ring-brand-mint focus:outline-none placeholder:text-brand-concrete/50"
										/>
									</div>

									<div className="space-y-1.5">
										<label className="font-mono text-[10px] text-brand-concrete uppercase block font-semibold">
											Sender Email: (Required)
										</label>
										<input
											type="email"
											required
											value={contactEmail}
											onChange={(e) => setContactEmail(e.target.value)}
											placeholder="e.g. rachel@futureemployer.com"
											className="w-full bg-brand-slate border border-brand-slate hover:border-brand-slate/80 text-brand-silver text-xs rounded p-2.5 focus:ring-1 focus:ring-brand-mint focus:outline-none placeholder:text-brand-concrete/50"
										/>
									</div>

									<div className="space-y-1.5">
										<label className="font-mono text-[10px] text-brand-concrete uppercase block font-semibold">
											Target Organization:
										</label>
										<input
											type="text"
											value={contactCompany}
											onChange={(e) => setContactCompany(e.target.value)}
											placeholder="e.g. Future Employer Inc."
											className="w-full bg-brand-slate border border-brand-slate hover:border-brand-slate/80 text-brand-silver text-xs rounded p-2.5 focus:ring-1 focus:ring-brand-mint focus:outline-none placeholder:text-brand-concrete/50"
										/>
									</div>

									<div className="space-y-1.5">
										<label className="font-mono text-[10px] text-brand-concrete uppercase block font-semibold">
											Message Payload (Msg string):
										</label>
										<textarea
											required
											rows={4}
											value={contactMsg}
											onChange={(e) => setContactMsg(e.target.value)}
											placeholder="Translate features into real outcomes..."
											className="w-full bg-brand-slate border border-brand-slate hover:border-brand-slate/80 text-brand-silver text-xs rounded p-2.5 focus:ring-1 focus:ring-brand-mint focus:outline-none placeholder:text-brand-concrete/50 resize-y font-mono"
										/>
									</div>

									<button
										type="submit"
										disabled={isSendingMessage}
										className="w-full bg-transparent hover:bg-brand-mint text-brand-mint hover:text-brand-obsidian border border-brand-mint/40 hover:border-brand-mint font-bold uppercase tracking-wider py-3.5 px-4 rounded-none text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
									>
										{isSendingMessage ? (
											<>
												<span className="animate-spin rounded-full h-4 w-4 border-2 border-brand-mint border-t-transparent" />
												TRANSMITTING TELEMETRY...
											</>
										) : (
											<>
												<Rocket size={15} />
												TRANSMIT MESSAGE POST
											</>
										)}
									</button>

									<AnimatePresence>
										{messageSuccess && (
											<motion.div
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: 'auto' }}
												exit={{ opacity: 0, height: 0 }}
												className="bg-brand-mint/10 border border-brand-mint/25 text-brand-mint p-3.5 rounded-none font-mono text-[10px] text-left space-y-1.5"
											>
												<p className="font-semibold text-[10.5px]">
													✓ TRANSMISSION COMPLETED SUCCESSFULLY (200 OK)
												</p>
												{resendStatus === 'live' ? (
													<p className="text-zinc-400">
														Message securely routed to{' '}
														<span className="text-white">
															griffin.leblanc@gmail.com
														</span>{' '}
														via live Resend email transit.
													</p>
												) : (
													<p className="text-zinc-400">
														Active in Sandbox Simulation Mode. Payload is logged
														in the debug console to the right. To send physical
														emails, declare{' '}
														<code className="bg-brand-slate px-1 py-0.5 text-brand-mint font-medium">
															RESEND_API_KEY
														</code>{' '}
														in Settings.
													</p>
												)}
											</motion.div>
										)}

										{contactError && (
											<motion.div
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: 'auto' }}
												exit={{ opacity: 0, height: 0 }}
												className="bg-red-500/5 border border-red-500/35 text-red-400 p-3.5 rounded-none font-mono text-[10px] text-left space-y-1"
											>
												<p className="font-semibold text-[10.5px] text-red-500">
													✗ TRANSMISSION ERROR / RESPONSE FAILED (500)
												</p>
												<p className="text-zinc-400">{contactError}</p>
											</motion.div>
										)}
									</AnimatePresence>
								</form>
							</div>

							{/* Console Telemetry Logs Visualizer (Right Panel) */}
							<div className="lg:col-span-7 space-y-6">
								<div className="bg-brand-slate/10 border border-brand-slate rounded-xl p-6 md:p-8 space-y-6">
									<div className="flex items-center justify-between border-b border-brand-slate/40 pb-4">
										<span className="font-mono text-xs text-brand-silver font-semibold uppercase flex items-center gap-2">
											<Terminal size={15} className="text-brand-mint" />
											Client Session Telemetry Log Feed
										</span>
										<span className="text-[10px] text-brand-concrete font-mono">
											PORT_3000_INGRESS
										</span>
									</div>

									<div className="space-y-4">
										<p className="text-brand-concrete text-xs">
											Live interaction log tracking current session events
											(stored stateful in client local memory):
										</p>

										<div className="bg-brand-obsidian border border-brand-slate rounded-lg p-5 font-mono text-[11px] text-brand-concrete space-y-3 max-h-[310px] overflow-y-auto">
											{/* Active simulation stream */}
											{messagesLog.length === 0 ? (
												<div className="text-center py-10 space-y-2 text-brand-concrete/60">
													<AlertCircle
														size={20}
														className="mx-auto text-brand-concrete/40"
													/>
													<p>No messages initialized yet.</p>
													<p className="text-[10px]">
														Use form on left to POST simulated API entries.
													</p>
												</div>
											) : (
												messagesLog.map((msg) => (
													<motion.div
														initial={{ opacity: 0, x: -10 }}
														animate={{ opacity: 1, x: 0 }}
														key={msg.id}
														className="p-3 bg-brand-slate/20 rounded border border-brand-slate/30 space-y-1 text-brand-concrete"
													>
														<div className="flex items-center justify-between text-[10px] border-b border-brand-slate/20 pb-1.5 mb-1.5">
															<span className="text-brand-mint font-semibold">
																{msg.id} (STATUS: 200 OK)
															</span>
															<span>{msg.timestamp}</span>
														</div>
														<p className="text-[11px] text-brand-silver font-semibold">
															Payload Sender:{' '}
															<span className="text-brand-mint-accent">
																{msg.sender} ({msg.company})
															</span>
														</p>
														<p className="text-brand-silver leading-relaxed text-[10.5px]">
															Body:{' '}
															<span className="text-brand-silver">
																"{msg.payload}"
															</span>
														</p>
													</motion.div>
												))
											)}

											{/* Ongoing background system tick tickers */}
											<div className="border-t border-brand-slate/20 pt-3 text-[10px] text-brand-concrete space-y-1">
												<p className="text-brand-concrete/50">
													[{new Date().toLocaleTimeString()}] SECURE Ingress
													connection validated. User session secure.
												</p>
												<p className="text-brand-concrete/50">
													[{new Date().toLocaleTimeString()}] Local time
													syncing. Static Astro builds fully optimized.
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>

			{/* FOOTER */}
			<footer className="border-t border-brand-slate bg-[#0a0c0e] py-12 px-6 md:px-12 relative z-10 text-brand-concrete text-xs">
				<div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
					<div className="space-y-1 text-center md:text-left">
						<p className="font-display font-medium text-brand-silver tracking-wide text-sm">
							© 2026 Griffin LeBlanc
						</p>
						<p className="font-mono text-[11px]">
							{educationAndDetails.address} · {profile.title}
						</p>
						<p className="font-mono text-[10px] text-brand-concrete/80">
							{educationAndDetails.education}
						</p>
					</div>

					{/* Core file reference */}
					<div className="hidden lg:block text-center font-mono text-[10px] text-brand-concrete bg-brand-slate/20 px-3 py-1.5 rounded border border-brand-slate">
						System checksum compiled:{' '}
						<span className="text-brand-mint">SHA-256:7B8F9A</span> | Production
						Certified [OK]
					</div>

					<div className="flex items-center gap-6 font-mono text-[11px]">
						<a
							href={educationAndDetails.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-[#0077b5] transition-colors flex items-center gap-1"
						>
							<Linkedin size={12} /> LinkedIn
						</a>
						<a
							href={educationAndDetails.github}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-white transition-colors flex items-center gap-1"
						>
							<Github size={12} /> GitHub
						</a>
						<a
							href={educationAndDetails.resumeUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-brand-mint transition-colors flex items-center gap-1"
						>
							<FileText size={12} /> Resume
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}
