import type { ZodiacSign, Horoscope } from '../types';

export const zodiacSigns: ZodiacSign[] = [
  { name: 'Aries', symbol: '♈', element: 'Fire', dates: 'Mar 21 - Apr 19' },
  { name: 'Taurus', symbol: '♉', element: 'Earth', dates: 'Apr 20 - May 20' },
  { name: 'Gemini', symbol: '♊', element: 'Air', dates: 'May 21 - Jun 20' },
  { name: 'Cancer', symbol: '♋', element: 'Water', dates: 'Jun 21 - Jul 22' },
  { name: 'Leo', symbol: '♌', element: 'Fire', dates: 'Jul 23 - Aug 22' },
  { name: 'Virgo', symbol: '♍', element: 'Earth', dates: 'Aug 23 - Sep 22' },
  { name: 'Libra', symbol: '♎', element: 'Air', dates: 'Sep 23 - Oct 22' },
  { name: 'Scorpio', symbol: '♏', element: 'Water', dates: 'Oct 23 - Nov 21' },
  { name: 'Sagittarius', symbol: '♐', element: 'Fire', dates: 'Nov 22 - Dec 21' },
  { name: 'Capricorn', symbol: '♑', element: 'Earth', dates: 'Dec 22 - Jan 19' },
  { name: 'Aquarius', symbol: '♒', element: 'Air', dates: 'Jan 20 - Feb 18' },
  { name: 'Pisces', symbol: '♓', element: 'Water', dates: 'Feb 19 - Mar 20' },
];

const predictions = [
  "Today brings harmony and balance to your relationships. Focus on communication.",
  "A day of new opportunities awaits. Stay open to unexpected blessings.",
  "Your intuition is strong today. Trust your inner wisdom for important decisions.",
  "Career growth is on the horizon. Your hard work will be recognized.",
  "Financial abundance flows to you. Make wise investments and plan ahead.",
  "Health and wellness take priority. Nurture your body and spirit.",
  "Creative energy surrounds you. Express yourself through art and passion.",
  "Family bonds strengthen. Spend quality time with loved ones.",
  "Spiritual awakening beckons. Meditation will bring clarity and peace.",
  "Adventure calls to you. Step out of your comfort zone today.",
];

const colors = ['Gold', 'Crimson', 'Emerald', 'Sapphire', 'Amber', 'Violet', 'Coral', 'Ivory'];

export const generateHoroscope = (sign: string): Horoscope => {
  const randomPrediction = predictions[Math.floor(Math.random() * predictions.length)];
  const randomNumber = Math.floor(Math.random() * 99) + 1;
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  return {
    sign,
    prediction: randomPrediction,
    luckyNumber: randomNumber,
    luckyColor: randomColor,
  };
};
