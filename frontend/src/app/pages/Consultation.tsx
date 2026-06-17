import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { CheckCircle, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { Input }     from '../components/ui/Input';
import { Textarea }  from '../components/ui/Textarea';
import { Select }    from '../components/ui/Select';
import { Button }    from '../components/ui/Button';
import { Card }      from '../components/ui/Card';
import { OmSymbol }  from '../components/decorative/OmSymbol';
import { authUtils, consultationUtils } from '../utils/auth';
import { consultationsAPI } from '../../services/api';

const TOPICS = [
  { value: '',             label: 'Select a topic' },
  { value: 'career',       label: 'Career & Professional Growth' },
  { value: 'marriage',     label: 'Marriage & Relationships' },
  { value: 'finance',      label: 'Finance & Wealth' },
  { value: 'health',       label: 'Health & Wellness' },
  { value: 'education',    label: 'Education & Learning' },
  { value: 'spirituality', label: 'Spiritual Growth' },
  { value: 'family',       label: 'Family Matters' },
  { value: 'general',      label: 'General Life Guidance' },
];

export function Consultation() {
  const navigate = useNavigate();
  const user     = authUtils.getUser();
  const [step, setStep]         = useState(1);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [birth, setBirth]       = useState({ fullName: user?.fullName || '', birthPlace: user?.birthPlace || '', birthDate: user?.birthDate || '', birthTime: user?.birthTime || '' });
  const [form, setForm]         = useState({ topic: '', questions: '' });
  const [errors, setErrors]     = useState<any>({});

  const validateStep1 = () => {
    const e: any = {};
    if (!birth.fullName)   e.fullName   = 'Full name is required';
    if (!birth.birthPlace) e.birthPlace = 'Birth place is required';
    if (!birth.birthDate)  e.birthDate  = 'Birth date is required';
    if (!birth.birthTime)  e.birthTime  = 'Birth time is required';
    setErrors(e); return Object.keys(e).length === 0;
  };
  const validateStep2 = () => {
    const e: any = {};
    if (!form.topic)                       e.topic     = 'Please select a topic';
    if (!form.questions || form.questions.length < 20) e.questions = 'Please provide at least 20 characters';
    setErrors(e); return Object.keys(e).length === 0;
  };

  const handleNext = async () => {
    if (step === 1 && validateStep1()) {
      await authUtils.updateUserProfile({ birthDate: birth.birthDate, birthTime: birth.birthTime, birthPlace: birth.birthPlace });
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    try {
      const payload = {
        topic: form.topic, description: form.questions, questions: form.questions,
        birth_date: birth.birthDate, birth_time: birth.birthTime, birth_place: birth.birthPlace,
      };
      const result = await consultationsAPI.create(payload) as any;
      const id = result.data?.id || Date.now().toString();
      setSubmittedId(id);
      consultationUtils.saveConsultation({ id, userId: user.id, ...birth, ...form, status: 'pending', createdAt: new Date().toISOString() });
      toast.success('Consultation submitted successfully!');
      setStep(4);
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
  };

  const topicLabel = TOPICS.find(t => t.value === form.topic)?.label || '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5EC] via-[#F6F0E5] to-[#EFE6D6] pt-24 pb-12 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <OmSymbol size={80} className="mx-auto mb-4" />
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-4xl text-[#6E1F2A] mb-2">Book Your Consultation</h1>
          <p className="text-[#7A5B46]">Receive personalized Vedic astrology guidance</p>
        </motion.div>

        {/* Step indicators */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            {[1,2,3,4].map(s => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${s === step ? 'bg-[#6E1F2A] text-[#FFFBF5] scale-110 shadow-lg' : s < step ? 'bg-[#C89B3C] text-[#FFFBF5]' : 'bg-[#EFE6D6] text-[#7A5B46]'}`}>
                  {s < step ? <CheckCircle size={20} /> : s}
                </div>
                {s < 4 && <div className={`w-16 h-1 mx-2 transition-all ${s < step ? 'bg-[#C89B3C]' : 'bg-[#EFE6D6]'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-12 mt-4 text-sm text-[#7A5B46]">
            {['Birth Details','Questions','Summary','Payment'].map((l, i) => (
              <span key={l} className={step === i + 1 ? 'text-[#6E1F2A] font-medium' : ''}>{l}</span>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card hover={false}>
                <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#6E1F2A] mb-6">Step 1: Birth Details</h2>
                <div className="space-y-5">
                  <Input label="Full Name"    value={birth.fullName}   onChange={e => setBirth({...birth, fullName:   e.target.value})} placeholder="Your full name"       error={errors.fullName} />
                  <Input label="Birth Place"  value={birth.birthPlace} onChange={e => setBirth({...birth, birthPlace: e.target.value})} placeholder="City, State, Country" error={errors.birthPlace} />
                  <Input label="Date of Birth" type="date" value={birth.birthDate} onChange={e => setBirth({...birth, birthDate: e.target.value})} error={errors.birthDate} />
                  <Input label="Time of Birth" type="time" value={birth.birthTime} onChange={e => setBirth({...birth, birthTime: e.target.value})} error={errors.birthTime} />
                  <p className="text-sm text-[#7A5B46] italic">Accurate birth details are essential for precise Vedic astrology readings.</p>
                </div>
                <div className="flex justify-end mt-6">
                  <Button onClick={handleNext} variant="primary">Next Step <ArrowRight className="inline ml-2" size={18} /></Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card hover={false}>
                <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#6E1F2A] mb-6">Step 2: Your Questions</h2>
                <div className="space-y-5">
                  <Select label="Consultation Topic" options={TOPICS} value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} error={errors.topic} />
                  <Textarea label="Your Questions & Concerns" rows={8} value={form.questions} onChange={e => setForm({...form, questions: e.target.value})}
                    placeholder="Please share your questions, concerns, and what guidance you're seeking. The more details you provide, the more personalized your reading will be…" error={errors.questions} />
                  <div className="bg-[#EFE6D6] rounded-lg p-4">
                    <p className="text-sm text-[#3D2F28]"><strong>Examples:</strong> What career path aligns with my stars? When is an auspicious time for marriage? How can I improve my financial situation?</p>
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <Button onClick={() => setStep(1)} variant="outline"><ArrowLeft className="inline mr-2" size={18} /> Back</Button>
                  <Button onClick={handleNext} variant="primary">Next Step <ArrowRight className="inline ml-2" size={18} /></Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card hover={false}>
                <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#6E1F2A] mb-6">Step 3: Review Your Details</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg text-[#6E1F2A] mb-3">Birth Information</h3>
                    <div className="bg-[#EFE6D6] rounded-lg p-4 space-y-2">
                      {[['Name', birth.fullName],['Birth Place', birth.birthPlace],['Birth Date', birth.birthDate],['Birth Time', birth.birthTime]].map(([k,v]) => (
                        <p key={k} className="text-[#3D2F28]"><strong>{k}:</strong> {v}</p>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg text-[#6E1F2A] mb-3">Consultation Details</h3>
                    <div className="bg-[#EFE6D6] rounded-lg p-4 space-y-2">
                      <p className="text-[#3D2F28]"><strong>Topic:</strong> {topicLabel}</p>
                      <p className="text-[#3D2F28]"><strong>Your Questions:</strong></p>
                      <p className="text-[#3D2F28] italic whitespace-pre-wrap">{form.questions}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <Button onClick={() => setStep(2)} variant="outline"><ArrowLeft className="inline mr-2" size={18} /> Edit</Button>
                  <Button onClick={handleSubmit} variant="primary">Proceed to Payment <ArrowRight className="inline ml-2" size={18} /></Button>
                </div>
              </Card>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card hover={false} className="bg-gradient-to-br from-[#FFFBF5] to-[#FAF5EC] border-2 border-[#C89B3C]">
                <div className="text-center py-8">
                  <Sparkles className="mx-auto mb-6 text-[#C89B3C]" size={64} />
                  <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#6E1F2A] mb-4">Complete Payment</h2>
                  <div className="max-w-md mx-auto mb-8">
                    <div className="bg-[#EFE6D6] rounded-lg p-6 mb-6">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[#3D2F28]">Consultation Fee</span>
                        <span className="text-2xl text-[#6E1F2A] font-semibold">₹2,999</span>
                      </div>
                      {submittedId && <p className="text-xs text-[#7A5B46] mb-2">Reference ID: {String(submittedId).slice(0, 8).toUpperCase()}</p>}
                      <p className="text-xs text-[#7A5B46] border-t border-[#7A5B46]/20 pt-3 mt-2">Includes detailed birth chart analysis and personalized written guidance</p>
                    </div>
                    <div className="space-y-3 mb-6">
                      <button className="w-full py-3 bg-[#6E1F2A] text-[#FFFBF5] rounded-lg hover:bg-[#8B2838] transition-all font-medium">Pay with Razorpay</button>
                      <button className="w-full py-3 bg-[#C89B3C] text-[#3D2F28] rounded-lg hover:bg-[#D4A84D] transition-all font-medium">Pay with UPI</button>
                      <button className="w-full py-3 border-2 border-[#7A5B46] text-[#7A5B46] rounded-lg hover:bg-[#7A5B46] hover:text-[#FFFBF5] transition-all">International Payment</button>
                    </div>
                    <p className="text-xs text-[#7A5B46] text-center">Secure payment • 100% money-back guarantee • Response in 3–5 business days</p>
                  </div>
                </div>
              </Card>
              <div className="text-center mt-6">
                <Button onClick={() => navigate('/profile')} variant="outline">View My Consultations</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
