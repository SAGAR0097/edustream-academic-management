
import * as api from './api';

const MOCK_DESCRIPTIONS = [
  "Comprehensive exploration of core concepts and practical methodologies in the field.",
  "An intensive program designed to equip students with industry-standard skills and theoretical knowledge.",
  "Deep dive into advanced topics, focusing on critical thinking and real-world application.",
  "Introductory course covering foundational principles with hands-on learning experiences.",
  "Expert-led curriculum focused on the latest trends and future-proof technologies."
];

export const generateCourseDescription = async (title: string): Promise<string> => {
  try {
    // Try the API first, but handle immediate failure for offline mode
    const desc = await api.aiGenerateDescription(title);
    return desc || MOCK_DESCRIPTIONS[Math.floor(Math.random() * MOCK_DESCRIPTIONS.length)];
  } catch (error) {
    // Return a random mock description for a seamless "AI-like" experience offline
    const template = MOCK_DESCRIPTIONS[Math.floor(Math.random() * MOCK_DESCRIPTIONS.length)];
    return `${title}: ${template}`;
  }
};
