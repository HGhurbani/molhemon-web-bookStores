import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { 
  Search, 
  MapPin, 
  Clock, 
  Star, 
  Calendar,
  Download,
  Globe,
  ExternalLink
} from 'lucide-react';
import firebaseApi from '@/lib/firebaseApi';
import logger from '@/lib/logger.js';

const DistributorsPage = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [distributors, setDistributors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // جلب الموزعين من Firebase
  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        setIsLoading(true);
        const distributorsData = await firebaseApi.getDistributors();
        setDistributors(distributorsData);
      } catch (error) {
        logger.error('Error fetching distributors:', error);
        setError('حدث خطأ أثناء جلب الموزعين');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDistributors();
  }, []);

  // الحصول على المناطق الفريدة
  const regions = ['all', ...Array.from(new Set(distributors.map(d => d.region).filter(Boolean)))];

  // تصفية الموزعين حسب المنطقة والبحث
  const filteredDistributors = distributors.filter(distributor => {
    const matchesRegion = selectedRegion === 'all' || distributor.region === selectedRegion;
    const matchesSearch = distributor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         distributor.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         distributor.country?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">جاري تحميل الموزعين...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg">{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            إعادة المحاولة
          </Button>
        </div>
      </div>
    );
  }

  if (distributors.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg">لا يوجد موزعون متاحون حالياً</p>
        </div>
      </div>
    );
  }

  const digitalServices = [
    {
      id: 1,
      name: 'Storytel',
      type: 'تطبيق ستوريتل',
      logo: 'https://images.unsplash.com/photo-1572119003128-d110c07af847?w=100&h=100&fit=crop',
      action: 'تنزيل التطبيق',
      actionType: 'download'
    },
    {
      id: 2,
      name: 'Mokabook',
      type: 'موكا بوك',
      logo: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=100&fit=crop',
      action: 'تفضل بزيارة الموقع الإلكتروني',
      actionType: 'website'
    },
    {
      id: 3,
      name: 'Nile and Euphrates.com',
      type: 'Nile and Euphrates.com',
      logo: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop',
      action: 'تفضل بزيارة الموقع الإلكتروني',
      actionType: 'website'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <motion.div
        className="bg-blue-900 rounded-lg p-8 text-center text-white mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-4xl font-bold mb-4">
          ابحث عن موزعينا الرسميين
        </h1>
        <p className="text-lg text-blue-100 mb-6 max-w-3xl mx-auto">
          تتوفر كتب دار ملهمون والكتب الصوتية من خلال شركائنا الموثوقين في التوزيع حول العالم. استكشف شبكة موزعينا للعثور على موزع قريب منك.
        </p>
        
        {/* Region Selector */}
        <div className="max-w-md mx-auto">
          <div className="relative">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>
            <div className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2">
              <span className="text-2xl">🇦🇪</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results Section */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="bg-gray-100 rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            النتيجة
          </h2>
        </div>

        {/* Distributors List */}
        <div className="space-y-4">
          {filteredDistributors.map((distributor, index) => (
            <motion.div
              key={distributor.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
            >
              <div className="flex items-start space-x-4 rtl:space-x-reverse">
                {/* Left Side - Rating and Schedule */}
                <div className="flex-shrink-0 space-y-3">
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-gray-800">
                      {distributor.rating} ({distributor.reviews})
                    </span>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 text-sm">
                    <Calendar className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                    الجدول الزمني
                  </Button>
                </div>

                {/* Right Side - Info and Image */}
                <div className="flex-1 space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-1">
                      {distributor.name}
                    </h3>
                    {distributor.englishName && (
                      <p className="text-sm text-gray-600 mb-2">
                        {distributor.englishName}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{distributor.address}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{distributor.hours}</span>
                  </div>
                </div>

                {/* Thumbnail Image */}
                <div className="flex-shrink-0">
                  <img
                    src={distributor.image}
                    alt={distributor.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Load More Button */}
        <motion.div
          className="text-center mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3">
            للمزيد
          </Button>
        </motion.div>
      </motion.div>

      {/* Digital Services Section */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Audiobooks */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              الكتب الصوتية
            </h2>
            <div className="space-y-4">
              {digitalServices.slice(0, 2).map((service) => (
                <div key={service.id} className="bg-white rounded-lg shadow-md p-6 text-center">
                  <img
                    src={service.logo}
                    alt={service.name}
                    className="w-16 h-16 mx-auto mb-4 rounded-lg"
                  />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {service.type}
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                    {service.actionType === 'download' ? (
                      <Download className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                    ) : (
                      <ExternalLink className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                    )}
                    {service.action}
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Website */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              الموقع الإلكتروني
            </h2>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <img
                src={digitalServices[2].logo}
                alt={digitalServices[2].name}
                className="w-16 h-16 mx-auto mb-4 rounded-lg"
              />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {digitalServices[2].name}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {digitalServices[2].type}
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2">
                <ExternalLink className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
                {digitalServices[2].action}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Footer Banner */}
      <motion.div
        className="bg-gradient-to-r from-green-400 to-blue-500 rounded-lg p-8 text-center text-white relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            قصتك تستحق أن تلمع
          </h2>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            لتبدع معا شيئًا جميلا. دارمولهيمون | صمم بهدف، أنتج بعناية.
          </p>
        </div>
        
        {/* Book Covers */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 flex space-x-4 rtl:space-x-reverse">
          <div className="w-24 h-32 bg-yellow-400 rounded shadow-lg transform rotate-12"></div>
          <div className="w-24 h-32 bg-white rounded shadow-lg transform -rotate-6"></div>
          <div className="w-24 h-32 bg-blue-400 rounded shadow-lg transform rotate-12"></div>
        </div>
      </motion.div>
    </div>
  );
};

export default DistributorsPage;
