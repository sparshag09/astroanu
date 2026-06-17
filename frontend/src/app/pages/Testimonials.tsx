import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Star, Quote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { testimonialsAPI } from '../../services/api';

const FALLBACK = [
  { id: 1, name: 'Priya Sharma',   location: 'Mumbai',    rating: 5, text: "AstroAnu's readings have been incredibly accurate and insightful. The personalized consultation helped me make important life decisions with confidence.",              date: 'April 2026'    },
  { id: 2, name: 'Rajesh Kumar',   location: 'Delhi',     rating: 5, text: 'The depth of knowledge and spiritual wisdom shared during my consultation was truly remarkable. It brought clarity to my career path.',                              date: 'March 2026'    },
  { id: 3, name: 'Ananya Patel',   location: 'Bangalore', rating: 5, text: 'The birth chart analysis resonated deeply with my life experiences. AstroAnu has a gift for translating ancient wisdom into practical guidance.',                    date: 'April 2026'    },
  { id: 4, name: 'Vikram Singh',   location: 'Jaipur',    rating: 5, text: 'My family has been consulting with AstroAnu for years. The predictions about timing for important events have been remarkably accurate.',                              date: 'February 2026' },
  { id: 5, name: 'Meera Iyer',     location: 'Chennai',   rating: 5, text: 'The consultation gave me peace of mind during a challenging period. The remedies suggested were simple yet powerful. I felt truly understood and guided.',           date: 'March 2026'    },
  { id: 6, name: 'Arjun Reddy',    location: 'Hyderabad', rating: 5, text: "AstroAnu's understanding of Nakshatras and planetary positions is exceptional. The guidance helped me align my business ventures with favorable cosmic timing.", date: 'April 2026'    },
];

export function Testimonials() {
  const navigate = useNavigate();
  const [testimonials, setTestimonials] = useState<any[]>(FALLBACK);

  useEffect(() => {
    (async () => {
      try {
        const res = await testimonialsAPI.getFeatured() as any;
        if (res.data?.length > 0) {
          setTestimonials(res.data.map((t: any) => ({
            id: t.id,
            name: `${t.user?.first_name || ''} ${t.user?.last_name || ''}`.trim() || t.user?.username || 'Client',
            location: 'India',
            rating: t.rating,
            text: t.content,
            date: new Date(t.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
          })));
        }
      } catch { /* keep fallback */ }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5EC] via-[#F6F0E5] to-[#EFE6D6] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-5xl text-[#6E1F2A] mb-4">Testimonials</h1>
          <p className="text-[#7A5B46] text-lg max-w-2xl mx-auto">Hear from those whose lives have been transformed by Vedic wisdom</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="h-full relative">
                <Quote className="absolute top-4 right-4 text-[#C89B3C] opacity-20" size={40} />
                <div className="flex gap-1 mb-4 text-[#C89B3C]">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} size={18} fill="currentColor" />)}
                </div>
                <p className="text-[#3D2F28] mb-6 leading-relaxed italic">"{t.text}"</p>
                <div className="border-t border-[#EFE6D6] pt-4">
                  <p className="text-[#6E1F2A]">{t.name}</p>
                  <p className="text-sm text-[#7A5B46]">{t.location}</p>
                  <p className="text-xs text-[#7A5B46] mt-1">{t.date}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-[#6E1F2A] to-[#8B2838] text-[#FFFBF5] border-none">
            <div className="py-8">
              <h3 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl mb-4">Begin Your Journey</h3>
              <p className="mb-6 opacity-90">Join thousands of satisfied clients and discover the wisdom of your stars</p>
              <button onClick={() => navigate('/consultation')} className="px-8 py-3 bg-[#FFFBF5] text-[#6E1F2A] rounded-lg hover:bg-[#FAF5EC] transition-all">
                Book a Consultation
              </button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
