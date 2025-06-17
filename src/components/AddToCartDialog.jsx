import React from 'react'
import { Link } from 'react-router-dom'
import { Dialog, DialogContent } from '@/components/ui/dialog.jsx'
import { Button } from '@/components/ui/button.jsx'
import YouMayAlsoLikeSection from '@/components/YouMayAlsoLikeSection.jsx'

const AddToCartDialog = ({ open, onOpenChange, book, recommendedBooks, handleAddToCart, handleToggleWishlist, wishlist, authors }) => {
  if (!book) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <img alt={`غلاف كتاب ${book.title}`} className="w-16 h-20 object-cover rounded" src={book.coverImage || 'https://images.unsplash.com/photo-1572119003128-d110c07af847'} />
            <h2 className="font-semibold text-sm">{book.title}</h2>
          </div>
          <Button asChild className="h-9 bg-blue-600 hover:bg-blue-700 text-white">
            <Link to="/cart">انظر إلى السلة</Link>
          </Button>
        </div>
        <YouMayAlsoLikeSection
          books={recommendedBooks}
          handleAddToCart={handleAddToCart}
          handleToggleWishlist={handleToggleWishlist}
          wishlist={wishlist}
          authors={authors}
        />
      </DialogContent>
    </Dialog>
  )
}

export default AddToCartDialog
