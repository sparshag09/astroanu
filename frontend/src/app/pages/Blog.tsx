import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { blogAPI } from '../../services/api';

const FALLBACK = [
  { id: 1, title: "Understanding Your Birth Chart: A Beginner's Guide",  excerpt: 'Discover the foundations of Vedic astrology and how to interpret the cosmic blueprint of your life.', category: 'Education',      date: 'May 5, 2026',    readTime: '8 min read' },
  { id: 2, title: 'Mercury Retrograde: Myths and Realities',               excerpt: 'Explore the truth behind Mercury retrograde and how to navigate this cosmic phenomenon with grace.',       category: 'Cosmic Events', date: 'May 3, 2026',    readTime: '6 min read' },
  { id: 3, title: 'The Sacred Science of Nakshatras',                      excerpt: 'Journey through the 27 lunar mansions and their profound influence on your spiritual path.',                category: 'Vedic Wisdom', date: 'April 28, 2026', readTime: '10 min read' },
  { id: 4, title: 'Planetary Transits for Career Success',                  excerpt: 'Learn how to align your professional aspirations with favorable planetary movements.',                      category: 'Career',        date: 'April 25, 2026', readTime: '7 min read' },
  { id: 5, title: 'Love and Relationships in Vedic Astrology',              excerpt: 'Uncover the astrological secrets to harmonious relationships and lasting love.',                           category: 'Relationships', date: 'April 20, 2026', readTime: '9 min read' },
  { id: 6, title: 'Upcoming Lunar Eclipse: What to Expect',                 excerpt: 'Prepare for the transformative energy of the next lunar eclipse and its impact on your sign.',            category: 'Cosmic Events', date: 'April 15, 2026', readTime: '5 min read' },
];
const ALL_CATS = ['All', 'Education', 'Cosmic Events', 'Vedic Wisdom', 'Career', 'Relationships'];

export function Blog() {
  const [posts, setPosts]               = useState<any[]>(FALLBACK);
  const [categories, setCategories]     = useState<string[]>(ALL_CATS);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [postsRes, catsRes] = await Promise.all([blogAPI.getPosts() as any, blogAPI.getCategories() as any]);
        if (postsRes.data?.results?.length > 0) {
          setPosts(postsRes.data.results.map((p: any) => ({
            id: p.id, title: p.title, excerpt: p.excerpt,
            category: p.category?.name || 'General',
            date: new Date(p.publish_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            readTime: `${p.read_time} min read`,
          })));
        }
        if (catsRes.data?.length > 0) setCategories(['All', ...catsRes.data.map((c: any) => c.name)]);
      } catch { /* use fallback */ } finally { setLoading(false); }
    })();
  }, []);

  const filtered = activeCategory === 'All' ? posts : posts.filter(p => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF5EC] via-[#F6F0E5] to-[#EFE6D6] pt-24 pb-12 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-5xl text-[#6E1F2A] mb-4">Blog & Events</h1>
          <p className="text-[#7A5B46] text-lg max-w-2xl mx-auto">Explore spiritual wisdom, cosmic insights, and upcoming celestial events</p>
        </motion.div>
        <div className="flex gap-3 justify-center mb-12 flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg border-2 transition-all text-[#3D2F28] ${activeCategory === cat ? 'border-[#C89B3C] bg-[#C89B3C] text-[#FFFBF5]' : 'bg-[#FFFBF5] border-[#EFE6D6] hover:border-[#C89B3C]'}`}>
              {cat}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="text-center py-12"><p className="text-[#7A5B46] animate-pulse">Loading cosmic wisdom…</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post, i) => (
              <motion.div key={post.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="h-full cursor-pointer">
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-[#C89B3C] text-[#FFFBF5] rounded-full text-sm">{post.category}</span>
                  </div>
                  <h3 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#6E1F2A] mb-3">{post.title}</h3>
                  <p className="text-[#7A5B46] mb-4 leading-relaxed">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-[#7A5B46] pt-4 border-t border-[#EFE6D6]">
                    <span className="flex items-center gap-1"><Calendar size={14} />{post.date}</span>
                    <span className="flex items-center gap-1"><Clock size={14} />{post.readTime}</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
