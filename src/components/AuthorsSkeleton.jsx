import React from 'react';

const AuthorsSkeleton = () => {
  const authorPlaceholders = Array.from({ length: 10 });

  return (
    <section className="py-8 sm:py-10 bg-slate-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-5 sm:mb-6 w-full">
          <div className="h-6 sm:h-7 bg-slate-200 rounded animate-pulse w-40" />
          <div className="h-8 w-24 bg-slate-200 rounded-md animate-pulse" />
        </div>

        <div className="block sm:hidden">
          <div className="flex gap-x-4 overflow-x-auto pb-2">
            {authorPlaceholders.map((_, index) => (
              <div
                key={`author-mobile-${index}`}
                className="flex-shrink-0 text-center"
              >
                <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-slate-200 animate-pulse" />
                <div className="h-3 bg-slate-200 rounded animate-pulse w-16 mx-auto" />
              </div>
            ))}
          </div>
        </div>

        <div className="hidden sm:grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-x-3 gap-y-4">
          {authorPlaceholders.map((_, index) => (
            <div key={`author-desktop-${index}`} className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-slate-200 animate-pulse" />
              <div className="h-3 bg-slate-200 rounded animate-pulse w-20 mx-auto" />
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="h-40 sm:h-48 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-40 sm:h-48 bg-slate-200 rounded-lg animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default AuthorsSkeleton;
