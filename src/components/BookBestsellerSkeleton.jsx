import React from 'react';

const BookBestsellerSkeleton = () => {
  const skeletonItems = Array.from({ length: 6 });

  const renderCard = (key) => (
    <div
      key={key}
      className="flex-shrink-0 w-40 sm:w-auto border border-slate-200 rounded-lg p-3 sm:p-4 bg-white"
    >
      <div className="mb-3 sm:mb-4 rounded-md bg-slate-200 animate-pulse aspect-[3/4]" />
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded animate-pulse w-4/5" />
        <div className="h-3 bg-slate-200 rounded animate-pulse w-3/5" />
        <div className="h-3 bg-slate-200 rounded animate-pulse w-2/5" />
        <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2" />
      </div>
      <div className="mt-3 h-8 bg-slate-200 rounded-md animate-pulse" />
    </div>
  );

  return (
    <section className="py-8 sm:py-10">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-4 rounded-[18px]">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-5 sm:mb-6 w-full">
          <div className="flex items-center space-x-2 sm:space-x-2.5 rtl:space-x-reverse mb-3 sm:mb-0 w-full sm:w-auto">
            <div className="h-7 w-7 bg-slate-200 rounded-full animate-pulse" />
            <div className="h-5 sm:h-6 bg-slate-200 rounded animate-pulse w-32 sm:w-44" />
          </div>
          <div className="hidden sm:block h-8 w-24 bg-slate-200 rounded-md animate-pulse" />
        </div>

        <div className="block sm:hidden">
          <div className="flex gap-x-4 overflow-x-auto pb-2">
            {skeletonItems.map((_, index) => renderCard(`bestseller-mobile-${index}`))}
          </div>
        </div>

        <div className="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {skeletonItems.map((_, index) => (
            <div
              key={`bestseller-desktop-${index}`}
              className="border border-slate-200 rounded-lg p-4 bg-white"
            >
              <div className="mb-4 rounded-md bg-slate-200 animate-pulse aspect-[3/4]" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded animate-pulse w-4/5" />
                <div className="h-3 bg-slate-200 rounded animate-pulse w-3/5" />
                <div className="h-3 bg-slate-200 rounded animate-pulse w-1/2" />
                <div className="h-4 bg-slate-200 rounded animate-pulse w-2/5" />
              </div>
              <div className="mt-4 h-9 bg-slate-200 rounded-md animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BookBestsellerSkeleton;
