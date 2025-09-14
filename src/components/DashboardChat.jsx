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
import { collection, onSnapshot, addDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase.js';
import api from '@/lib/api.js';
import logger from '@/lib/logger.js';

const DashboardChat = ({ messages = [] }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [chatThreads, setChatThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesRef = useRef(null);

  // تجميع المحادثات الفريدة من الرسائل الحقيقية
  useEffect(() => {
    if (!messages || messages.length === 0) {
      setChatThreads([]);
      setLoading(false);
      return;
    }

    const threadsMap = new Map();
    
    messages.forEach((message) => {
      const key = message.userId || message.email || message.contactId;
      if (!key) return;
      
      if (!threadsMap.has(key)) {
        threadsMap.set(key, {
          userId: message.userId,
          email: message.email,
          contactId: message.contactId,
          name: message.name || message.senderName || 'مستخدم',
          lastMessage: message.text || message.message,
          lastMessageTime: message.createdAt?.toDate?.() || message.createdAt || new Date(),
          unreadCount: message.sender === 'user' ? 1 : 0,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(message.name || message.senderName || 'مستخدم')}&background=6366f1&color=fff`
        });
      } else {
        const existing = threadsMap.get(key);
        const messageTime = message.createdAt?.toDate?.() || message.createdAt || new Date();
        
        if (messageTime > existing.lastMessageTime) {
          existing.lastMessage = message.text || message.message;
          existing.lastMessageTime = messageTime;
        }
        
        if (message.sender === 'user') {
          existing.unreadCount += 1;
        }
      }
    });

    const sortedThreads = Array.from(threadsMap.values())
      .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
    
    setChatThreads(sortedThreads);
    setLoading(false);
  }, [messages]);

  // تحميل رسائل المحادثة النشطة
  useEffect(() => {
    if (!activeChat) {
      setChatMessages([]);
      return;
    }
    
    const q = query(
      collection(db, 'messages'),
      where(activeChat.userId ? 'userId' : 'email', '==', activeChat.userId || activeChat.email),
      orderBy('createdAt', 'asc')
    );
    
    const unsub = onSnapshot(q, snap => {
      const messages = snap.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        timestamp: d.data().createdAt?.toDate?.() || d.data().createdAt || new Date()
      }));
      setChatMessages(messages);
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
      timestamp: new Date(),
    };
    
    setChatMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    
    // إرسال الرسالة إلى Firebase
    try {
      await addDoc(collection(db, 'messages'), {
        userId: activeChat.userId || null,
        email: activeChat.email || null,
        contactId: activeChat.contactId || null,
        name: activeChat.name,
        text: newMessage.trim(),
        sender: 'admin',
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      logger.error('Error sending message:', error);
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
    (chat.email && chat.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // مكون بطاقة المنتج
  const ProductCard = () => (
    <div className="bg-white border border-gray-200 rounded-xl p-4 max-w-xs shadow-sm">
      <div className="flex items-start space-x-3 rtl:space-x-reverse">
        <img 
          src="https://via.placeholder.com/60x80/6366f1/ffffff?text=كتاب" 
          alt="Book cover"
          className="w-15 h-20 object-cover rounded-lg shadow-sm"
        />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-900 mb-1">What Remain Of The Remains</h4>
          <p className="text-xs text-gray-500 mb-1">Clark Kent</p>
          <div className="flex items-center mb-2">
            <Star className="w-3 h-3 text-yellow-400 fill-current" />
            <span className="text-xs text-gray-600 ml-1">4.4</span>
          </div>
          <p className="text-sm font-bold text-blue-700">45.00 AED</p>
        </div>
        <div className="flex flex-col space-y-1">
          <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
          <button className="bg-blue-500 text-white text-xs px-3 py-1 rounded-lg font-medium shadow-sm">
            Read
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-full bg-gray-100 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل الرسائل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-gray-100">
      {/* Chat List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200 bg-white">
          <div className="relative">
            <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="البحث في المحادثات..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rtl:pr-10 rtl:pl-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchQuery ? 'لا توجد نتائج بحث' : 'لا توجد محادثات'}
            </div>
          ) : (
            filteredChats.map((chat) => (
              <div
                key={chat.userId || chat.email || chat.contactId}
                onClick={() => setActiveChat(chat)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  activeChat?.userId === chat.userId && activeChat?.email === chat.email ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="relative">
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-12 h-12 rounded-full shadow-sm"
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-gray-900 truncate">{chat.name}</p>
                      <span className="text-xs text-gray-500">
                        {chat.lastMessageTime ? new Date(chat.lastMessageTime).toLocaleTimeString('ar-SA', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true 
                        }) : ''}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage}</p>
                  </div>
                  {chat.unreadCount > 0 && (
                    <div className="bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                      {chat.unreadCount}
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Active Chat Area */}
      <div className="flex-1 flex flex-col bg-white shadow-sm">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <img
                  src={activeChat.avatar}
                  alt={activeChat.name}
                  className="w-10 h-10 rounded-full shadow-sm"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{activeChat.name}</h3>
                  <p className="text-sm text-gray-500">متصل الآن</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div 
              ref={messagesRef}
              className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
            >
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>لا توجد رسائل في هذه المحادثة</p>
                </div>
              ) : (
                chatMessages.map((message, index) => (
                  <div
                    key={message.id || index}
                    className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl shadow-sm ${
                      message.sender === 'admin'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}>
                      <p className="text-sm">{message.text || message.message}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'admin' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp ? new Date(message.timestamp).toLocaleTimeString('ar-SA', { 
                          hour: '2-digit', 
                          minute: '2-digit',
                          hour12: true 
                        }) : ''}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <Input
                  type="text"
                  placeholder="اكتب رسالة..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-6 rounded-lg font-semibold shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">اختر محادثة</h3>
              <p className="text-gray-500">اختر محادثة من القائمة لعرض الرسائل</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardChat; 