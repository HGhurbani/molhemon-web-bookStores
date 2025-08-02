import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Send, 
  Paperclip, 
  MoreVertical, 
  CheckCircle,
  User,
  MessageCircle,
  Star,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { collection, onSnapshot, addDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase.js';
import api from '@/lib/api.js';

const DashboardChat = ({ messages = [] }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const messagesRef = useRef(null);

  // بيانات تجريبية للمحادثات
  const mockChats = [
    {
      userId: '1',
      email: 'diana.rose@example.com',
      name: 'Diana Rose',
      lastMessage: 'It is a long established fact',
      unreadCount: 2,
      avatar: 'https://ui-avatars.com/api/?name=Diana+Rose&background=6366f1&color=fff'
    },
    {
      userId: '2',
      email: 'lily.williams@example.com',
      name: 'Lily Williams',
      lastMessage: 'It is a long established fact',
      unreadCount: 1,
      avatar: 'https://ui-avatars.com/api/?name=Lily+Williams&background=10b981&color=fff'
    },
    {
      userId: '3',
      email: 'clark.kent@example.com',
      name: 'Clark Kent',
      lastMessage: 'It is a long established fact',
      unreadCount: 3,
      avatar: 'https://ui-avatars.com/api/?name=Clark+Kent&background=f59e0b&color=fff'
    },
    {
      userId: '4',
      email: 'peter.parker@example.com',
      name: 'Peter Parker',
      lastMessage: 'It is a long established fact',
      unreadCount: 5,
      avatar: 'https://ui-avatars.com/api/?name=Peter+Parker&background=ef4444&color=fff'
    },
    {
      userId: '5',
      email: 'washington@example.com',
      name: 'Washington',
      lastMessage: 'It is a long established fact',
      unreadCount: 0,
      avatar: 'https://ui-avatars.com/api/?name=Washington&background=8b5cf6&color=fff'
    }
  ];

  // تجميع المحادثات الفريدة مع دمج البيانات التجريبية
  const chatThreads = React.useMemo(() => {
    const map = new Map();
    
    // إضافة البيانات التجريبية
    mockChats.forEach(chat => {
      map.set(chat.userId, chat);
    });
    
    // إضافة الرسائل الفعلية
    messages.forEach((m) => {
      const key = m.userId || m.email;
      if (!map.has(key)) {
        map.set(key, { 
          userId: m.userId, 
          email: m.email, 
          name: m.name,
          lastMessage: m.text,
          unreadCount: 0,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || 'User')}&background=6366f1&color=fff`
        });
      } else {
        // تحديث آخر رسالة
        const existing = map.get(key);
        if (new Date(m.createdAt?.toDate?.() || m.createdAt) > new Date(existing.lastMessageTime || 0)) {
          existing.lastMessage = m.text;
          existing.lastMessageTime = m.createdAt?.toDate?.() || m.createdAt;
        }
      }
    });
    return Array.from(map.values());
  }, [messages]);

  // رسائل تجريبية للمحادثة النشطة
  const mockMessages = [
    {
      id: '1',
      text: 'Hi! I\'m looking for the book "What remain of the remains". Do you still have it in stock?',
      sender: 'user',
      createdAt: new Date('2024-01-15T19:16:00')
    },
    {
      id: '2',
      text: 'Hi there! Yes, "What remain of the remains" is currently in stock. Would you like the hardcover or paperback edition?',
      sender: 'admin',
      createdAt: new Date('2024-01-15T19:17:00')
    },
    {
      id: '3',
      text: 'Great! I\'ll go with the paperback. How much is it?',
      sender: 'user',
      createdAt: new Date('2024-01-15T19:18:00')
    },
    {
      id: '4',
      text: 'The paperback is $12.99. We\'re also offering free shipping for orders over $20. Would you like to add another title?',
      sender: 'admin',
      createdAt: new Date('2024-01-15T19:19:00')
    },
    {
      id: '5',
      text: 'Yes, please! Can I pay via card?',
      sender: 'user',
      createdAt: new Date('2024-01-15T19:20:00')
    },
    {
      id: '6',
      text: 'Absolutely! I\'ll send you the payment link now. Once it\'s confirmed, your books will ship within 24 hours.',
      sender: 'admin',
      createdAt: new Date('2024-01-15T19:21:00')
    }
  ];

  // تحميل رسائل المحادثة النشطة
  useEffect(() => {
    if (!activeChat) return;
    
    // استخدام الرسائل التجريبية إذا كانت المحادثة النشطة هي Diana Rose
    if (activeChat.name === 'Diana Rose') {
      setChatMessages(mockMessages);
      return;
    }
    
    const q = query(
      collection(db, 'messages'),
      where(activeChat.userId ? 'userId' : 'email', '==', activeChat.userId || activeChat.email),
      orderBy('createdAt', 'asc')
    );
    
    const unsub = onSnapshot(q, snap => {
      setChatMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    
    return () => unsub();
  }, [activeChat]);

  // التمرير التلقائي للأسفل
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const sendMessage = async () => {
    if (!activeChat || !newMessage.trim()) return;
    
    const newMsg = {
      id: Date.now().toString(),
      text: newMessage.trim(),
      sender: 'admin',
      createdAt: new Date(),
    };
    
    setChatMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    
    // إرسال الرسالة إلى Firebase إذا لم تكن المحادثة التجريبية
    if (activeChat.name !== 'Diana Rose') {
      await addDoc(collection(db, 'messages'), {
        userId: activeChat.userId || null,
        name: activeChat.name,
        email: activeChat.email,
        text: newMessage.trim(),
        sender: 'admin',
        createdAt: new Date(),
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredChats = chatThreads.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // مكون بطاقة المنتج
  const ProductCard = () => (
    <div className="bg-white border border-gray-200 rounded-lg p-3 max-w-xs">
      <div className="flex items-start space-x-3 rtl:space-x-reverse">
        <img 
          src="https://via.placeholder.com/60x80/6366f1/ffffff?text=كتاب" 
          alt="Book cover"
          className="w-15 h-20 object-cover rounded"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 mb-1">What Remain Of The Remains</h4>
          <p className="text-xs text-gray-500 mb-1">Clark Kent</p>
          <div className="flex items-center mb-2">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600 ml-1">4.4</span>
          </div>
          <p className="text-sm font-semibold text-gray-900">45.00 AED</p>
        </div>
        <div className="flex flex-col space-y-1">
          <button className="p-1 text-gray-400 hover:text-red-500">
            <Heart className="w-4 h-4" />
          </button>
          <button className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
            Read
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-full bg-gray-50">
      {/* قائمة المحادثات */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* شريط البحث */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="البحث في المحادثات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rtl:pr-10 rtl:pl-3"
            />
          </div>
        </div>

        {/* قائمة المحادثات */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat, index) => (
            <div
              key={chat.userId || chat.email}
              onClick={() => setActiveChat(chat)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                activeChat?.userId === chat.userId && activeChat?.email === chat.email ? 'bg-purple-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="relative">
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">{chat.name}</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">مستخدم</span>
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-1">{chat.lastMessage}</p>
                </div>
                {chat.unreadCount > 0 && (
                  <div className="bg-purple-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* منطقة المحادثة النشطة */}
      <div className="flex-1 flex flex-col bg-white">
        {activeChat ? (
          <>
            {/* رأس المحادثة */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <div className="relative">
                  <img
                    src={activeChat.avatar}
                    alt={activeChat.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <CheckCircle className="absolute -bottom-1 -right-1 w-4 h-4 text-blue-500 bg-white rounded-full" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{activeChat.name}</h3>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">مستخدم</span>
                </div>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <User className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* منطقة الرسائل */}
            <div 
              ref={messagesRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {chatMessages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'admin' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'admin' ? 'text-purple-200' : 'text-gray-500'
                    }`}>
                      {message.sender === 'admin' ? 'أنت' : activeChat.name} • {
                        message.createdAt?.toLocaleTimeString?.('ar-SA', {
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        }) || '07:16 م'
                      }
                    </p>
                  </div>
                </div>
              ))}
              
              {/* إضافة بطاقة المنتج بعد الرسالة الأولى من Diana Rose */}
              {activeChat.name === 'Diana Rose' && (
                <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-md">
                    <ProductCard />
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      Diana • 07:16 م
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* منطقة إدخال الرسالة */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Paperclip className="w-5 h-5" />
                </button>
                <Input
                  type="text"
                  placeholder="اكتب رسالتك..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6"
                >
                  إرسال
                </Button>
              </div>
            </div>
          </>
        ) : (
          // رسالة عندما لا توجد محادثة نشطة
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">اختر محادثة</h3>
              <p className="text-gray-500">اختر محادثة من القائمة لبدء المحادثة</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardChat; 