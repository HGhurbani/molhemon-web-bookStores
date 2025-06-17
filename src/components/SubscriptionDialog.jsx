import React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog.jsx'
import { Button } from '@/components/ui/button.jsx'

const SubscriptionDialog = ({ open, onOpenChange }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-sm space-y-4">
      <DialogTitle className="text-center text-lg font-bold">استمتع بقراءة واستماع بلا حدود</DialogTitle>
      <DialogDescription className="text-center">لمواصلة القراءة والاستماع – تحتاج إلى باقة اشتراكك.</DialogDescription>
      <ul className="space-y-1 text-sm rtl:text-right">
        <li>كتب إلكترونية وصوتية بلا حدود 📚</li>
        <li>وصول إلى مجموعات مختارة 📂</li>
        <li>تنزيل الكتب دون اتصال 📥</li>
      </ul>
      <Button className="w-full bg-purple-700 hover:bg-purple-800 text-white">اشترك الآن</Button>
    </DialogContent>
  </Dialog>
)

export default SubscriptionDialog
