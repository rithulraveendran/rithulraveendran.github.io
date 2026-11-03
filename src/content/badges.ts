import type { DigitalBadgeEntry } from '@/types/content';

/**
 * Digital Badges Content Store
 * Source of Truth: Verified badge artwork and official credential destinations.
 */
export const DIGITAL_BADGES: DigitalBadgeEntry[] = [
  // AWS Academy Issuer Group
  {
    id: 'aws-badge-foundations',
    title: 'AWS Academy Graduate - Cloud Foundations',
    issuer: 'AWS Academy',
    category: 'aws',
    image: 'assets/badges/aws/cloud-foundations.png',
    verificationUrl: 'https://www.credly.com/badges/76584908-f848-4814-9da0-e71b714ec99e/public_url',
    level: 'Foundational',
    issueDate: '2026-06',
  },
  {
    id: 'aws-badge-operations',
    title: 'AWS Academy Graduate - Cloud Operations',
    issuer: 'AWS Academy',
    category: 'aws',
    image: 'assets/badges/aws/cloud-operations.png',
    verificationUrl: 'https://www.credly.com/badges/c49bf7de-f691-4fd4-8e7f-a2a1df7ba8b8/public_url',
    level: 'Operations',
    issueDate: '2026-07',
  },
  {
    id: 'aws-badge-ml-nlp',
    title: 'AWS Academy Graduate - Machine Learning for NLP',
    issuer: 'AWS Academy',
    category: 'aws',
    image: 'assets/badges/aws/ml-nlp.png',
    verificationUrl: 'https://www.credly.com/badges/a8b2d755-4ecd-4f12-a1a6-b00263892bf8/public_url',
    level: 'Specialty',
    issueDate: '2026-07',
  },

  // Oracle Group
  {
    id: 'oracle-badge-agentic-ai',
    title: 'Oracle Agentic AI Certified Foundations Associate',
    issuer: 'Oracle University',
    category: 'oracle',
    image: 'assets/badges/oracle/oraclebadge.png',
    level: 'Foundations Associate',
    issueDate: '2026-10',
  },

  // Cisco Group
  {
    id: 'cisco-badge-linux-unhatched',
    title: 'Linux Unhatched',
    issuer: 'Cisco Networking Academy',
    category: 'cisco',
    image: 'assets/badges/cisco/linux-unhatched.png',
    level: 'Verified Skill',
    issueDate: '2026-07',
  },

  // Google Cloud Skills Group (All 10 verified skill badges)
  {
    id: 'gcp-analyze-images-cloud-vision',
    title: 'Analyze Images with the Cloud Vision API',
    issuer: 'Google Cloud Skills Boost',
    category: 'googlecloud',
    image: 'assets/badges/googlecloud/analyze-images-cloud-vision.png',
    level: 'Introductory',
  },
  {
    id: 'gcp-build-website-google-cloud',
    title: 'Build a Website on Google Cloud',
    issuer: 'Google Cloud Skills Boost',
    category: 'googlecloud',
    image: 'assets/badges/googlecloud/build-website-google-cloud.png',
    level: 'Introductory',
  },
  {
    id: 'gcp-configure-service-accounts-iam',
    title: 'Configure Service Accounts and IAM Roles',
    issuer: 'Google Cloud Skills Boost',
    category: 'googlecloud',
    image: 'assets/badges/googlecloud/configure-service-accounts-iam.png',
    level: 'Introductory',
  },
  {
    id: 'gcp-create-gemini-enterprise-app',
    title: 'Create Your First Gemini Enterprise Application',
    issuer: 'Google Cloud Skills Boost',
    category: 'googlecloud',
    image: 'assets/badges/googlecloud/create-first-gemini-enterprise-app.png',
    level: 'Introductory',
  },
  {
    id: 'gcp-develop-ai-prototypes-studio',
    title: 'Develop AI-Powered Prototypes in Google AI Studio',
    issuer: 'Google Cloud Skills Boost',
    category: 'googlecloud',
    image: 'assets/badges/googlecloud/develop-ai-prototypes-ai-studio.png',
    level: 'Introductory',
  },
  {
    id: 'gcp-explore-genai-vertex-gemini',
    title: 'Explore Generative AI with the Vertex AI Gemini API',
    issuer: 'Google Cloud Skills Boost',
    category: 'googlecloud',
    image: 'assets/badges/googlecloud/explore-gen-ai-vertex-gemini.png',
    level: 'Intermediate',
  },
  {
    id: 'gcp-speech-language-pre-trained-apis',
    title: 'Implement Speech and Language Solutions with Pre-trained APIs',
    issuer: 'Google Cloud Skills Boost',
    category: 'googlecloud',
    image: 'assets/badges/googlecloud/implement-speech-language-pre-trained-apis.png',
    level: 'Introductory',
  },
  {
    id: 'gcp-store-process-manage-data',
    title: 'Store, Process, and Manage Data on Google Cloud',
    issuer: 'Google Cloud Skills Boost',
    category: 'googlecloud',
    image: 'assets/badges/googlecloud/store-process-manage-data.png',
    level: 'Introductory',
  },
  {
    id: 'gcp-basics-google-cloud-compute',
    title: 'The Basics of Google Cloud Compute',
    issuer: 'Google Cloud Skills Boost',
    category: 'googlecloud',
    image: 'assets/badges/googlecloud/basics-google-cloud-compute.png',
    level: 'Introductory',
  },
  {
    id: 'gcp-using-speech-api',
    title: 'Using the Google Cloud Speech API',
    issuer: 'Google Cloud Skills Boost',
    category: 'googlecloud',
    image: 'assets/badges/googlecloud/using-google-cloud-speech-api.png',
    level: 'Introductory',
  },

  // LeetCode Group
  {
    id: 'leetcode-badge-50-days',
    title: '50 Days Badge 2026',
    issuer: 'LeetCode',
    category: 'leetcode',
    image: 'assets/badges/leetcode/leetcode-50-days.png',
    verificationUrl: 'https://leetcode.com/u/rithulraveendran/',
    level: 'Consistency Milestone',
  },
];
