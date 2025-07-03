import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ReadSamplePage = ({ books }) => {
  const { id } = useParams();
  const book = books.find(b => b.id.toString() === id);
  if (!book) {
    return <div className="container mx-auto px-4 py-8 text-center">جاري التحميل...</div>;
  }
  return (
    <div className="container mx-auto px-4 py-8 rtl:text-right">
      <Link to={`/book/${id}`} className="text-blue-600 hover:underline block mb-4">العودة لتفاصيل الكتاب</Link>
      <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
      <p className="whitespace-pre-line leading-loose text-gray-800">
        {book.description || 'لا توجد عينة نصية متاحة.'}
      </p>
    </div>
  );
};

export default ReadSamplePage;
