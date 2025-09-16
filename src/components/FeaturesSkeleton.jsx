import React from 'react';

const FeaturesSkeleton = () => {
  const featurePlaceholders = Array.from({ length: 4 });
  const bannerPlaceholders = Array.from({ length: 3 });

  return (
    <section className="py-8 sm:py-10 bg-slate-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {featurePlaceholders.map((_, index) => (
            <div
              key={`feature-${index}`}
              className="flex items-center p-3 sm:p-4 bg-white rounded-lg shadow-sm space-x-3 rtl:space-x-reverse"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-slate-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-slate-200 rounded animate-pulse w-full" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-12 text-center space-y-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            {bannerPlaceholders.map((_, index) => (
              <div
                key={`banner-${index}`}
                className="h-24 sm:h-32 bg-slate-200 rounded-md animate-pulse"
              />
            ))}
          </div>
          <div className="h-5 sm:h-6 bg-slate-200 rounded animate-pulse w-2/3 mx-auto" />
          <div className="h-4 sm:h-5 bg-slate-200 rounded animate-pulse w-11/12 sm:w-2/3 mx-auto" />
        </div>
      </div>
    </section>
  );
};

export default FeaturesSkeleton;
