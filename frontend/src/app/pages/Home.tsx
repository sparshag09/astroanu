import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Star, Users, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { OmSymbol } from '../components/decorative/OmSymbol';
import { LotusIcon } from '../components/decorative/LotusIcon';
import { StarIcon } from '../components/decorative/StarIcon';
import { ConstellationLines } from '../components/decorative/ConstellationLines';

export function Home() {
  const navigate = useNavigate();

  const stats = [
    { label: 'Daily Readings', value: '10,000+' },
    { label: 'Happy Clients', value: '5,000+' },
    { label: 'Years Experience', value: '15+' },
  ];

  const zodiacPreview = [
    { name: 'Aries', symbol: '♈', color: '#C96A2B' },
    { name: 'Taurus', symbol: '♉', color: '#7A5B46' },
    { name: 'Gemini', symbol: '♊', color: '#C89B3C' },
    { name: 'Cancer', symbol: '♋', color: '#6E1F2A' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5EC] via-[#F6F0E5] to-[#EFE6D6]">
      <div className="relative overflow-hidden">
        <ConstellationLines className="top-0 left-0" />
        <ConstellationLines className="top-0 right-0" />
        <StarIcon className="absolute top-32 right-20 opacity-40" />
        <StarIcon className="absolute top-64 left-32 opacity-40" />
        <LotusIcon className="absolute top-96 right-40 opacity-20" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <OmSymbol size={100} className="mx-auto mb-6" />

            <h1
              style={{ fontFamily: 'Playfair Display, serif' }}
              className="text-6xl text-[#6E1F2A] mb-4"
            >
              ASTRO ANU
            </h1>

            <p className="text-xl text-[#3D2F28] mb-3 max-w-3xl mx-auto">
              Unlock the ancient wisdom of Vedic Astrology with expert Astro Anu
            </p>

            <p className="text-[#7A5B46] mb-8 max-w-2xl mx-auto">
              Daily horoscopes, cosmic event analyses, and personalized readings to illuminate your path
            </p>

            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate('/horoscopes')} variant="primary">
                <Sparkles className="inline mr-2" size={18} />
                View Daily Horoscopes
              </Button>
              <Button onClick={() => navigate('/blog')} variant="secondary">
                Explore Blog
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <h3
                  style={{ fontFamily: 'Playfair Display, serif' }}
                  className="text-4xl text-[#6E1F2A] mb-2"
                >
                  {stat.value}
                </h3>
                <p className="text-[#7A5B46]">{stat.label}</p>
              </Card>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20"
          >
            <h2
              style={{ fontFamily: 'Playfair Display, serif' }}
              className="text-3xl text-[#6E1F2A] mb-8"
            >
              Your Cosmic Journey Awaits
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto mb-12">
              {zodiacPreview.map((sign, index) => (
                <motion.div
                  key={sign.name}
                  whileHover={{ scale: 1.05 }}
                  className="bg-[#FFFBF5] rounded-lg p-6 shadow-md border border-[#EFE6D6] cursor-pointer"
                  onClick={() => navigate('/horoscopes')}
                >
                  <div className="text-4xl mb-2" style={{ color: sign.color }}>
                    {sign.symbol}
                  </div>
                  <p className="text-sm text-[#3D2F28]">{sign.name}</p>
                </motion.div>
              ))}
            </div>

            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-[#6E1F2A] to-[#8B2838] text-[#FFFBF5] border-none">
              <div className="text-center py-6">
                <Calendar className="mx-auto mb-4" size={40} />
                <h3 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl mb-3">
                  Book Your Personal Consultation
                </h3>
                <p className="mb-6 opacity-90">
                  Receive personalized Vedic astrology insights tailored to your birth chart
                </p>
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="border-[#FFFBF5] text-[#FFFBF5] hover:bg-[#FFFBF5] hover:text-[#6E1F2A]"
                >
                  Get Started
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-20"
          >
            <h3
              style={{ fontFamily: 'Playfair Display, serif' }}
              className="text-2xl text-[#6E1F2A] mb-8"
            >
              Trusted by Thousands
            </h3>
            <div className="flex justify-center gap-6">
              <Card className="max-w-xs">
                <div className="flex gap-1 mb-3 text-[#C89B3C]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-[#3D2F28] italic mb-3">
                  "AstroAnu's readings changed my life. The accuracy is remarkable!"
                </p>
                <p className="text-sm text-[#7A5B46]">— Priya M.</p>
              </Card>
              <Card className="max-w-xs">
                <div className="flex gap-1 mb-3 text-[#C89B3C]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-[#3D2F28] italic mb-3">
                  "Deeply spiritual and insightful. A true Vedic astrology expert."
                </p>
                <p className="text-sm text-[#7A5B46]">— Rajesh K.</p>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
