import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';

const AudioSamplePlayer = ({ book, onClose }) => {
  const audioSrc = book?.sampleAudio || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
  return (
    <div className="fixed bottom-0 left-4 right-4 flex items-center bg-white border-t shadow-lg p-4 space-x-4 rtl:space-x-reverse rounded-t-xl">
      <img
        src={book?.coverImage || 'https://darmolhimon.com/wp-content/uploads/2025/05/بيكي-بلايندرز-1-300x450.jpeg'}
        alt={book ? `غلاف كتاب ${book.title}` : ''}
        className="w-16 h-16 rounded-md object-cover"
      />
      <div className="text-sm">
        <div className="font-semibold">{book?.author}</div>
        <div className="text-gray-500">الراوي: {book?.narrator || 'غير معروف'}</div>
      </div>
      <audio controls className="flex-1 mx-4">
        <source src={audioSrc} type="audio/mpeg" />
      </audio>
      <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500">
        <X className="w-5 h-5" />
      </Button>
    </div>
  );
};

export default AudioSamplePlayer;
