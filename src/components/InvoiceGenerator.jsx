import React from 'react';
import { Button } from '@/components/ui/button.jsx';
import { Printer, Download, Share2 } from 'lucide-react';

const InvoiceGenerator = ({ order, onPrint, onDownload, onShare }) => {
  const formatPrice = (amount) => {
    return new Intl.NumberFormat('ar-SA', {
      style: 'currency',
      currency: order?.currency || 'SAR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const getProductTypeName = (type) => {
    switch (type) {
      case 'physical': return 'كتاب ورقي';
      case 'ebook': return 'كتاب إلكتروني';
      case 'audiobook': return 'كتاب صوتي';
      default: return 'منتج';
    }
  };

  const getStageInfo = (stage) => {
    const stages = {
      'ordered': { name: 'تم الطلب', icon: '📝' },
      'paid': { name: 'تم الدفع', icon: '💳' },
      'shipped': { name: 'تم الشحن', icon: '🚚' },
      'delivered': { name: 'تم الاستلام', icon: '✅' },
      'reviewed': { name: 'تم التقييم', icon: '⭐' }
    };
    return stages[stage] || stages['ordered'];
  };

  if (!order) return null;

  return (
    <div className="bg-white p-8 max-w-4xl mx-auto" dir="rtl">
      {/* Invoice Header */}
      <div className="border-b pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">فاتورة</h1>
            <p className="text-gray-600 mt-1">Invoice</p>
          </div>
          <div className="text-left">
            <h2 className="text-2xl font-bold text-gray-900">مكتبة ملهمون</h2>
            <p className="text-gray-600">Molhemon Bookstore</p>
            <p className="text-sm text-gray-500 mt-2">
              المملكة العربية السعودية<br />
              الرياض، المملكة العربية السعودية<br />
              هاتف: +966 11 123 4567<br />
              البريد الإلكتروني: info@molhemon.com
            </p>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">معلومات الفاتورة</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">رقم الفاتورة:</span>
              <span className="font-medium">{order.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">تاريخ الفاتورة:</span>
              <span className="font-medium">
                {new Date(order.createdAt).toLocaleDateString('ar-SA')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">تاريخ الاستحقاق:</span>
              <span className="font-medium">
                {new Date(order.createdAt).toLocaleDateString('ar-SA')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">حالة الطلب:</span>
              <span className="font-medium flex items-center">
                <span className="mr-1">{getStageInfo(order.currentStage).icon}</span>
                {getStageInfo(order.currentStage).name}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">معلومات العميل</h3>
          <div className="space-y-2">
            <div>
              <span className="text-gray-600">الاسم:</span>
              <span className="font-medium mr-2">{order.customerName}</span>
            </div>
            <div>
              <span className="text-gray-600">البريد الإلكتروني:</span>
              <span className="font-medium mr-2">{order.customerEmail}</span>
            </div>
            <div>
              <span className="text-gray-600">الهاتف:</span>
              <span className="font-medium mr-2">{order.customerPhone}</span>
            </div>
            <div>
              <span className="text-gray-600">العنوان:</span>
              <span className="font-medium mr-2">
                {order.customerAddress.street}, {order.customerAddress.city}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">تفاصيل المنتجات</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-2 text-right">المنتج</th>
                <th className="border border-gray-300 px-4 py-2 text-center">النوع</th>
                <th className="border border-gray-300 px-4 py-2 text-center">الكمية</th>
                <th className="border border-gray-300 px-4 py-2 text-center">السعر</th>
                <th className="border border-gray-300 px-4 py-2 text-center">المجموع</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      {item.type === 'physical' && item.isbn && (
                        <div className="text-sm text-gray-500">ISBN: {item.isbn}</div>
                      )}
                      {item.type === 'ebook' && (
                        <div className="text-sm text-gray-500">
                          {item.fileFormat} - {item.fileSize}
                        </div>
                      )}
                      {item.type === 'audiobook' && (
                        <div className="text-sm text-gray-500">
                          مدة: {item.duration} - جودة: {item.audioQuality}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {getProductTypeName(item.type)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {formatPrice(item.price)}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center font-medium">
                    {formatPrice(item.price * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Information */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">معلومات الدفع</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">طريقة الدفع:</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">حالة الدفع:</span>
                <span className={`font-medium ${
                  order.paymentStatus === 'paid' ? 'text-green-600' : 'text-yellow-600'
                }`}>
                  {order.paymentStatus === 'paid' ? 'مدفوع' : 'معلق'}
                </span>
              </div>
              {order.paymentIntentId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">معرف الدفع:</span>
                  <span className="font-medium font-mono text-sm">{order.paymentIntentId}</span>
                </div>
              )}
            </div>
          </div>
          
          {order.shippingMethod && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">معلومات الشحن</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">طريقة الشحن:</span>
                  <span className="font-medium">{order.shippingMethod}</span>
                </div>
                {order.trackingNumber && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">رقم التتبع:</span>
                    <span className="font-medium">{order.trackingNumber}</span>
                  </div>
                )}
                {order.estimatedDelivery && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">التسليم المتوقع:</span>
                    <span className="font-medium">
                      {new Date(order.estimatedDelivery).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Totals */}
      <div className="border-t pt-6">
        <div className="max-w-md ml-auto">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">المجموع الفرعي:</span>
              <span className="font-medium">{formatPrice(order.subtotal)}</span>
            </div>
            {order.shippingCost > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">تكلفة الشحن:</span>
                <span className="font-medium">{formatPrice(order.shippingCost)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">الضريبة (15%):</span>
              <span className="font-medium">{formatPrice(order.tax)}</span>
            </div>
            <div className="border-t pt-2">
              <div className="flex justify-between text-lg font-bold">
                <span>الإجمالي:</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
        <p>شكراً لاختيارك مكتبة ملهمون</p>
        <p className="mt-1">للاستفسارات: info@molhemon.com | +966 11 123 4567</p>
        <p className="mt-1">هذه الفاتورة صادرة إلكترونياً ولا تحتاج إلى توقيع</p>
      </div>

      {/* Action Buttons - Hidden in Print */}
      <div className="mt-8 flex justify-center space-x-4 rtl:space-x-reverse print:hidden">
        <Button onClick={onPrint} className="bg-blue-600 hover:bg-blue-700">
          <Printer className="w-4 h-4 mr-2" />
          طباعة الفاتورة
        </Button>
        <Button variant="outline" onClick={onDownload}>
          <Download className="w-4 h-4 mr-2" />
          تحميل PDF
        </Button>
        <Button variant="outline" onClick={onShare}>
          <Share2 className="w-4 h-4 mr-2" />
          مشاركة
        </Button>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
