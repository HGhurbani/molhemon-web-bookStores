
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button.jsx';
import { BookOpen, Star, Users, Edit3, PlusCircle, BookOpenText } from 'lucide-react';
import { BookCard } from '@/components/FlashSaleSection.jsx'; 
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
      setAuthorBooks(books.filter(b => b.author === currentAuthor.name || b.authorId === currentAuthor.id));
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

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 bg-slate-50 rounded-lg shadow-inner">
      <motion.div 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-blue-600 to-purple-700 p-6 sm:p-8 rounded-xl shadow-2xl text-white mb-8 sm:mb-10"
      >
        <div className="flex flex-col sm:flex-row items-center">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-lg mb-4 sm:mb-0 sm:mr-6 rtl:sm:ml-6 rtl:sm:mr-0 flex-shrink-0">
            <img  
              alt={`صورة المؤلف ${author.name}`} 
              className="w-full h-full object-cover"
             src="https://images.unsplash.com/photo-1572119003128-d110c07af847" />
          </div>
          <div className="text-center sm:text-right rtl:sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-1.5">{author.name}</h1>
            <p className="text-blue-200 text-sm sm:text-base mb-3">{author.bio || 'مؤلف وكاتب شغوف، يسعى لإثراء المحتوى العربي بأعمال أدبية وفكرية قيمة.'}</p>
            <div className="flex items-center justify-center sm:justify-start space-x-4 rtl:space-x-reverse text-sm">
              <span className="flex items-center"><BookOpen className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0 text-blue-300" /> {authorBooks.length} كتاب</span>
              <span className="flex items-center bg-gray-100 rounded-sm px-1"><Star className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0 text-yellow-300" /> متوسط تقييم { (authorBooks.reduce((acc,b) => acc + b.rating, 0) / (authorBooks.length || 1)).toFixed(1) }</span>
            </div>
          </div>
          <Button variant="outline" size="sm" className="mt-4 sm:mt-0 sm:ml-auto rtl:sm:mr-auto rtl:sm:ml-0 text-blue-600 bg-white hover:bg-blue-50 border-transparent" onClick={() => toast({title:"متابعة المؤلف", description:"🚧 هذه الميزة غير مطبقة بعد"})}>
            <PlusCircle className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0" /> متابعة
          </Button>
        </div>
      </motion.div>

      <div className="mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
          <BookOpenText className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 ml-2 rtl:mr-2 rtl:ml-0" />
          كتب المؤلف
        </h2>
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
                authors={[author]}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center py-5">لا توجد كتب لهذا المؤلف حالياً.</p>
        )}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white p-6 rounded-lg shadow-lg"
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
    </div>
  );
};

export default AuthorPage;
