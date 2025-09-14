import React from 'react';
import { errorHandler } from '@/lib/errorHandler';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import logger from '@/lib/logger.js';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null 
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // تسجيل الخطأ
    const errorObject = errorHandler.handleError(error, 'react:error-boundary');
    
    this.setState({
      error: error,
      errorInfo: errorInfo,
      errorId: errorObject.timestamp
    });

    // يمكن إرسال الخطأ إلى خدمة مراقبة الأخطاء هنا
    // مثل Sentry أو LogRocket
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorFallback 
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          onReset={() => this.setState({ hasError: false, error: null, errorInfo: null })}
        />
      );
    }

    return this.props.children;
  }
}

// مكون عرض الخطأ
const ErrorFallback = ({ error, errorInfo, errorId, onReset }) => {
  const handleGoHome = () => {
    window.location.href = '/';
    onReset();
  };

  const handleGoBack = () => {
    window.history.back();
    onReset();
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleReportError = () => {
    // يمكن إضافة منطق إرسال تقرير الخطأ هنا
    const errorReport = {
      errorId,
      message: error?.message,
      stack: error?.stack,
      componentStack: errorInfo?.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    };
    
    logger.error('Error Report:', errorReport);
    
    // يمكن إرسال التقرير إلى الخادم أو خدمة مراقبة الأخطاء
    alert('تم تسجيل الخطأ. سيتم مراجعته من قبل فريق التطوير.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* أيقونة الخطأ */}
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <AlertTriangle className="w-10 h-10 text-red-600" />
        </div>

        {/* عنوان الخطأ */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          عذراً! حدث خطأ غير متوقع
        </h1>

        {/* رسالة الخطأ */}
        <p className="text-lg text-gray-600 mb-6">
          نعتذر عن هذا الخطأ. فريق التطوير على علم به وسيتم إصلاحه قريباً.
        </p>

        {/* تفاصيل الخطأ (في وضع التطوير فقط) */}
        {import.meta.env.VITE_APP_ENV === 'development' && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900 mb-2">
              تفاصيل الخطأ (للمطورين)
            </summary>
            <div className="bg-gray-100 rounded-lg p-4 text-sm font-mono text-gray-800 overflow-auto max-h-40">
              <div className="mb-2">
                <strong>الخطأ:</strong> {error?.message}
              </div>
              {error?.stack && (
                <div className="mb-2">
                  <strong>Stack Trace:</strong>
                  <pre className="whitespace-pre-wrap text-xs">{error.stack}</pre>
                </div>
              )}
              {errorInfo?.componentStack && (
                <div>
                  <strong>Component Stack:</strong>
                  <pre className="whitespace-pre-wrap text-xs">{errorInfo.componentStack}</pre>
                </div>
              )}
            </div>
          </details>
        )}

        {/* معرف الخطأ */}
        {errorId && (
          <div className="mb-6 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>معرف الخطأ:</strong> {errorId}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              احتفظ بهذا المعرف للإبلاغ عن المشكلة
            </p>
          </div>
        )}

        {/* أزرار الإجراءات */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <RefreshCw className="w-4 h-4 ml-2" />
            إعادة تحميل الصفحة
          </Button>

          <Button
            onClick={handleGoBack}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة للصفحة السابقة
          </Button>

          <Button
            onClick={handleGoHome}
            variant="outline"
            className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Home className="w-4 h-4 ml-2" />
            الصفحة الرئيسية
          </Button>
        </div>

        {/* زر الإبلاغ عن الخطأ */}
        <div className="mt-6">
          <Button
            onClick={handleReportError}
            variant="ghost"
            className="text-gray-500 hover:text-gray-700 text-sm"
          >
            الإبلاغ عن هذا الخطأ
          </Button>
        </div>

        {/* نصائح للمستخدم */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-white mb-2">نصائح لحل المشكلة:</h3>
          <ul className="text-sm text-white text-right space-y-1">
            <li>• تأكد من اتصالك بالإنترنت</li>
            <li>• جرب إعادة تحميل الصفحة</li>
            <li>• امسح ذاكرة التخزين المؤقت للمتصفح</li>
            <li>• تأكد من تحديث المتصفح</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Hook لاستخدام Error Boundary
export const useErrorHandler = () => {
  const handleError = (error, context = '') => {
    const errorObject = errorHandler.handleError(error, context);
    
    // يمكن إضافة منطق إضافي هنا مثل:
    // - إظهار toast notification
    // - إرسال الخطأ إلى خدمة مراقبة الأخطاء
    // - تسجيل الخطأ في localStorage
    
    return errorObject;
  };

  const handleAsyncError = async (asyncFunction, context = '') => {
    try {
      return await asyncFunction();
    } catch (error) {
      return handleError(error, context);
    }
  };

  return { handleError, handleAsyncError };
};

export default ErrorBoundary;
