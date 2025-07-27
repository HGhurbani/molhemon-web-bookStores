import React from 'react'
import { Link } from 'react-router-dom'
import { Dialog, DialogContent } from '@/components/ui/dialog.jsx'
import { Button } from '@/components/ui/button.jsx'
import * as DialogPrimitive from '@radix-ui/react-dialog' // Ensure this is imported for DialogPrimitive.Close
import { CheckCircle2 } from 'lucide-react'; // Importing a check icon for success


const AddToCartDialog = ({ open, onOpenChange, book, handleAddToCart, handleToggleWishlist, wishlist, authors }) => {
  if (!book) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-6 sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl">
        {/* Close Button at Top Right of the DialogContent */}
        <DialogPrimitive.Close className='absolute top-3 left-3 text-gray-500 hover:text-gray-700'>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" class="lucide lucide-x h-5 w-5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
        </DialogPrimitive.Close>

        {/* Dialog Header matching the image */}
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            <h2 className="text-lg font-semibold">تمت الإضافة بنجاح!</h2>
          </div>
          <Button asChild className="h-9 bg-blue-600 hover:bg-blue-700 text-white">
            <Link to="/cart">انظر إلى السلة</Link>
          </Button>
        </div>

        {/* Book that was added */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse py-3 px-2 bg-slate-50 rounded-lg">
          <img alt={`غلاف كتاب ${book.title}`} className="w-16 h-20 object-cover rounded shadow-sm" src={book.coverImage || 'https://darmolhimon.com/wp-content/uploads/2025/05/بيكي-بلايندرز-1-300x450.jpeg'} />
          <div className="flex-grow">
            <h3 className="font-semibold text-gray-800 text-sm">{book.title}</h3>
            <p className="text-gray-500 text-xs">{book.author}</p>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  )
}

export default AddToCartDialog;
