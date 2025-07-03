import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { BookOpen, Star, Users, Edit3, PlusCircle, BookOpenText } from 'lucide-react';
import { BookCard } from '@/components/FlashSaleSection.jsx';
import AuthorsSection from '@/components/AuthorsSection.jsx'; // Import AuthorsSection
import { toast } from "@/components/ui/use-toast.js";

const AuthorPage = ({ authors, books, handleAddToCart, handleToggleWishlist }) => {
  const { id } = useParams();
  const [author, setAuthor] = useState(null);
  const [authorBooks, setAuthorBooks] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const currentAuthor = authors.find(a => a.id.toString() === id);
    if (currentAuthor) {
      setAuthor(currentAuthor);
      const booksByAuthor = books.filter(b => b.author === currentAuthor.name || b.authorId === currentAuthor.id);
      const bestsellers = [...books].sort((a,b) => (b.rating || 0) - (a.rating || 0));
      const topAuthorPicks = bestsellers.filter(book => !booksByAuthor.some(b => b.id === book.id)).slice(0,3);
      setAuthorBooks([...booksByAuthor, ...topAuthorPicks].slice(0,8));
    }
    const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(localWishlist);
  }, [id, authors, books]);

  const onToggleWishlist = (book) => {
    handleToggleWishlist(book);
    const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(localWishlist);
  }


  if (!author) {
    return <div className="container mx-auto px-4 py-8 text-center">جاري تحميل بيانات المؤلف...</div>;
  }

  const averageRating = (authorBooks.reduce((acc,b) => acc + b.rating, 0) / (authorBooks.length || 1)).toFixed(1);

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 bg-slate-50 rounded-lg shadow-inner">
      <div className="flex items-center justify-between text-gray-500 text-sm mb-4">
        <span>الرئيسية / المؤلفون / {author.name}</span>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-gray-700 font-semibold">{averageRating}</span>
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-gray-700 font-semibold">{author.reviews || '(٦.٨ ألف تقييم)'}</span>
        </div>
      </div>

      <motion.div
  initial={{ opacity: 0, y: -30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="bg-white p-6 sm:p-8 rounded-xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 mb-8 sm:mb-10"
>
  <div className="flex flex-col items-center md:items-start text-center md:text-right md:flex-row md:space-x-4 rtl:md:space-x-reverse md:justify-start md:w-full">
    <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0 mb-4 md:mb-0">
      <img  
        alt={`صورة المؤلف ${author.name}`} 
        className="w-full h-full object-cover"
        src="https://darmolhimon.com/wp-content/uploads/2025/06/Group-162.png" />
    </div>

    <div className="flex-grow text-center md:text-right">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-800 mb-1.5">{author.name}</h1>
      <p className="text-gray-600 text-sm sm:text-base mb-3 leading-relaxed whitespace-pre-line">
        {author.bio || 'مؤلف وكاتب شغوف، يسعى لإثراء المحتوى العربي بأعمال أدبية وفكرية قيمة.'}
      </p>

      <div className="flex items-center justify-center md:justify-start space-x-4 rtl:space-x-reverse text-sm mb-4">
        <span className="flex items-center">
          <BookOpen className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0 text-blue-600" />
          {authorBooks.length} كتاب
        </span>
        <span className="flex items-center bg-gray-100 rounded-sm px-1">
          <Star className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0 text-yellow-500 fill-yellow-500" />
          متوسط تقييم {averageRating}
        </span>
      </div>

      {/* نبذة مدمجة داخل نفس الكارد */}
      <div className="mt-4 p-0 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
  <h3 className="text-base font-semibold text-purple-600 mb-2 flex items-center">
    <Edit3 className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
    نبذة عن المؤلف
  </h3>
  <p>
    {author.extendedBio || `${author.name} هو كاتب مبدع يتميز بأسلوبه الفريد وقدرته على نسج عوالم خيالية تأسر القارئ. قدم العديد من الأعمال التي لاقت استحسان النقاد والجمهور على حد سواء، وتنوعت كتاباته بين الرواية والقصة القصيرة والمقالات الفكرية. يسعى ${author.name} من خلال كتاباته إلى طرح قضايا إنسانية عميقة وإثارة التفكير حولها، مما يجعله واحداً من الأصوات الأدبية المؤثرة في المشهد الثقافي.`}
  </p>
  <Link to={`/contact-author/${author.id}`} className="mt-4 inline-block">
    <Button variant="link" className="text-blue-600 hover:text-blue-700 px-0">
      تواصل مع المؤلف
    </Button>
  </Link>
</div>

    </div>
  </div>

  <Button
    variant="outline"
    size="sm"
    className="mt-4 md:mt-0 text-blue-600 bg-white hover:bg-blue-50 border-gray-300 flex-shrink-0"
    onClick={() => toast({
      title: "متابعة المؤلف",
      description: "🚧 هذه الميزة غير مطبقة بعد"
    })}
  >
    <PlusCircle className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
    متابعة
  </Button>
</motion.div>


      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white p-6 rounded-xl shadow-lg mb-8 sm:mb-10"
      >
        <h3 className="text-xl font-semibold text-gray-700 mb-3 flex items-center">
          <Edit3 className="w-5 h-5 text-purple-600 ml-2 rtl:mr-2 rtl:ml-0" />
          نبذة عن المؤلف
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
          {author.extendedBio || `${author.name} هو كاتب مبدع يتميز بأسلوبه الفريد وقدرته على نسج عوالم خيالية تأسر القارئ. قدم العديد من الأعمال التي لاقت استحسان النقاد والجمهور على حد سواء، وتنوعت كتاباته بين الرواية والقصة القصيرة والمقالات الفكرية. يسعى ${author.name} من خلال كتاباته إلى طرح قضايا إنسانية عميقة وإثارة التفكير حولها، مما يجعله واحداً من الأصوات الأدبية المؤثرة في المشهد الثقافي.`}
        </p>
        <Link to={`/contact-author/${author.id}`} className="mt-4 inline-block">
            <Button variant="link" className="text-blue-600 hover:text-blue-700 px-0">تواصل مع المؤلف</Button>
        </Link>
      </motion.div>

      <div className="flex justify-between items-center mb-5 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center">
          <BookOpenText className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 ml-2 rtl:mr-2 rtl:ml-0" />
          كتب المؤلف
        </h2>
        <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-gray-600">
          <span>الترتيب حسب:</span>
          <select className="bg-gray-100 border border-gray-300 rounded-md px-2 py-1 text-xs" onChange={(e) => console.log(e.target.value)}>
            <option value="default">الأكثر شعبية</option>
            <option value="newest">الأحدث</option>
            <option value="rating">الأعلى تقييماً</option>
          </select>
        </div>
      </div>

      {authorBooks.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-5">
          {authorBooks.map((book, index) => (
            <BookCard
              key={book.id}
              book={book}
              handleAddToCart={handleAddToCart}
              handleToggleWishlist={onToggleWishlist}
              index={index}
              isInWishlist={wishlist.some(item => item.id === book.id)}
              authors={authors}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-600 text-center py-5">لا توجد كتب لهذا المؤلف حالياً.</p>
      )}

      <div className="flex justify-center mt-6 space-x-2 rtl:space-x-reverse">
        {[1, 2, 3, 4, 5, 6, 72].map((page) => (
          <Button
            key={page}
            variant={page === 1 ? 'default' : 'outline'}
            size="sm"
            className={page === 1 ? 'bg-blue-600 text-white' : 'text-gray-700 bg-white border-gray-300'}
          >
            {page}
          </Button>
        ))}
      </div>

      <AuthorsSection 
        authors={authors} 
      />
    </div>
  );
};

export default AuthorPage;