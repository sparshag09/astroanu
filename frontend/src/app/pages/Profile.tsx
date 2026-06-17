import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Star, Calendar, MapPin, Clock, RefreshCw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { authUtils, consultationUtils } from '../utils/auth';
import { consultationsAPI, authAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export function Profile() {
  const navigate = useNavigate();
  const user     = authUtils.getUser();
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      try {
        const res = await consultationsAPI.getMyConsultations() as any;
        if (res.data?.length > 0) {
          setConsultations(res.data);
        } else {
          setConsultations(consultationUtils.getUserConsultations(user.id));
        }
      } catch {
        setConsultations(consultationUtils.getUserConsultations(user.id));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!user) return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5EC] via-[#F6F0E5] to-[#EFE6D6] pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-[#7A5B46]">Please log in to view your profile.</p>
      </div>
    </div>
  );

  const statusColors: Record<string, string> = {
    completed: 'bg-green-100 text-green-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-yellow-100 text-yellow-800',
    pending: 'bg-purple-100 text-purple-800',
    cancelled: 'bg-red-100 text-red-800',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5EC] via-[#F6F0E5] to-[#EFE6D6] pt-24 pb-12 px-6">
      <div className="max-w-5xl mx-auto">

        {/* Profile Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Card className="bg-gradient-to-r from-[#6E1F2A] to-[#8B2838] text-[#FFFBF5] border-none">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-[#FFFBF5] flex items-center justify-center shrink-0">
                <User size={48} className="text-[#6E1F2A]" />
              </div>
              <div>
                <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-4xl mb-1">{user.fullName}</h1>
                <p className="opacity-90">{user.email}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Birth Details */}
        {(user.birthDate || user.birthTime || user.birthPlace) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#6E1F2A] mb-4">Birth Details</h2>
            <Card>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {user.birthDate && (
                  <div className="flex items-center gap-3">
                    <Calendar className="text-[#C89B3C]" size={24} />
                    <div><p className="text-sm text-[#7A5B46]">Birth Date</p><p className="text-[#3D2F28]">{user.birthDate}</p></div>
                  </div>
                )}
                {user.birthTime && (
                  <div className="flex items-center gap-3">
                    <Clock className="text-[#C89B3C]" size={24} />
                    <div><p className="text-sm text-[#7A5B46]">Birth Time</p><p className="text-[#3D2F28]">{user.birthTime}</p></div>
                  </div>
                )}
                {user.birthPlace && (
                  <div className="flex items-center gap-3">
                    <MapPin className="text-[#C89B3C]" size={24} />
                    <div><p className="text-sm text-[#7A5B46]">Birth Place</p><p className="text-[#3D2F28]">{user.birthPlace}</p></div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Consultation History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-4">
            <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#6E1F2A]">Consultation History</h2>
            {loading && <RefreshCw size={18} className="text-[#C89B3C] animate-spin" />}
          </div>

          {!loading && consultations.length > 0 ? (
            <div className="space-y-4">
              {consultations.map((c: any) => (
                <Card key={c.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className="px-3 py-1 bg-[#C89B3C] text-[#FFFBF5] rounded-full text-sm capitalize">{c.topic}</span>
                        <span className={`px-3 py-1 rounded-full text-sm capitalize ${statusColors[c.status] || 'bg-gray-100 text-gray-700'}`}>{c.status}</span>
                        {c.is_paid && <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Paid</span>}
                      </div>
                      <p className="text-[#3D2F28] mb-2 line-clamp-2">{c.questions || c.description}</p>
                      <p className="text-sm text-[#7A5B46]">
                        Submitted on {new Date(c.createdAt || c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : !loading ? (
            <Card>
              <div className="text-center py-8">
                <Star className="mx-auto mb-4 text-[#C89B3C]" size={48} />
                <p className="text-[#7A5B46] mb-4">You haven't booked any consultations yet</p>
                <button onClick={() => navigate('/consultation')} className="px-6 py-2 bg-[#6E1F2A] text-[#FFFBF5] rounded-lg hover:bg-[#8B2838] transition-all">
                  Book Your First Consultation
                </button>
              </div>
            </Card>
          ) : null}
        </motion.div>
      </div>
    </div>
  );
}
