import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FormattedPrice from '@/components/FormattedPrice.jsx';
import { getPriceForCurrency, useCurrency } from '@/lib/currencyContext.jsx';
import { BookCard } from '@/components/FlashSaleSection.jsx';
import { Slider } from '@/components/ui/slider.jsx';

const SearchResultsPage = ({ books, categories, handleAddToCart, handleToggleWishlist }) => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchText, setSearchText] = useState(initialQuery);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [newRelease, setNewRelease] = useState('');
  const [rating, setRating] = useState(0);
  const [language, setLanguage] = useState([]);
  const [audioProgram, setAudioProgram] = useState('');
  const [audioLength, setAudioLength] = useState([0, 10]);
  const [wishlist, setWishlist] = useState([]);
  const { currency } = useCurrency();
  const [filteredBooks, setFilteredBooks] = useState([]);

  useEffect(() => {
    const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(localWishlist);
  }, []);

  const toggleArrayItem = (arr, item) =>
    arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

  const handleTypeChange = (type) =>
    setSelectedTypes((prev) => toggleArrayItem(prev, type));
  const handleCategoryChange = (cat) =>
    setSelectedCategories((prev) => toggleArrayItem(prev, cat));
  const handleLanguageChange = (lang) =>
    setLanguage((prev) => toggleArrayItem(prev, lang));

  useEffect(() => {
    const now = Date.now();

    let result = books.filter((book) => {
      const term = searchText.toLowerCase();
      return (
        (book.title && book.title.toLowerCase().includes(term)) ||
        (book.author && book.author.toLowerCase().includes(term)) ||
        (book.publisher && book.publisher.toLowerCase().includes(term)) ||
        (book.series && book.series.toLowerCase().includes(term))
      );
    });

    if (selectedTypes.length) {
      result = result.filter((book) => selectedTypes.includes(book.type));
    }

    if (selectedCategories.length) {
      result = result.filter((book) => selectedCategories.includes(book.category));
    }

    result = result.filter((book) => {
      const price = getPriceForCurrency(book, currency.code);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    if (newRelease === '30') {
      result = result.filter((book) => new Date(book.publishDate).getTime() >= now - 30 * 24 * 60 * 60 * 1000);
    } else if (newRelease === '90') {
      result = result.filter((book) => new Date(book.publishDate).getTime() >= now - 90 * 24 * 60 * 60 * 1000);
    } else if (newRelease === 'soon') {
      result = result.filter((book) => new Date(book.publishDate).getTime() > now);
    }

    if (rating > 0) {
      result = result.filter((book) => Math.floor(book.rating) >= rating);
    }

    if (language.length) {
      result = result.filter((book) => language.includes(book.language));
    }

    if (audioProgram) {
      result = result.filter((book) => book.audioProgram === audioProgram);
    }

    result = result.filter((book) => {
      if (!book.audioLength) return true;
      return book.audioLength >= audioLength[0] && book.audioLength <= audioLength[1];
    });

    setFilteredBooks(result);
  }, [books, searchText, selectedTypes, selectedCategories, priceRange, newRelease, rating, language, audioProgram, audioLength, currency.code]);

  const onToggleWishlist = (book) => {
    handleToggleWishlist(book);
    const localWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setWishlist(localWishlist);
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8 flex gap-6">
      <aside className="w-64 hidden lg:block">
        <div className="bg-white p-4 rounded-lg shadow space-y-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2">بحث</h3>
            <input
              className="w-full border rounded px-2 py-1"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="بحث..."
            />
          </div>
          <div>
            <h3 className="font-semibold mb-2">النوع</h3>
            <label className="block"><input type="checkbox" className="ml-2" checked={selectedTypes.includes('physical')} onChange={() => handleTypeChange('physical')} /> كتاب</label>
            <label className="block"><input type="checkbox" className="ml-2" checked={selectedTypes.includes('ebook')} onChange={() => handleTypeChange('ebook')} /> كتاب إلكتروني</label>
            <label className="block"><input type="checkbox" className="ml-2" checked={selectedTypes.includes('audiobook')} onChange={() => handleTypeChange('audiobook')} /> كتاب مسموع</label>
          </div>
          <div>
            <h3 className="font-semibold mb-2">الفئات</h3>
            {categories.map((cat) => (
              <label key={cat.id} className="block"><input type="checkbox" className="ml-2" checked={selectedCategories.includes(cat.id)} onChange={() => handleCategoryChange(cat.id)} /> {cat.name}</label>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-2">نطاق السعر</h3>
            <Slider value={priceRange} max={500} step={10} onValueChange={setPriceRange} />
            <div className="flex justify-between text-xs mt-1">
              <span><FormattedPrice value={priceRange[0]} /></span>
              <span><FormattedPrice value={priceRange[1]} /></span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">إصدارات جديدة</h3>
            <label className="block"><input type="radio" className="ml-2" checked={newRelease === '30'} onChange={() => setNewRelease('30')} /> آخر 30 يوم</label>
            <label className="block"><input type="radio" className="ml-2" checked={newRelease === '90'} onChange={() => setNewRelease('90')} /> آخر 90 يوم</label>
            <label className="block"><input type="radio" className="ml-2" checked={newRelease === 'soon'} onChange={() => setNewRelease('soon')} /> قريباً</label>
            <label className="block"><input type="radio" className="ml-2" checked={newRelease === ''} onChange={() => setNewRelease('')} /> الكل</label>
          </div>
          <div>
            <h3 className="font-semibold mb-2">تقييمات العملاء</h3>
            {[5,4,3,2,1].map((r) => (
              <label key={r} className="block"><input type="radio" className="ml-2" checked={rating === r} onChange={() => setRating(r)} /> {r} نجوم فأكثر</label>
            ))}
            <label className="block"><input type="radio" className="ml-2" checked={rating === 0} onChange={() => setRating(0)} /> الكل</label>
          </div>
          <div>
            <h3 className="font-semibold mb-2">اللغات</h3>
            {['العربية','الإنجليزية','الفرنسية'].map((l) => (
              <label key={l} className="block"><input type="checkbox" className="ml-2" checked={language.includes(l)} onChange={() => handleLanguageChange(l)} /> {l}</label>
            ))}
          </div>
          <div>
            <h3 className="font-semibold mb-2">صيغة البرنامج الصوتي</h3>
            <label className="block"><input type="radio" className="ml-2" checked={audioProgram === 'abridged'} onChange={() => setAudioProgram('abridged')} /> مختصر</label>
            <label className="block"><input type="radio" className="ml-2" checked={audioProgram === 'unabridged'} onChange={() => setAudioProgram('unabridged')} /> غير مختصر</label>
            <label className="block"><input type="radio" className="ml-2" checked={audioProgram === ''} onChange={() => setAudioProgram('')} /> الكل</label>
          </div>
          <div>
            <h3 className="font-semibold mb-2">مدة الصوت (ساعات)</h3>
            <Slider value={audioLength} max={20} step={1} onValueChange={setAudioLength} />
            <div className="flex justify-between text-xs mt-1">
              <span>{audioLength[0]}</span>
              <span>{audioLength[1]}</span>
            </div>
          </div>
        </div>
      </aside>
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">نتائج البحث ({filteredBooks.length})</h1>
        {filteredBooks.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredBooks.map((book, idx) => (
              <BookCard
                key={book.id}
                book={book}
                handleAddToCart={handleAddToCart}
                handleToggleWishlist={onToggleWishlist}
                index={idx}
                isInWishlist={wishlist.some((w) => w.id === book.id)}
              />
            ))}
          </div>
        ) : (
          <p>لا توجد نتائج مطابقة</p>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
