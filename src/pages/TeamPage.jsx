import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Code, 
  PenTool, 
  Smartphone, 
  Palette, 
  Megaphone, 
  HeadphonesIcon,
  Users,
  User
} from 'lucide-react';
import firebaseApi from '@/lib/firebaseApi';
import logger from '@/lib/logger.js';

const TeamPage = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // جلب أعضاء الفريق من Firebase
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setIsLoading(true);
        const members = await firebaseApi.getTeamMembers();
        setTeamMembers(members);
      } catch (error) {
        logger.error('Error fetching team members:', error);
        setError('حدث خطأ أثناء جلب أعضاء الفريق');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  // الحصول على أيقونة حسب المنصب
  const getIconForPosition = (position) => {
    const positionLower = position?.toLowerCase() || '';
    if (positionLower.includes('مؤسس') || positionLower.includes('رئيس') || positionLower.includes('مدير عام')) {
      return Crown;
    } else if (positionLower.includes('مطور') || positionLower.includes('برمجة')) {
      return Code;
    } else if (positionLower.includes('مصمم') || positionLower.includes('تصميم')) {
      return PenTool;
    } else if (positionLower.includes('جوال') || positionLower.includes('موبايل')) {
      return Smartphone;
    } else if (positionLower.includes('تجربة') || positionLower.includes('ux')) {
      return Palette;
    } else if (positionLower.includes('تسويق') || positionLower.includes('marketing')) {
      return Megaphone;
    } else if (positionLower.includes('خدمة') || positionLower.includes('دعم')) {
      return HeadphonesIcon;
    } else {
      return User;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل أعضاء الفريق...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">لا يوجد أعضاء فريق متاحون حالياً</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
          نحن من يُشكّلون دار ملهمون
        </h1>
        <div className="max-w-4xl mx-auto space-y-4 text-lg text-gray-600 leading-relaxed">
          <p>
            في دار ملهمون وراء كل صفحة تقلبها، فريق شغوفٌ من محبي الكتب، ومُطوّري التقنيات، وعقول مبدعة، يعملون معا لإعادة تعريف تجربة القراءة في الشرق الأوسط.
          </p>
          <p>
            نأتي من خلفيات متنوّعة، لكننا نتشارك رسالةً واحدةً: جعل الكتب أكثر سهولة ومتعة ومعنى للجميع.
          </p>
        </div>
      </motion.div>

      {/* Team Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {teamMembers.map((member, index) => {
          const IconComponent = getIconForPosition(member.position);
          return (
            <motion.div
              key={member.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="aspect-square bg-gray-200 flex items-center justify-center">
                <IconComponent className="w-16 h-16 text-gray-400" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2 text-center">
                  {member.name}
                </h3>
                <div className="text-center mb-3">
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {member.position}
                  </span>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed text-center">
                  {member.bio || 'عضو في فريق دار ملهمون'}
                </p>
                {member.email && (
                  <div className="text-center mt-3">
                    <a 
                      href={`mailto:${member.email}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      {member.email}
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
        
        {/* Empty placeholders to complete the grid */}
        {Array.from({ length: 2 }, (_, index) => (
          <motion.div
            key={`empty-${index}`}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: (teamMembers.length + index) * 0.1 }}
          >
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              <Users className="w-16 h-16 text-gray-300" />
            </div>
            <div className="p-6">
              <div className="text-center">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-500 text-sm rounded-full">
                  انضم إلينا
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action Section */}
      <motion.div
        className="mt-16 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">
            انضم إلى فريقنا
          </h2>
          <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto">
            نحن نبحث دائماً عن مواهب جديدة لانضمامها إلى فريق دار ملهمون. إذا كنت شغوفاً بالكتب والتكنولوجيا وتريد أن تكون جزءاً من ثورة القراءة الرقمية، تواصل معنا.
          </p>
          <a 
            href="mailto:careers@darmolhimon.com"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            تواصل معنا
          </a>
        </div>
      </motion.div>
    </div>
  );
};

export default TeamPage;
