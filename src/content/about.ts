/**
 * About Me Content Store
 * Source of truth for biographical narrative and personal photo sequence.
 */

export interface AboutPhoto {
  id: string;
  src: string; // Relative to public/ (e.g. 'assets/about/photo-1.webp')
  alt: string;
  caption?: string;
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  lead: string;
  paragraphs: string[];
  facts: Array<{
    label: string;
    value: string;
  }>;
  photos: AboutPhoto[];
}

export const ABOUT_CONTENT: AboutContent = {
  eyebrow: '02 / About',
  title: 'About Me',
  lead: 'Interested in AI, curious about software, learning through projects.',
  paragraphs: [
    "I'm a second-year B.Tech student in Artificial Intelligence and Machine Learning at St. Joseph's College of Engineering, Chennai. I'm interested in machine learning and software development, particularly in how the two come together to build useful applications.",
    "Most of what I've learned so far has come from working on projects. I've built applications in areas such as crisis monitoring and rural telemedicine, exploring different parts of development along the way, from backend logic and databases to APIs and user interfaces. I enjoy understanding how things work beyond just getting them to run.",
    "I completed my schooling at Sainik School Kazhakootam, where I learned to be independent and take responsibility for my work.",
    "Outside academics and technology, I'm interested in basketball, photography, aviation, and Formula 1.",
    "I'm still building my foundations and exploring where I can take my interest in AI/ML and software development.",
  ],
  facts: [
    { label: 'Institution', value: "St. Joseph's College of Engineering, Chennai" },
    { label: 'Degree', value: 'B.Tech — Artificial Intelligence & Machine Learning' },
    { label: 'Period', value: '2025 — 2029 (Second Year)' },
    { label: 'Location', value: 'Chennai, Tamil Nadu, India' },
    { label: 'Focus Areas', value: 'ML & Full-Stack Development' },
    { label: 'Availability', value: 'Open for AI/ML & Software Engineering Internships' },
  ],
  // Photographs with authentic attribution
  photos: [
    {
      id: 'photo-1',
      src: 'assets/about/rithul2.jpeg',
      alt: 'Rithul Raveendran',
      caption: 'Rithul Raveendran',
    },
    {
      id: 'photo-2',
      src: 'assets/about/rithul3.webp',
      alt: 'Rithul Raveendran',
      caption: 'Rithul Raveendran',
    },
  ],
};
