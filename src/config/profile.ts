import type { ProfileConfig } from '@/types/content';

export const PROFILE_CONFIG: ProfileConfig = {
  name: 'Rithul Raveendran',
  role: 'Second-Year B.Tech AI & ML Student',
  location: 'Chennai, India',
  education: {
    degree: 'B.Tech',
    major: 'Artificial Intelligence and Machine Learning',
    institution: "St. Joseph's College of Engineering",
    period: '2025 — 2029',
  },
  contact: {
    email: 'iamrithulr@gmail.com',
  },
  resume: {
    path: 'assets/resume/resume.pdf',
    filename: 'Rithul_Raveendran_Resume.pdf',
  },
  social: [
    {
      platform: 'github',
      label: 'GitHub',
      url: 'https://github.com/rithulraveendran',
      videoAsset: 'assets/social/GitHub logo.webm',
    },
    {
      platform: 'linkedin',
      label: 'LinkedIn',
      url: 'https://www.linkedin.com/in/rithulraveendran/',
      videoAsset: 'assets/social/LinkedIn logo.webm',
    },
    {
      platform: 'instagram',
      label: 'Instagram',
      url: 'https://www.instagram.com/rit.xul_',
      videoAsset: 'assets/social/Instagram logo.webm',
    },
    {
      platform: 'google',
      label: 'Email (Gmail)',
      url: 'https://mail.google.com/mail/?view=cm&fs=1&to=iamrithulr@gmail.com&su=Inquiry%20%2F%20Opportunity%20%E2%80%94%20Rithul%20Raveendran%20Portfolio&body=Hi%20Rithul%2C%0A%0AI%20came%20across%20your%20engineering%20portfolio%20and%20would%20like%20to%20connect%20regarding%3A%0A%0A',
      videoAsset: 'assets/social/Google logo.webm',
    },
    {
      platform: 'discord',
      label: 'Discord',
      url: 'https://discord.com/users/1099389310194688050',
      videoAsset: 'assets/social/Discord Anime logo.webm',
    },
  ],
  competitiveHandles: {
    github: 'rithulraveendran',
    leetcode: 'rithulraveendran',
    codeforces: 'rithulraveendran',
    atcoder: 'rithulraveendran',
    codechef: 'rithulr86',
  },
};
