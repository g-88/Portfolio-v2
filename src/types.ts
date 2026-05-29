export interface Project {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  description: string;
  highlights: string[];
  links?: {
    label: string;
    url: string;
  }[];
  techStack: string[];
  metric?: string;
  metricLabel?: string;
  type: "fintech" | "startup" | "agency";
}

export interface OperatingPrinciple {
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  caseStudy: {
    problem: string;
    solution: string;
    impact: string;
  };
}

export interface RuleInput {
  transactionAmount: number;
  kycState: "unverified" | "phone_verified" | "id_verified";
  userProvince: string;
  riskScore: number; // 0 to 1
  isRestrictedList: boolean;
}

export interface RuleEvaluationResult {
  passed: boolean;
  actionRequired: "APPROVE" | "USER_ID_PROMPT" | "BLOCK_TRANSACTION" | "ESCALATE_MANUAL";
  reason: string;
  stepsEvaluated: {
    ruleName: string;
    result: "SKIPPED" | "PASSED" | "FAILED";
    log: string;
  }[];
}
