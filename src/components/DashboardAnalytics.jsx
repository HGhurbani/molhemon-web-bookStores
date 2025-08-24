import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Package,
  Calendar,
  ChevronDown,
  MoreHorizontal,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  Filter,
  Search,
  Printer,
  CheckCircle,
  X,
  Trophy,
  MapPin,
  Flag,
  Star,
  Heart,
  Edit,
  Trash2,
  Check,
  Clock,
  Truck
} from 'lucide-react';

const DashboardAnalytics = ({ books, orders, payments, customers }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeTab, setActiveTab] = useState('جديد');
  const [selectedPeriod, setSelectedPeriod] = useState('7d');

  // حساب البيانات الحقيقية
  const totalProducts = books?.length || 0;
  const completedOrders = orders?.filter(o => o.status === 'تم التوصيل').length || 0;
  const cancelledOrders = orders?.filter(o => o.status === 'ملغي').length || 0;
  const bestProducts = books?.filter(b => b.rating >= 4).length || 0;

  // بيانات KPI الرئيسية
  const kpiData = [
    {
      title: 'إجمالي المنتجات',
      value: totalProducts.toString(),
      change: '+12.3%',
      trend: 'up',
      icon: Package,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'الطلبات المكتملة',
      value: completedOrders.toString(),
      change: '+8.7%',
      trend: 'up',
      icon: CheckCircle,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'الطلبات الملغاة',
      value: cancelledOrders.toString(),
      change: '-2.1%',
      trend: 'down',
      icon: X,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      title: 'المنتجات الأكثر مبيعاً',
      value: bestProducts.toString(),
      change: '+15.2%',
      trend: 'up',
      icon: Trophy,
      color: 'bg-purple-100 text-purple-600'
    }
  ];

  // بيانات المبيعات حسب البلدان
  const salesByCountries = [
    { country: 'الإمارات العربية المتحدة', flag: '🇦🇪', sales: '45,680.00 د.إ', change: '+18.5%', trend: 'up' },
    { country: 'المملكة العربية السعودية', flag: '🇸🇦', sales: '38,420.00 ريال', change: '+12.3%', trend: 'up' },
    { country: 'مصر', flag: '🇪🇬', sales: '28,750.00 جنيه', change: '+9.8%', trend: 'up' },
    { country: 'قطر', flag: '🇶🇦', sales: '22,180.00 ريال', change: '+7.2%', trend: 'up' },
    { country: 'الكويت', flag: '🇰🇼', sales: '18,950.00 دينار', change: '-3.4%', trend: 'down' },
    { country: 'عُمان', flag: '🇴🇲', sales: '15,680.00 ريال', change: '+5.6%', trend: 'up' }
  ];

  // المنتجات الشائعة من البيانات الحقيقية
  const popularProducts = books && books.length > 0 ? books.slice(0, 5).map(book => ({
    name: book.title || 'عنوان غير محدد',
    category: book.category || 'فئة غير محددة',
    price: `${book.price || 0} د.إ`,
    image: book.image || `https://via.placeholder.com/60x80/6366f1/ffffff?text=${encodeURIComponent(book.title || 'Book')}`
  })) : [
    { 
      name: 'ملك الظلال', 
      category: 'سيرة ذاتية ومذكرات', 
      price: '85.00 د.إ',
      image: 'https://via.placeholder.com/60x80/6366f1/ffffff?text=ملك'
    },
    { 
      name: 'قبل أن تختار الدواء', 
      category: 'كتب طبية', 
      price: '120.00 د.إ',
      image: 'https://via.placeholder.com/60x80/10b981/ffffff?text=دواء'
    },
    { 
      name: 'مملكة الرماد والدم', 
      category: 'خيال علمي', 
      price: '95.00 د.إ',
      image: 'https://via.placeholder.com/60x80/f59e0b/ffffff?text=مملكة'
    },
    { 
      name: 'الملك المنسي', 
      category: 'خيال علمي', 
      price: '110.00 د.إ',
      image: 'https://via.placeholder.com/60x80/ef4444/ffffff?text=الملك'
    },
    { 
      name: 'يمين الملك الأخير', 
      category: 'خيال علمي', 
      price: '125.00 د.إ',
      image: 'https://via.placeholder.com/60x80/8b5cf6/ffffff?text=يمين'
    }
  ];

  // الطلبات حسب البلدان
  const ordersByCountries = [
    {
      sender: 'دار النشر، برج المكتوم، دبي، الإمارات العربية المتحدة',
      receiver: 'أحمد محمد، شارع الشيخ زايد، أبو ظبي، الإمارات العربية المتحدة',
      status: 'جديد'
    },
    {
      sender: 'دار النشر، برج المكتوم، دبي، الإمارات العربية المتحدة',
      receiver: 'فاطمة علي، حي النزهة، الرياض، المملكة العربية السعودية',
      status: 'جديد'
    },
    {
      sender: 'دار النشر، برج المكتوم، دبي، الإمارات العربية المتحدة',
      receiver: 'محمد حسن، شارع التحرير، القاهرة، مصر',
      status: 'جديد'
    }
  ];

  // أحدث المعاملات من البيانات الحقيقية
  const latestTransactions = orders && orders.length > 0 ? orders.slice(0, 5).map(order => ({
    id: `#${order.id}`,
    customer: order.customerName || 'عميل غير محدد',
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(order.customerName || 'User')}&background=10b981&color=fff`,
    createdAt: new Date(order.date || order.createdAt).toLocaleDateString('ar-SA'),
    totalAmount: `${order.total || 0} د.إ`,
    paymentStatus: order.paymentStatus === 'Paid' ? 'مدفوع' : 
                   order.paymentStatus === 'Unpaid' ? 'غير مدفوع' : 
                   order.paymentStatus === 'Refund' ? 'مسترد' : 'غير محدد',
    paymentMethod: order.paymentMethod || 'غير محدد',
    deliveryStatus: order.status === 'تم التوصيل' ? 'مكتمل' : 
                    order.status === 'ملغي' ? 'ملغي' : 'في الانتظار'
  })) : [
    {
      id: '#ORD-2024-001',
      customer: 'أحمد محمد',
      avatar: 'https://ui-avatars.com/api/?name=أحمد+محمد&background=10b981&color=fff',
      createdAt: '15 يناير 2024',
      totalAmount: '285.00 د.إ',
      paymentStatus: 'مدفوع',
      paymentMethod: 'بطاقة ائتمان',
      deliveryStatus: 'مكتمل'
    },
    {
      id: '#ORD-2024-002',
      customer: 'فاطمة علي',
      avatar: 'https://ui-avatars.com/api/?name=فاطمة+علي&background=f59e0b&color=fff',
      createdAt: '14 يناير 2024',
      totalAmount: '420.00 د.إ',
      paymentStatus: 'غير مدفوع',
      paymentMethod: 'الدفع عند الاستلام',
      deliveryStatus: 'في الانتظار'
    },
    {
      id: '#ORD-2024-003',
      customer: 'محمد حسن',
      avatar: 'https://ui-avatars.com/api/?name=محمد+حسن&background=ef4444&color=fff',
      createdAt: '13 يناير 2024',
      totalAmount: '195.00 د.إ',
      paymentStatus: 'مدفوع',
      paymentMethod: 'Apple Pay',
      deliveryStatus: 'مكتمل'
    },
    {
      id: '#ORD-2024-004',
      customer: 'سارة أحمد',
      avatar: 'https://ui-avatars.com/api/?name=سارة+أحمد&background=6366f1&color=fff',
      createdAt: '12 يناير 2024',
      totalAmount: '350.00 د.إ',
      paymentStatus: 'مسترد',
      paymentMethod: 'Google Pay',
      deliveryStatus: 'ملغي'
    },
    {
      id: '#ORD-2024-005',
      customer: 'علي محمود',
      avatar: 'https://ui-avatars.com/api/?name=علي+محمود&background=8b5cf6&color=fff',
      createdAt: '11 يناير 2024',
      totalAmount: '180.00 د.إ',
      paymentStatus: 'مدفوع',
      paymentMethod: 'بطاقة ائتمان',
      deliveryStatus: 'مكتمل'
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* KPI Cards - الصف العلوي */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">{item.title}</p>
                <p className="text-2xl font-bold text-gray-900">{item.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              {item.trend === 'up' ? (
                <ArrowUpRight className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-medium ml-1 ${
                item.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Report & Sales Trend - الصف الثاني */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Report */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">تقرير مبيعاتك</h3>
            <p className="text-sm text-gray-600">اطلع على مبيعاتك</p>
          </div>
          
          <div className="mb-6">
            <p className="text-3xl font-bold text-gray-900 mb-2">156,420.80 د.إ</p>
            <div className="flex items-center">
              <span className="text-sm text-gray-600">142,180.50</span>
              <span className="text-sm text-green-600 mr-2">(+10.2%)</span>
              <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
            </div>
          </div>

          <div className="flex space-x-2">
            {['1يوم', '7أيام', '30يوم', '3شهور', 'سنة'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Sales Trend Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">إجمالي المبيعات</h3>
            <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
              <option>إجمالي المبيعات</option>
            </select>
          </div>
          
          <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">عرض بياني</p>
              <p className="text-sm text-gray-500">يناير 2024 مقارنة بـ ديسمبر 2023</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales by Countries, Popular Products, Orders by Countries - الصف الثالث */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales by Countries */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">المبيعات حسب البلدان</h3>
            <p className="text-sm text-gray-600">اطلع على مبيعاتك</p>
          </div>
          
          <div className="space-y-4">
            {salesByCountries.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{country.flag}</span>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{country.sales}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className={`text-sm font-medium ${
                    country.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {country.change}
                  </span>
                  {country.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600 mr-1" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Products */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">المنتجات الشائعة</h3>
            <p className="text-sm text-gray-600">إجمالي 12.6 ألف زائر</p>
          </div>
          
          <div className="space-y-4">
            {popularProducts.map((product, index) => (
              <div key={index} className="flex items-start space-x-3">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-15 h-20 object-cover rounded-lg shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">{product.name}</h4>
                  <p className="text-xs text-gray-500 mb-1">{product.category}</p>
                  <p className="text-sm font-bold text-blue-700">{product.price}</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                  </button>
                  <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded-lg font-medium shadow-sm">
                    اقرأ
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Orders by Countries */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">الطلبات حسب البلدان</h3>
            <p className="text-sm text-gray-600">164 توصيلة قيد التنفيذ</p>
          </div>
          
          <div className="mb-4">
            <div className="flex space-x-2">
              {['جديد', 'قيد التحضير', 'قيد الشحن'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-4">
            {ordersByCountries.map((order, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start space-x-3 mb-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">دار النشر</p>
                    <p className="text-xs text-gray-600">برج المكتوم، دبي، الإمارات العربية المتحدة</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {order.receiver.split('،')[0]}
                    </p>
                    <p className="text-xs text-gray-600">
                      {order.receiver.split('،').slice(1).join('،')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Latest Transaction Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">أحدث المعاملات</h3>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="البحث..."
                  className="pr-10 pl-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>هذا الشهر</option>
              </select>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <Printer className="w-4 h-4" />
              </button>
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-right">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الطلب
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  اسم العميل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  تاريخ الإنشاء
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  المبلغ الإجمالي
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  حالة الدفع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  طريقة الدفع
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  حالة التوصيل
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {latestTransactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input type="checkbox" className="rounded border-gray-300" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <img
                        src={transaction.avatar}
                        alt={transaction.customer}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm text-gray-900">{transaction.customer}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.createdAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {transaction.totalAmount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.paymentStatus === 'مدفوع' 
                        ? 'bg-green-100 text-green-800'
                        : transaction.paymentStatus === 'غير مدفوع'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {transaction.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      transaction.deliveryStatus === 'مكتمل' 
                        ? 'bg-green-100 text-green-800'
                        : transaction.deliveryStatus === 'ملغي'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {transaction.deliveryStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <Printer className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-700">
              عرض 1 إلى 5 من 50 إدخال
            </p>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                &lt;&lt;
              </button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                &lt;
              </button>
              <button className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg">
                1
              </button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                2
              </button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                3
              </button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                4
              </button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                5
              </button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                &gt;
              </button>
              <button className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700">
                &gt;&gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAnalytics; 