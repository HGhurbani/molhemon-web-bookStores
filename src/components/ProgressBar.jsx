import React from 'react';

const ProgressBar = ({ steps = [], currentStep = 0, totalSteps }) => {
  const safeTotal = totalSteps || steps.length || 1;
  const rawProgress = safeTotal > 1 ? (currentStep / (safeTotal - 1)) * 100 : 100;
  const percentage = Math.max(0, Math.min(100, rawProgress));
  const currentLabel = steps[currentStep]?.label || '';

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600">
            الخطوة {Math.min(currentStep + 1, safeTotal)} من {safeTotal}
          </p>
          {currentLabel && (
            <p className="text-xs text-gray-500 mt-1">{currentLabel}</p>
          )}
        </div>
        <span className="text-sm font-semibold text-blue-600">{Math.round(percentage)}%</span>
      </div>
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-2 bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isActive = index === currentStep;
            return (
              <div
                key={step.id || step.label || index}
                className="flex flex-col items-center text-center w-full"
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : isCompleted
                      ? 'bg-blue-100 border-blue-600 text-blue-600'
                      : 'bg-white border-gray-300 text-gray-500'
                  }`}
                >
                  {index + 1}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isActive ? 'text-blue-600' : 'text-gray-500'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
