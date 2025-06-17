import React from 'react'
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog.jsx'
import { Button } from '@/components/ui/button.jsx'

const SubscriptionDialog = ({ open, onOpenChange, book, onAddToCart }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-4xl space-y-6">
      <div className="grid md:grid-cols-10 gap-6">
        <div className="md:col-span-7 text-sm leading-relaxed space-y-4 rtl:text-right">
          <p>{book?.description}</p>
        </div>
        <div className="md:col-span-3 space-y-4">
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div className="flex justify-between items-end text-sm">
              <div>
                {book?.originalPrice && (
                  <span className="line-through text-red-500 mr-2 rtl:ml-2 rtl:mr-0">{book.originalPrice.toFixed(2)} د.إ</span>
                )}
                <div className="text-2xl font-bold text-blue-600">{book?.price.toFixed(2)} د.إ</div>
              </div>
              {book?.originalPrice && (
                <div className="text-green-600">وفر {(book.originalPrice - book.price).toFixed(2)} د.إ</div>
              )}
            </div>
            <Button onClick={onAddToCart} className="w-full bg-blue-600 hover:bg-blue-700 h-9 text-white">
              <i className="fa-solid fa-cart-plus w-4 h-4 ml-1 rtl:mr-1 rtl:ml-0" />أضف إلى السلة
            </Button>
            <Button variant="secondary" className="w-full mb-3">اشتري الان بنقرة واحدة</Button>
            <div className="flex justify-around text-sm text-gray-600">
              <Button variant="ghost" size="sm" className="px-2"><i className="fa-solid fa-comment ml-1 rtl:mr-1 rtl:ml-0" />دردش</Button>
              <Button variant="ghost" size="sm" className="px-2"><i className="fa-solid fa-heart ml-1 rtl:mr-1 rtl:ml-0" />قائمة الرغبات</Button>
              <Button variant="ghost" size="sm" className="px-2"><i className="fa-solid fa-share ml-1 rtl:mr-1 rtl:ml-0" />مشاركة</Button>
            </div>
          </div>
          <hr />
          <img alt={`غلاف كتاب ${book?.title}`} className="w-full h-40 object-cover rounded" src={book?.coverImage || 'https://images.unsplash.com/photo-1572119003128-d110c07af847'} />
          <div className="space-y-2 text-center">
            <DialogTitle className="text-lg font-bold">استمتع بقراءة واستماع بلا حدود</DialogTitle>
            <DialogDescription>لمواصلة القراءة والاستماع – تحتاج إلى باقة اشتراكك.</DialogDescription>
            <ul className="space-y-1 text-sm rtl:text-right">
              <li><i className="fa-solid fa-book-open ml-1 rtl:mr-1 rtl:ml-0" />كتب إلكترونية وصوتية بلا حدود</li>
              <li><i className="fa-solid fa-folder-open ml-1 rtl:mr-1 rtl:ml-0" />وصول إلى مجموعات مختارة</li>
              <li><i className="fa-solid fa-download ml-1 rtl:mr-1 rtl:ml-0" />تنزيل الكتب دون اتصال</li>
            </ul>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">اشترك الآن</Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
)

export default SubscriptionDialog
