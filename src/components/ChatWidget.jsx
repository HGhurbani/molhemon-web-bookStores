import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { collection, onSnapshot, addDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase.js';
import api from '@/lib/api.js';

const ChatWidget = ({ open, onOpenChange, contact = { type: 'admin', name: 'الدعم' } }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const id = localStorage.getItem('currentUserId');
    if (localStorage.getItem('customerLoggedIn') === 'true' && id) {
      setUserId(id);
      api.getUser(id).then(u => {
        if (u) {
          setName(u.name || '');
          setEmail(u.email || '');
        }
      });
    }
  }, []);

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

  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!name || !email) return;
    await addDoc(collection(db, 'messages'), {
      userId: userId || null,
      name,
      email,
      text: trimmed,
      createdAt: new Date(),
    });
    setText('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-sm">
        <div className="flex items-center justify-between p-3 border-b bg-white">
          <span className="font-semibold text-sm">{contact.name}</span>
          <DialogPrimitive.Close className="text-gray-500 hover:text-gray-700">
            <X className="w-5 h-5" />
          </DialogPrimitive.Close>
        </div>
        <div className="p-3 space-y-2 h-64 overflow-y-auto bg-gray-50 text-sm">
          {messages.map(m => (
            <div key={m.id} className="space-y-1">
              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-lg px-3 py-1 max-w-[70%]">{m.text}</div>
              </div>
              {m.reply && (
                <div className="flex justify-start">
                  <div className="bg-white text-gray-800 rounded-lg px-3 py-1 max-w-[70%]">{m.reply}</div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="p-3 border-t bg-white flex flex-col gap-2">
          {!userId && (
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="border rounded px-2 py-1 text-sm mb-2 focus:outline-none"
              placeholder="اسمك"
            />
          )}
          {!userId && (
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="border rounded px-2 py-1 text-sm mb-2 focus:outline-none"
              placeholder="بريدك الإلكتروني"
            />
          )}
          <div className="flex gap-2">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              className="flex-grow border rounded px-2 py-1 text-sm focus:outline-none"
              placeholder="اكتب رسالتك"
            />
            <Button size="sm" className="h-8 bg-blue-600 text-white" onClick={send}>
              <Send className="w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0" />
              إرسال
            </Button>
          </div>
        </div>
      </DialogContent>
      {!open && (
        <DialogPrimitive.Trigger asChild>
          <button className="fixed bottom-6 left-6 rtl:left-auto rtl:right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700">
            <MessageCircle className="w-5 h-5" />
          </button>
        </DialogPrimitive.Trigger>
      )}
    </Dialog>
  );
};

export default ChatWidget;
