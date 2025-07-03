import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Slider } from '@/components/ui/slider.jsx';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu.jsx';

const AudioPlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onLoaded = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };
    const onTime = () => setCurrentTime(audio.currentTime);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
    };
  }, [src]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  };

  const handleSeek = (value) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
    setCurrentTime(value[0]);
  };

  const changePlaybackSpeed = (speed) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const skipTime = (seconds) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds));
    setCurrentTime(audio.currentTime);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="bg-white/80 backdrop-blur p-4 rounded-xl shadow-lg w-full flex flex-col items-center space-y-4">
      <div className="flex items-center w-full space-x-4 rtl:space-x-reverse">
        <Button variant="ghost" size="icon" onClick={() => skipTime(-15)} className="text-gray-600 hover:text-blue-600">
          <RotateCcw className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={togglePlayPause} className="text-blue-600 hover:text-blue-700">
          {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7" />}
        </Button>
        <Button variant="ghost" size="icon" onClick={() => skipTime(15)} className="text-gray-600 hover:text-blue-600">
          <RotateCw className="w-5 h-5" />
        </Button>
        <span className="text-sm text-gray-600 w-10 text-center">{formatTime(currentTime)}</span>
        <Slider value={[currentTime]} max={duration} step={1} onValueChange={handleSeek} className="flex-1" />
        <span className="text-sm text-gray-600 w-10 text-center">{formatTime(duration)}</span>
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
      <audio ref={audioRef} src={src} preload="metadata" className="hidden" />
    </div>
  );
};

export default AudioPlayer;
