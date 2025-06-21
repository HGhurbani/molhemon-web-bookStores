import React, { useRef, useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, RotateCw, Star } from 'lucide-react'; 
import { Button } from '@/components/ui/button.jsx';
import { Slider } from '@/components/ui/slider.jsx'; 
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.jsx';


const AudioSamplePlayer = ({ book, onClose }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // استخدم sampleAudio إذا كان متاحًا، وإلا استخدم رابط افتراضي
  const audioSrc = book?.sampleAudio || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      const setAudioData = () => {
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
      };

      const setAudioTime = () => setCurrentTime(audio.currentTime);
      const setAudioPlaying = () => setIsPlaying(true);
      const setAudioPaused = () => setIsPlaying(false);
      const setAudioEnded = () => setIsPlaying(false); // إعادة حالة التشغيل عند انتهاء الصوت

      audio.addEventListener('loadedmetadata', setAudioData);
      audio.addEventListener('timeupdate', setAudioTime);
      audio.addEventListener('play', setAudioPlaying);
      audio.addEventListener('pause', setAudioPaused);
      audio.addEventListener('ended', setAudioEnded);

      // تنظيف مستمعي الأحداث عند إلغاء تحميل المكون
      return () => {
        audio.removeEventListener('loadedmetadata', setAudioData);
        audio.removeEventListener('timeupdate', setAudioTime);
        audio.removeEventListener('play', setAudioPlaying);
        audio.removeEventListener('pause', setAudioPaused);
        audio.removeEventListener('ended', setAudioEnded);
      };
    }
  }, [audioSrc]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      // حالة isPlaying سيتم تحديثها بواسطة مستمعي الأحداث 'play' و 'pause'
    }
  };

  const handleSeek = (value) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const changePlaybackSpeed = (speed) => {
    const audio = audioRef.current;
    if (audio) {
      audio.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const skipTime = (seconds) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds));
      setCurrentTime(audio.currentTime);
    }
  };

  if (!book) return null; // التأكد من توفر كائن الكتاب

  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center bg-white border-t shadow-lg p-4 space-x-4 rtl:space-x-reverse rounded-t-xl z-50">
      <div className="flex items-center flex-shrink-0">
        <img
          src={book?.coverImage || 'https://darmolhimon.com/wp-content/uploads/2025/05/بيكي-بلايندرز-1-300x450.jpeg'}
          alt={book ? `غلاف كتاب ${book.title}` : ''}
          className="w-16 h-16 rounded-md object-cover"
        />
        <div className="text-sm mr-4 rtl:ml-4 rtl:mr-0">
          <div className="font-semibold">{book?.title}</div>
          <div className="text-gray-500">{book?.author}</div>
          {book?.rating && (
            <div className="flex items-center text-xs text-gray-600 mt-1">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500 ml-1 rtl:mr-1 rtl:ml-0" />
              {book.rating.toFixed(1)} ({book.reviews})
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 items-center space-x-4 rtl:space-x-reverse mx-4">
        {/* زر الإرجاع 15 ثانية */}
        <Button variant="ghost" size="icon" onClick={() => skipTime(-15)} className="text-gray-600 hover:text-blue-600">
          <RotateCcw className="w-5 h-5" />
        </Button>
        {/* زر التشغيل/الإيقاف المؤقت */}
        <Button variant="ghost" size="icon" onClick={togglePlayPause} className="text-blue-600 hover:text-blue-700">
          {isPlaying ? (
            <Pause className="w-7 h-7" />
          ) : (
            <Play className="w-7 h-7" />
          )}
        </Button>
        {/* زر التقديم 15 ثانية */}
        <Button variant="ghost" size="icon" onClick={() => skipTime(15)} className="text-gray-600 hover:text-blue-600">
          <RotateCw className="w-5 h-5" />
        </Button>

        {/* عرض الوقت الحالي */}
        <span className="text-sm text-gray-600 w-10 text-center">{formatTime(currentTime)}</span>
        {/* شريط التقدم */}
        <Slider
          value={[currentTime]}
          max={duration}
          step={1}
          onValueChange={handleSeek}
          className="flex-1"
        />
        {/* عرض المدة الكلية */}
        <span className="text-sm text-gray-600 w-10 text-center">{formatTime(duration)}</span>

        {/* قائمة سرعة التشغيل */}
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm px-2 py-1 h-auto min-w-[40px]">
                    {playbackSpeed}x
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto">
                <DropdownMenuItem onSelect={() => changePlaybackSpeed(1)}>1x</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => changePlaybackSpeed(1.5)}>1.5x</DropdownMenuItem>
                <DropdownMenuItem onSelect={() => changePlaybackSpeed(2)}>2x</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

      </div>

      {/* زر الإغلاق */}
      <Button variant="ghost" size="icon" onClick={onClose} className="text-gray-500 flex-shrink-0">
        <X className="w-6 h-6" />
      </Button>

      {/* عنصر الصوت المخفي لتشغيل الصوت فعليًا */}
      <audio ref={audioRef} src={audioSrc} preload="metadata" className="hidden" /> 
    </div>
  );
};

export default AudioSamplePlayer;