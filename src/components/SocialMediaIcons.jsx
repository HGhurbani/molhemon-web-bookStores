import React from 'react';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin, 
  Youtube, 
  Globe,
  ExternalLink
} from 'lucide-react';

const SocialMediaIcons = ({ socialMedia, className = "", size = "w-5 h-5" }) => {
  if (!socialMedia) return null;

  const platforms = [
    { key: 'facebook', icon: Facebook, color: 'text-blue-600 hover:text-blue-700', bgColor: 'hover:bg-blue-50', label: 'فيسبوك' },
    { key: 'twitter', icon: Twitter, color: 'text-blue-400 hover:text-blue-500', bgColor: 'hover:bg-blue-50', label: 'تويتر' },
    { key: 'instagram', icon: Instagram, color: 'text-pink-500 hover:text-pink-600', bgColor: 'hover:bg-pink-50', label: 'إنستغرام' },
    { key: 'linkedin', icon: Linkedin, color: 'text-blue-700 hover:text-blue-800', bgColor: 'hover:bg-blue-50', label: 'لينكد إن' },
    { key: 'youtube', icon: Youtube, color: 'text-red-600 hover:text-red-700', bgColor: 'hover:bg-red-50', label: 'يوتيوب' },
    { key: 'website', icon: Globe, color: 'text-green-600 hover:text-green-700', bgColor: 'hover:bg-green-50', label: 'الموقع الإلكتروني' },
  ];

  const hasAnySocialMedia = platforms.some(platform => socialMedia[platform.key]);

  if (!hasAnySocialMedia) return null;

  return (
    <div className={`flex items-center space-x-2 rtl:space-x-reverse ${className}`}>
      {platforms.map((platform) => {
        const url = socialMedia[platform.key];
        if (!url) return null;

        const IconComponent = platform.icon;
        
        return (
                  <a
          key={platform.key}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-2 rounded-full transition-all duration-200 ${platform.bgColor} ${platform.color} hover:scale-110 hover:shadow-md`}
          title={`${platform.label} - ${url}`}
        >
          <IconComponent className={size} />
        </a>
        );
      })}
    </div>
  );
};

export default SocialMediaIcons;
