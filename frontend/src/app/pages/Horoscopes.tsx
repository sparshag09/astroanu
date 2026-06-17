import { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { zodiacSigns, generateHoroscope } from '../utils/zodiac';
import { horoscopesAPI } from '../../services/api';
import type { Horoscope } from '../types';

export function Horoscopes() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [horoscope, setHoroscope]       = useState<Horoscope | null>(null);
  const [loading, setLoading]           = useState(false);

  const handleSelectSign = async (sign: string) => {
    setSelectedSign(sign);
    setLoading(true);
    try {
      const result = await horoscopesAPI.getHoroscopeBySign(sign, 'daily') as any;
      if (result.data && result.data.length > 0) {
        const h = result.data[0];
        setHoroscope({ sign, prediction: h.prediction, luckyNumber: h.lucky_numbers || Math.floor(Math.random() * 99) + 1, luckyColor: h.lucky_color || 'Gold' });
      } else {
        setHoroscope(generateHoroscope(sign));
      }
    } catch {
      setHoroscope(generateHoroscope(sign));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5EC] via-[#F6F0E5] to-[#EFE6D6] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-5xl text-[#6E1F2A] mb-4">Daily Horoscopes</h1>
          <p className="text-[#7A5B46] text-lg">Discover what the stars have aligned for you today</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
          {zodiacSigns.map((sign, index) => (
            <motion.div key={sign.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.05 }} onClick={() => handleSelectSign(sign.name)}
              className={`cursor-pointer bg-[#FFFBF5] rounded-xl p-6 shadow-md border-2 transition-all ${selectedSign === sign.name ? 'border-[#6E1F2A] shadow-lg' : 'border-[#EFE6D6] hover:border-[#C89B3C]'}`}>
              <div className="text-center">
                <div className="text-5xl mb-3 text-[#C89B3C]">{sign.symbol}</div>
                <h3 className="text-lg text-[#3D2F28] mb-1">{sign.name}</h3>
                <p className="text-xs text-[#7A5B46] mb-2">{sign.dates}</p>
                <span className="inline-block px-3 py-1 bg-[#EFE6D6] rounded-full text-xs text-[#7A5B46]">{sign.element}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {loading && (
          <div className="text-center py-12">
            <p className="text-[#7A5B46] text-lg animate-pulse">Reading the stars for {selectedSign}…</p>
          </div>
        )}

        {horoscope && selectedSign && !loading && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Card className="max-w-3xl mx-auto bg-gradient-to-br from-[#FFFBF5] to-[#FAF5EC] border-2 border-[#C89B3C]">
              <div className="text-center mb-6">
                <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#6E1F2A] mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="text-[#C89B3C]" /> {selectedSign} Today
                </h2>
                <p className="text-sm text-[#7A5B46]">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <p className="text-lg text-[#3D2F28] leading-relaxed text-center italic mb-8">"{horoscope.prediction}"</p>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-4 bg-[#EFE6D6] rounded-lg">
                  <p className="text-sm text-[#7A5B46] mb-1">Lucky Number</p>
                  <p style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#6E1F2A]">{horoscope.luckyNumber}</p>
                </div>
                <div className="text-center p-4 bg-[#EFE6D6] rounded-lg">
                  <p className="text-sm text-[#7A5B46] mb-1">Lucky Color</p>
                  <p style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#6E1F2A]">{horoscope.luckyColor}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {!selectedSign && !loading && (
          <div className="text-center py-12">
            <p className="text-[#7A5B46] text-lg">Select your zodiac sign to view today's horoscope</p>
          </div>
        )}
      </div>
    </div>
  );
}
