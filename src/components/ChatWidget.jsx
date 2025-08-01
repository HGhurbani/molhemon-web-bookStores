import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button.jsx';
import { collection, onSnapshot, addDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase.js';
import api from '@/lib/api.js';

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
  const messagesRef = useRef(null);
  const isLoggedIn =
    !!targetUser || localStorage.getItem('customerLoggedIn') === 'true';

  useEffect(() => {
    if (!isLoggedIn) return;
    if (targetUser) {
      setUserId(targetUser.userId || '');
      setName(targetUser.name || '');
      setEmail(targetUser.email || '');
      return;
    }
    const id = localStorage.getItem('currentUserId');
    if (id) {
      setUserId(id);
      api.getUser(id).then((u) => {
        if (u) {
          setName(u.name || '');
          setEmail(u.email || '');
        }
      });
    }
  }, [targetUser, isLoggedIn]);

  useEffect(() => {
    if (!userId && !email) return;
    const q = query(
      collection(db, 'messages'),
      where(userId ? 'userId' : 'email', '==', userId || email),
      orderBy('createdAt', 'asc')
    );
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [userId, email]);

  useEffect(() => {
    if (open && messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages, open]);

  const send = async () => {
    if (!isLoggedIn) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!name || !email) return;
    await addDoc(collection(db, 'messages'), {
      userId: userId || null,
      name,
      email,
      text: trimmed,
      sender: targetUser ? 'admin' : 'user',
      createdAt: new Date(),
    });
    setText('');
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
                <div className={`${m.sender === 'admin' ? 'bg-white text-gray-800' : 'bg-blue-600 text-white'} rounded-lg px-3 py-1 max-w-[70%]`}>{m.text}</div>
              </div>
            ))}
          </div>
          <div className="p-3 border-t bg-white flex flex-col gap-2">
            {!userId && (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border rounded px-2 py-1 text-sm mb-2 focus:outline-none"
                placeholder="اسمك"
              />
            )}
            {!userId && (
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded px-2 py-1 text-sm mb-2 focus:outline-none"
                placeholder="بريدك الإلكتروني"
              />
            )}
            <div className="flex gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="flex-grow border rounded px-2 py-1 text-sm focus:outline-none"
                placeholder="اكتب رسالتك"
              />
              <Button size="sm" className="h-8 bg-blue-600 text-white" onClick={send}>
                <Send className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0" />
                إرسال
              </Button>
            </div>
          </div>
        </div>
      )}
      {!open && (
        <button
          onClick={() => onOpenChange(true)}
          className="fixed bottom-6 left-6 rtl:left-auto rtl:right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      )}
    </>
  );
};

export default ChatWidget;
