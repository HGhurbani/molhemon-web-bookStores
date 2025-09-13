import React from 'react'
import { Link } from 'react-router-dom'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog.jsx'
import { Button } from '@/components/ui/button.jsx'
import * as DialogPrimitive from '@radix-ui/react-dialog' // Ensure this is imported for DialogPrimitive.Close
import { CheckCircle2 } from 'lucide-react'; // Importing a check icon for success


const AddToCartDialog = ({ open, onOpenChange, book, handleAddToCart, handleToggleWishlist, wishlist, authors }) => {
  if (!book) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-6 sm:max-w-lg md:max-w-xl lg:max-w-2xl xl:max-w-4xl">
        <DialogTitle className="sr-only">تمت الإضافة بنجاح</DialogTitle>

        {/* Dialog Header */}
        <div className="flex items-center justify-center border-b pb-4">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            <h2 className="text-lg font-semibold">تمت الإضافة بنجاح!</h2>
          </div>
        </div>

        {/* Book that was added */}
        <div className="flex items-center space-x-4 rtl:space-x-reverse py-3 px-2 bg-slate-50 rounded-lg">
          <img alt={`غلاف كتاب ${book.title}`} className="w-16 h-20 object-cover rounded shadow-sm" src={book.coverImage || 'https://darmolhimon.com/wp-content/uploads/2025/05/بيكي-بلايندرز-1-300x450.jpeg'} />
          <div className="flex-grow">
            <h3 className="font-semibold text-gray-800 text-sm">{book.title}</h3>
            <p className="text-gray-500 text-xs">{book.author}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button 
            onClick={() => onOpenChange(false)}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
          >
            متابعة التسوق
          </Button>
          <Button 
            onClick={() => onOpenChange(false)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Link to="/cart" onClick={() => onOpenChange(false)}>انظر إلى السلة</Link>
          </Button>
        </div>

      </DialogContent>
    </Dialog>
  )
}

export default AddToCartDialog;
