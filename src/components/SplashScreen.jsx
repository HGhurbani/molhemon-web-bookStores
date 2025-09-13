import React from 'react';

const SplashScreen = ({ siteSettings }) => {
	const providedLogoUrl = 'https://darmolhimon.com/wp-content/uploads/2021/07/Dar.png';
	const logoUrl = siteSettings?.logo || siteSettings?.siteLogo || providedLogoUrl;
	const siteName = siteSettings?.siteName || 'Molhemon BookStore';

	return (
		<div className="fixed inset-0 z-[9999] flex items-center justify-center bg-blue-600">
			<div className="relative z-10 flex flex-col items-center gap-6 text-center px-6">
				<img src={logoUrl} alt={siteName} className="h-16 w-auto" />
				<div className="h-10 w-10 rounded-full border-4 border-white/60 border-t-white animate-spin" />
				<p className="text-white/90 text-sm">جاري التحميل... برجاء الانتظار</p>
			</div>
		</div>
	);
};

export default SplashScreen;
