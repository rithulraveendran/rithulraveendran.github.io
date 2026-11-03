import type { CertificationEntry } from '@/types/content';

/**
 * Certifications and Verified Academic Credentials Store
 * Source of Truth: Verified certificate scans and prompt requirements.
 * Excludes unverified credentials, offer letters, and digital badges.
 */
export const CERTIFICATIONS: CertificationEntry[] = [
  // Oracle
  {
    id: 'oracle-agentic-ai',
    title: 'Oracle Agentic AI Certified Foundations Associate',
    issuer: 'Oracle University',
    issueDate: '2026-10',
    image: 'assets/certs/oracle-agentic-ai.png',
    validity: '22 October 2026 – 22 October 2028',
    category: 'professional',
  },
  // Cisco
  {
    id: 'cisco-linux-unhatched',
    title: 'Linux Unhatched',
    issuer: 'Cisco Networking Academy',
    issueDate: '2026-07',
    image: 'assets/certs/cisco-linux-unhatched.jpg',
    category: 'professional',
    note: 'In collaboration with NDG',
  },
  // AWS Academy Group
  {
    id: 'aws-cloud-foundations',
    title: 'Cloud Foundations',
    issuer: 'AWS Academy',
    issueDate: '2026-06',
    hours: 20,
    image: 'assets/certs/aws-cloud-foundations.jpg',
    credentialUrl: 'https://www.credly.com/badges/76584908-f848-4814-9da0-e71b714ec99e/public_url',
    category: 'professional',
  },
  {
    id: 'aws-cloud-operations',
    title: 'Cloud Operations',
    issuer: 'AWS Academy',
    issueDate: '2026-07',
    hours: 40,
    image: 'assets/certs/aws-cloud-operations.jpg',
    credentialUrl: 'https://www.credly.com/badges/c49bf7de-f691-4fd4-8e7f-a2a1df7ba8b8/public_url',
    category: 'professional',
  },
  {
    id: 'aws-ml-nlp',
    title: 'Machine Learning for Natural Language Processing',
    issuer: 'AWS Academy',
    issueDate: '2026-07',
    hours: 20,
    image: 'assets/certs/aws-ml-nlp.jpg',
    credentialUrl: 'https://www.credly.com/badges/a8b2d755-4ecd-4f12-a1a6-b00263892bf8/public_url',
    category: 'professional',
  },
  // NPTEL
  {
    id: 'nptel-python-data-science',
    title: 'Python for Data Science',
    issuer: 'NPTEL (IIT Madras)',
    issueDate: '2026-02',
    image: 'assets/certs/nptel-python.jpg',
    category: 'academic',
    note: 'Elite certification · Consolidated score 72%',
  },
  // Infosys
  {
    id: 'infosys-aiml',
    title: 'Introduction to AI & ML',
    issuer: 'Infosys Springboard',
    issueDate: '2026-02',
    image: 'assets/certs/infosys-aiml.png',
    category: 'academic',
  },
  // Makeathons (Team / Hackathon Achievements)
  {
    id: 'makeathon-2',
    title: 'MAKE-A-THON 2.0',
    issuer: "St. Joseph's College of Engineering",
    issueDate: '2025-10',
    image: 'assets/certs/makeathon-2-award.jpg',
    category: 'hackathon',
    note: '10-Hour Hackathon · Team Codegeeks · Winning Position',
  },
  {
    id: 'makeathon-3',
    title: 'MAKE-A-THON 3.0',
    issuer: "St. Joseph's College of Engineering",
    issueDate: '2026-04',
    image: 'assets/certs/makeathon-3-award.jpg',
    category: 'hackathon',
    note: '24-Hour Hackathon · Team Targaryens · Winner',
  },
];
