import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Globe, Lightbulb } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Image */}
      <motion.div
        className="mb-12 relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 rounded-lg p-8 text-center text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              حول دار ملهمون
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              مرحبا بكم في دار ملهمون - حيث تبدأ القصص. وتتسع المعرفة، ويجد كل قارئ كتابه المفضل.
            </p>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <div className="w-16 h-16 bg-white/20 rounded-full"></div>
          </div>
          <div className="absolute right-4 bottom-4">
            <div className="w-12 h-12 bg-white/20 rounded-full"></div>
          </div>
        </div>
      </motion.div>

      {/* About Section */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
          <p>
            في دار ملهمون، نؤمن بأن الكتب هي جوازات سفر إلى عوالم جديدة، وأدوات للنمو والتطور، وجسور تربط بين الثقافات والأفكار. نحن منصة تجارة إلكترونية مخصصة لعشاق الكتب، نقدم تجربة سلسة لاكتشاف وشراء الكتب في مختلف التنسيقات - مطبوعة وإلكترونية وصوتية.
          </p>
          <p>
            منصتنا هي أكثر من مجرد متجر كتب عادي. إنها مجتمع يُمكّن المؤلفين والناشرين، ويحتضن التنوع في رواية القصص، ويوفر توصيات مخصصة ودعم متعدد اللغات لرحلة قراءة سهلة وممتعة.
          </p>
          <p>
            نؤمن بأن كل قارئ يستحق العثور على الكتاب الذي يلامس قلبه، وكل مؤلف يستحق الوصول إلى جمهوره، وكل قصة تستحق أن تُروى وتُسمع. في دار ملهمون، نحن نعمل على جعل هذا الإيمان حقيقة واقعة.
          </p>
          <p>
            من خلال التكنولوجيا الحديثة والتصميم البديهي، نخلق مساحة حيث يمكن للقراءة أن تزدهر، والمعرفة أن تتوسع، والإبداع أن يجد طريقه إلى النور.
          </p>
        </div>
      </motion.div>

      {/* Middle Image */}
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="bg-gradient-to-b from-pink-400 via-purple-400 to-blue-400 rounded-lg p-12 text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            THE 50 BEST BOOK COVERS OF 2021
          </h2>
        </div>
      </motion.div>

      {/* Our Challenge Section */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          تحدينا
        </h2>
        <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
          <p>
            في دار ملهمون، نواجه تحدياً أساسياً: سد الفجوة بين التراث الأدبي الغني وإمكانية الوصول الرقمي الحديث في الشرق الأوسط. المنطقة لديها تقاليد قوية في رواية القصص، لكن الوصول إلى كتب متنوعة وعالية الجودة في تنسيقات متعددة لا يزال محدوداً.
          </p>
          <p>
            نحن نعمل على جعل الكتب في متناول الجميع عبر اللغات والفئات العمرية والتفضيلات، مع احترام القيم الثقافية واحتضان الابتكار الرقمي، بما في ذلك المحتوى المخصص للهواتف المحمولة باللغة العربية والأعمال المترجمة.
          </p>
        </div>
      </motion.div>

      {/* First Mission Section */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          مهمتنا
        </h2>
        <div className="max-w-4xl mx-auto text-lg text-gray-700 leading-relaxed">
          <p>
            مهمتنا في دار ملهمون تتجاوز مجرد بيع الكتب. نحن نخلق منصة حيث تلتقي المعرفة والثقافة والتكنولوجيا، مما يمكّن الأفراد في المنطقة من القراءة والتعلم والنمو وفقاً لشروطهم الخاصة.
          </p>
        </div>
      </motion.div>

      {/* Bottom Image */}
      <motion.div
        className="mb-16 text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
      >
        <div className="bg-blue-900 rounded-lg p-12 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              30 BOOK COVER DESIGNERS
            </h2>
            <p className="text-xl text-white/80">by Bookfox</p>
          </div>
        </div>
      </motion.div>

      {/* Second Mission Section */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          مهمتنا
        </h2>
        <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed">
          <p>
            مهمتنا في دار ملهمون هي إشعال شغف القراءة عبر الشرق الأوسط من خلال إنشاء منصة متكاملة للتنسيقات المختلفة للكتب. نحن نهدف إلى تمكين الأفراد من جميع الأعمار من خلال توفير إمكانية الوصول إلى المعرفة والثقافة والخيال.
          </p>
          <p>
            نحن نحترم الجذور الأدبية ونحتضن المستقبل الرقمي، معتقدين أن الجميع يستحقون فرصة استكشاف عجائب الأدب والعلوم والفنون من خلال الكتب.
          </p>
          <p>
            دار ملهمون هي أكثر من مجرد متجر كتب - إنها مساحة ثقافية، ومركز تعليمي، وجسر بين التراث والتكنولوجيا. نحن نؤمن بأن الجميع يستحقون فرحة القراءة.
          </p>
        </div>
      </motion.div>

      {/* Our Impact Section */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.4 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          تأثيرنا
        </h2>
        <div className="max-w-4xl mx-auto text-lg text-gray-700 leading-relaxed mb-12">
          <p>
            في دار ملهمون، نساهم في بناء ثقافة قراءة أقوى وأذكى وأكثر اتصالاً في الشرق الأوسط.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              توسيع نطاق الوصول إلى المعرفة
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              نوفر كتباً باللغة العربية واللغات الأخرى لجمهور متنوع من القراء، مما يجعل المعرفة في متناول الجميع.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              دعم المؤلفين والناشرين المحليين
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              نوفر منصة رقمية للأصوات الإقليمية لمشاركة قصصهم والحفاظ على الهوية الثقافية.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              تمكين المتعلمين مدى الحياة
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              نوفر موارد للنمو الشخصي والتعلم المستمر للطلاب والمهنيين على حد سواء.
            </p>
          </div>

          <div className="text-center">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">
              تعزيز أسلوب حياة القراءة
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              نلهم القراءة من خلال المجموعات المختارة، والتوصيات المخصصة، والمشاركة المجتمعية.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Authors Section */}
      <motion.div
        className="mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.6 }}
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          تعرف على كتابنا
        </h2>
        <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-700 leading-relaxed mb-8">
          <p>
            في دار ملهمون، نفخر بتقديم مجتمع نابض بالحياة ومتنامي من الكتاب والشعراء ورواة القصص وقادة الفكر من جميع أنحاء الشرق الأوسط وخارجه. يُضفي كتابنا الحيوية على أصواتهم المتنوعة وأفكارهم القوية وخيالهم الرحب - صفحة تلو الأخرى.
          </p>
          <p>
            سواء كنت تبحث عن قصص أدبية، أو كتب تنمية ذاتية، أو فانتازيا، أو قصص أطفال، ستجد وجهات نظر أصيلة ورؤى ثقافية راسخة من خلال المبدعين المميزين على منصتنا. نحتفي بكل صوت - من الكتاب الجدد إلى الكتاب الحائزين على جوائز.
          </p>
        </div>
        
        <div className="text-center">
          <a 
            href="/authors" 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
          >
            تعرف على كتابنا
          </a>
        </div>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.8 }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
          <p className="text-2xl font-bold leading-relaxed">
            انضم إلينا. انغمس في القصص. اكتشف نفسك. دار ملهمون - اقرأ بحرية. تعلم بعمق. عش حياتك على أكمل وجه.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default AboutPage;
