import React from 'react';
import { useParams, Link } from 'react-router-dom';

const ListenSamplePage = ({ books }) => {
  const { id } = useParams();
  const book = books.find(b => b.id.toString() === id);
  if (!book) {
    return <div className="container mx-auto px-4 py-8 text-center">جاري التحميل...</div>;
  }
  const audioSrc = book.sampleAudio || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <Link to={`/book/${id}`} className="text-blue-600 hover:underline block mb-4 text-right rtl:text-right">العودة لتفاصيل الكتاب</Link>
      <h1 className="text-2xl font-bold mb-4 rtl:text-right">{book.title}</h1>
      <audio controls src={audioSrc} className="w-full" />
    </div>
  );
};

export default ListenSamplePage;
