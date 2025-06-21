import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog' // تم إضافة هذا الاستيراد
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog.jsx'
import { Button } from '@/components/ui/button.jsx'
import { ChevronLeft, X } from 'lucide-react'; // تم إضافة هذا الاستيراد للأيقونات


const SubscriptionDialog = ({ open, onOpenChange, book, onAddToCart }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-4xl space-y-6">
      {/* Close Button at Top Right of the DialogContent */}
      <DialogPrimitive.Close className='absolute top-3 left-3 text-gray-500 hover:text-gray-700'>
        <X className='h-5 w-5' />
      </DialogPrimitive.Close>

      {/* Header and Back Button */}
      <div className="flex items-center text-blue-600 mb-4 sm:mb-6 cursor-pointer" onClick={() => onOpenChange(false)}>
        <ChevronLeft className="w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />
        <span className="text-sm font-medium">العودة إلى المتجر. قبل أن تحارب الكذب</span>
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-10 gap-6">
        {/* Sample Text Section */}
        <div className="md:col-span-7 text-sm leading-relaxed space-y-4 rtl:text-right">
          <h3 className="text-lg font-semibold mb-3">الفصل الأول</h3>
          <h4 className="text-md font-medium text-gray-700 mb-4">رحلة إلى أسلوبك الفريد</h4>
          <p data-edit-id="src/components/SubscriptionDialog.jsx:26:13">كان صباحًا منعشًا في بلدة بيلا في الماهامجا. حيث كانت الشوارع تعج بالنشاط بين بين الحشد الذي لايعد ولا يحصى. الناس فقط يفضلون منطقة الأليفينو في براغاشثة الغربية في اختيار الإكسيليونغا، بل يفضلن مثالة القادمة التي لا تذكر لم يكن يمكن لأحد قادمًا. لقد كان رمزًا للآزانغا، ويوشافتا، وصديقًا لكل من يكتشفون داته الحقيقية من خلال المؤمنة.</p>
          <p data-edit-id="src/components/SubscriptionDialog.jsx:27:13">اليوم، كان كل شيء في مهمة. كان مهرجان "الصحوة اللغوية" السنوي في المدينة يقترب بسرعة، وقد اختير ليمنا لتوجيه مجموعة من الأفراد المتحمسين المستعدين لخوض رحلتهم لاكتشاف المفاهيم الفريدة. بوضعية تعابير يتوقف في السماء ويقدم ملاحظاته الموثوقة. أطلقوا لقاء قادته الجدة.</p>
          <h5 className="font-semibold text-base mb-2">التجمع</h5>
          <p data-edit-id="src/components/SubscriptionDialog.jsx:29:13">كان صباحًا منعشًا في بلدة بيلا في الماهامجا. حيث كانت الشوارع تعج بالنشاط بين بين الحشد الذي لايعد ولا يحصى. الناس فقط يفضلون منطقة الأليفينو في براغاشثة الغربية في اختيار الإكسيليونغا، بل يفضلن مثالة القادمة التي لا تذكر لم يكن يمكن لأحد قادمًا. لقد كان رمزًا للآزانغا، ويوشافتا، وصديقًا لكل من يكتشفون داته الحقيقية من خلال المؤمنة.</p>
          <p data-edit-id="src/components/SubscriptionDialog.jsx:30:13">اليوم، كان كل شيء في مهمة. كان مهرجان "الصحوة اللغوية" السنوي في المدينة يقترب بسرعة، وقد اختير ليمنا لتوجيه مجموعة من الأفراد المتحمسين المستعدين لخوض رحلتهم لاكتشاف المفاهيم الفريدة. بوضعية تعابير يتوقف في السماء ويقدم ملاحظاته الموثوقة. أطلقوا لقاء قادته الجدة.</p>
          <p data-edit-id="src/components/SubscriptionDialog.jsx:31:13">اليوم، كان كل شيء في مهمة. كان مهرجان "الصحوة اللغوية" السنوي في المدينة يقترب بسرعة، وقد اختير ليمنا لتوجيه مجموعة من الأفراد المتحمسين المستعدين لخوض رحلتهم لاكتشاف المفاهيم الفريدة. بوضعية تعابير يتوقف في السماء ويقدم ملاحظاته الموثوقة. أطلقوا لقاء قادته الجدة.</p>
        </div>

        {/* Book Info and Subscription Prompt Section */}
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
              <i className="fa-solid fa-cart-plus w-4 h-4 ml-2 rtl:mr-2 rtl:ml-0" />أضف إلى السلة
            </Button>
            <Button variant="secondary" className="w-full mb-3">اشتري الان بنقرة واحدة</Button>
            <div className="flex justify-around text-sm text-gray-600">
              <Button variant="ghost" size="sm" className="px-2"><i className="fa-solid fa-comment ml-2 rtl:mr-2 rtl:ml-0" />دردش</Button>
              <Button variant="ghost" size="sm" className="px-2"><i className="fa-solid fa-heart ml-2 rtl:mr-2 rtl:ml-0" />قائمة الرغبات</Button>
              <Button variant="ghost" size="sm" className="px-2"><i className="fa-solid fa-share ml-2 rtl:mr-2 rtl:ml-0" />مشاركة</Button>
            </div>
          </div>
          <hr />
          <img data-edit-id="src/components/SubscriptionDialog.jsx:70:11" alt={`غلاف كتاب ${book?.title}`} className="w-full h-40 object-cover rounded" src="/Darmolhimon_ Read Sample.png" />
          <div className="space-y-2 text-center">
            <DialogTitle data-edit-id="src/components/SubscriptionDialog.jsx:72:13" className="text-lg font-bold">استمتع بقراءة واستماع بلا حدود</DialogTitle>
            <DialogDescription data-edit-id="src/components/SubscriptionDialog.jsx:73:13">لمواصلة القراءة والاستماع – تحتاج إلى باقة اشتراكك.</DialogDescription>
            <ul className="space-y-1 text-sm rtl:text-right">
              <li data-edit-id="src/components/SubscriptionDialog.jsx:75:15"><i className="fa-solid fa-book-open ml-2 rtl:mr-2 rtl:ml-0" />كتب إلكترونية وصوتية بلا حدود</li>
              <li data-edit-id="src/components/SubscriptionDialog.jsx:76:15"><i className="fa-solid fa-folder-open ml-2 rtl:mr-2 rtl:ml-0" />وصول إلى مجموعات مختارة</li>
              <li data-edit-id="src/components/SubscriptionDialog.jsx:77:15"><i className="fa-solid fa-download ml-2 rtl:mr-2 rtl:ml-0" />تنزيل الكتب دون اتصال</li>
            </ul>
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">اشترك الآن</Button>
          </div>
        </div>
      </div>
    </DialogContent>
  </Dialog>
)

export default SubscriptionDialog