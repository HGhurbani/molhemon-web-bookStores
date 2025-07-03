import React from 'react';
import { useParams, Link } from 'react-router-dom';
import AudioPlayer from '@/components/AudioPlayer.jsx';

const AudiobookPlayerPage = ({ books }) => {
  const { id } = useParams();
  const book = books.find(b => b.id.toString() === id);
  if (!book) {
    return <div className="container mx-auto px-4 py-8 text-center">جاري التحميل...</div>;
  }

  const cover = book.coverImage || 'https://images.unsplash.com/photo-1572119003128-d110c07af847';
  const audioSrc = book.audioFile || book.sampleAudio || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center text-center">
      <div className="absolute inset-0 overflow-hidden">
        <img src={cover} alt={book.title} className="w-full h-full object-cover blur-lg scale-110" />
        <div className="absolute inset-0 bg-black/50" />
      </div>
      <div className="relative z-10 w-full max-w-md p-4">
        <Link to={`/book/${id}`} className="text-blue-100 hover:underline block mb-4 text-right rtl:text-right">العودة لتفاصيل الكتاب</Link>
        <img src={cover} alt={book.title} className="w-full rounded-lg shadow-2xl mb-6" />
        <h1 className="text-2xl font-bold text-white mb-4 rtl:text-right">{book.title}</h1>
        <AudioPlayer src={audioSrc} />
      </div>
    </div>
  );
};

export default AudiobookPlayerPage;
