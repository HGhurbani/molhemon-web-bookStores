import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { collection, onSnapshot, addDoc, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase.js';
import api from '@/lib/api.js';
import { auth } from '@/lib/firebase.js';
import logger from '@/lib/logger.js';

const ChatWidget = ({
  open,
  onOpenChange,
  contact = { type: 'admin', name: 'الدعم' },
  targetUser = null,
}) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesRef = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!targetUser || !!auth.currentUser);

  useEffect(() => {
    if (targetUser) {
      setUserId(targetUser.userId || '');
      setName(targetUser.name || '');
      setEmail(targetUser.email || '');
      setIsLoggedIn(true);
      return;
    }
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserId(user.uid);
        setName(user.displayName || '');
        setEmail(user.email || '');
      } else {
        setIsLoggedIn(false);
        setUserId('');
        setName('');
        setEmail('');
      }
    });
    return () => unsubscribe();
  }, [targetUser]);

  useEffect(() => {
    if (!isLoggedIn || !userId || targetUser) return;

    api
      .getCustomer(userId)
      .then((u) => {
        if (u) {
          setName(u.displayName || '');
          setEmail(u.email || '');
        }
      })
      .catch((error) => {
        logger.error('Error fetching customer data:', error);
      });
  }, [userId, isLoggedIn, targetUser]);

  useEffect(() => {
    if (!userId && !email) return;
    
    const q = query(
      collection(db, 'messages'),
      where(userId ? 'userId' : 'email', '==', userId || email),
      orderBy('createdAt', 'asc')
    );
    
    const unsub = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(d => ({ 
        id: d.id, 
        ...d.data(),
        createdAt: d.data().createdAt?.toDate?.() || new Date(),
        isNew: true // مؤشر للرسائل الجديدة
      }));
      
      // تحديث الرسائل مع الحفاظ على الرسائل المؤقتة
      setMessages(prev => {
        const tempMessages = prev.filter(msg => msg.isPending);
        const firebaseMessages = newMessages.filter(msg => !msg.isPending);
        const allMessages = [...tempMessages, ...firebaseMessages];
        
        // ترتيب الرسائل حسب التاريخ
        return allMessages.sort((a, b) => {
          const dateA = new Date(a.createdAt);
          const dateB = new Date(b.createdAt);
          return dateA - dateB;
        });
      });
      
      // التمرير إلى أسفل عند استلام رسائل جديدة
      const changes = snapshot.docChanges();
      const hasNewMessages = changes.some(change => change.type === 'added');
      
      if (hasNewMessages) {
        // التمرير الفوري
        if (messagesRef.current) {
          messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
        
        // إزالة مؤشر "جديد" بعد ثانيتين
        setTimeout(() => {
          setMessages(prev => prev.map(msg => ({ ...msg, isNew: false })));
        }, 2000);
      }
    }, (error) => {
      logger.error('Error listening to messages:', error);
    });
    
    return () => unsub();
  }, [userId, email]);

  useEffect(() => {
    if (open && messagesRef.current) {
      setTimeout(() => {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }, 100);
    }
  }, [messages, open]);

  const send = async () => {
    if (!isLoggedIn || isLoading) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!name || !email) return;
    
    setIsLoading(true);
    
    try {
      // إضافة الرسالة فوراً للحالة المحلية
      const newMessage = {
        id: `temp-${Date.now()}`,
        userId: userId || null,
        name,
        email,
        text: trimmed,
        sender: targetUser ? 'admin' : 'user',
        createdAt: new Date(),
        isPending: true
      };
      
      setMessages(prev => [...prev, newMessage]);
      setText('');
      
      // إرسال الرسالة إلى Firebase
      const docRef = await addDoc(collection(db, 'messages'), {
        userId: userId || null,
        name,
        email,
        text: trimmed,
        sender: targetUser ? 'admin' : 'user',
        createdAt: serverTimestamp(),
      });
      
      // تحديث الرسالة المحلية بإزالة حالة الانتظار
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id 
          ? { ...msg, id: docRef.id, isPending: false }
          : msg
      ));
      
      // التمرير إلى أسفل
      if (messagesRef.current) {
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      }
      
    } catch (error) {
      logger.error('Error sending message:', error);
      // إزالة الرسالة المحلية في حالة الخطأ
      setMessages(prev => prev.filter(msg => msg.id !== `temp-${Date.now()}`));
      setText(trimmed); // إعادة النص
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <>
      {open && !isLoggedIn && (
        <div className="fixed bottom-0 left-4 rtl:right-auto rtl:right-4 w-80 bg-white rounded-t-lg shadow-lg flex flex-col">
          <div className="flex items-center justify-between p-3 border-b">
            <span className="font-semibold text-sm">{contact.name}</span>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => onOpenChange(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="p-4 text-sm text-center">يجب تسجيل الدخول لاستخدام الدردشة</div>
          <div className="p-3 border-t bg-white flex justify-center">
            <a href="/auth" className="text-blue-600 hover:underline">تسجيل الدخول</a>
          </div>
        </div>
      )}
      {open && isLoggedIn && (
        <div className="fixed bottom-0 left-4 rtl:left-auto rtl:right-4 w-80 bg-white rounded-t-lg shadow-lg flex flex-col">
          <div className="flex items-center justify-between p-3 border-b">
            <span className="font-semibold text-sm">{contact.name}</span>
            <button className="text-gray-500 hover:text-gray-700" onClick={() => onOpenChange(false)}>
              <X className="w-5 h-5" />
            </button>
          </div>
          <div ref={messagesRef} className="p-3 space-y-2 h-64 overflow-y-auto bg-gray-50 text-sm">
            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.sender === 'admin' ? 'justify-start' : 'justify-end'}`}>
                <div className={`${m.sender === 'admin' ? 'bg-white text-gray-800' : 'bg-blue-600 text-white'} rounded-lg px-3 py-1 max-w-[70%] relative`}>
                  {m.text}
                  {m.isPending && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  )}
                  {m.isNew && !m.isPending && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
            ))}
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-4">
                لا توجد رسائل بعد. ابدأ المحادثة الآن!
              </div>
            )}
          </div>
          <div className="p-3 border-t bg-white flex flex-col gap-2">
            {!userId && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded px-2 py-1 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="اسمك"
              />
            )}
            {!userId && (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded px-2 py-1 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="بريدك الإلكتروني"
              />
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-grow border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="اكتب رسالتك (اضغط Enter للإرسال)"
                disabled={isLoading}
              />
              <Button 
                size="sm" 
                className="h-8 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50" 
                onClick={send}
                disabled={isLoading || !text.trim()}
              >
                <Send className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0" />
                {isLoading ? 'جاري...' : 'إرسال'}
              </Button>
            </div>
          </div>
        </div>
      )}
      {!open && (
        <button
          onClick={() => onOpenChange(true)}
          className="fixed bottom-6 left-6 rtl:left-auto rtl:right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default ChatWidget;
