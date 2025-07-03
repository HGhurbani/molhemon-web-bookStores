import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button.jsx';
import { Slider } from '@/components/ui/slider.jsx';

const EbookReaderPage = ({ books }) => {
  const { id } = useParams();
  const book = books.find(b => b.id.toString() === id);

  const [fontSize, setFontSize] = useState(18);
  const [darkMode, setDarkMode] = useState(false);
  const [dir, setDir] = useState('rtl');

  if (!book) {
    return <div className="container mx-auto px-4 py-8 text-center">جاري التحميل...</div>;
  }

  const content = book.description || 'لا يوجد محتوى متاح.';

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-800'}`} dir={dir}>
      <div className="container mx-auto px-4 py-6">
        <div className="mb-4 flex justify-between items-center">
          <Link to={`/book/${id}`} className="text-blue-600 hover:underline">عودة لتفاصيل الكتاب</Link>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <Button size="sm" variant="outline" onClick={() => setDarkMode(!darkMode)}>
              {darkMode ? 'وضع النهار' : 'وضع الليل'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => setDir(dir === 'rtl' ? 'ltr' : 'rtl')}>
              {dir === 'rtl' ? 'LTR' : 'RTL'}
            </Button>
          </div>
        </div>
        <div className="mb-6 flex items-center space-x-4 rtl:space-x-reverse">
          <span className="whitespace-nowrap">حجم الخط</span>
          <Slider
            className="max-w-xs"
            min={14}
            max={24}
            step={1}
            value={[fontSize]}
            onValueChange={([v]) => setFontSize(v)}
          />
          <span>{fontSize}px</span>
        </div>
        <h1 className="text-2xl font-bold mb-4">{book.title}</h1>
        <div style={{ fontSize: `${fontSize}px` }} className="leading-loose whitespace-pre-line">
          {content}
        </div>
      </div>
    </div>
  );
};

export default EbookReaderPage;
