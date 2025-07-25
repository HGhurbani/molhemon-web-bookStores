import React, { useState, useEffect } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import * as DialogPrimitive from '@radix-ui/react-dialog';

const ChatWidget = ({ open, onOpenChange, contact = { type: 'admin', name: 'الدعم' } }) => {
  const contactKey = `${contact.type}_${contact.name}`;
  const [messages, setMessages] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`chat_${contactKey}`)) || [];
    } catch {
      return [];
    }
  });
  const [text, setText] = useState('');

  useEffect(() => {
    localStorage.setItem(`chat_${contactKey}`, JSON.stringify(messages));
  }, [messages, contactKey]);

  const send = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: trimmed }]);
    setText('');
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'contact', text: 'شكرًا لتواصلك! سيتم الرد قريبًا.' }]);
    }, 800);
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
            <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`${m.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'} rounded-lg px-3 py-1 max-w-[70%]`}>{m.text}</div>
            </div>
          ))}
        </div>
        <div className="p-3 border-t bg-white flex gap-2">
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
