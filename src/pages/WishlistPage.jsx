import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { ProductCard } from '../components/common/ProductCard';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { PageTransition } from '../components/common/PageTransition';

export const WishlistPage = () => {
  const { wishlistItems, wishlistCount, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddAllToCart = () => {
    wishlistItems.forEach((product) => {
      addToCart(product, 1, null, null, false);
    });
  };

  if (wishlistCount === 0) {
    return (
      <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-charcoal-900 dark:text-ivory-100">
        <div className="max-w-md mx-auto bg-white dark:bg-forest-900 rounded-3xl p-10 border border-gray-200 dark:border-forest-800 shadow-sm space-y-4">
          <div className="w-20 h-20 rounded-full bg-sage-100 dark:bg-forest-800 mx-auto flex items-center justify-center border border-leaf-500/20">
            <Heart className="w-10 h-10 text-leaf-600 dark:text-leaf-400" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-charcoal-950 dark:text-white">Your Wishlist is Empty</h2>
          <p className="text-xs sm:text-sm text-charcoal-600 dark:text-gray-400">
            Keep track of your favorite ready-to-cook delicacies and kebabs by tapping the heart icon on any product.
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3 bg-[#84CC16] hover:bg-[#65a30d] text-forest-950 font-black text-xs sm:text-sm rounded-2xl shadow-sm hover:scale-105 transition-all cursor-pointer"
          >
            Discover Delicacies
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-charcoal-900 dark:text-ivory-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-200 dark:border-forest-800">
        <div>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-charcoal-950 dark:text-white">
            My Saved Wishlist
          </h1>
          <p className="text-xs text-charcoal-600 dark:text-gray-400 mt-1">
            You have <strong className="text-charcoal-950 dark:text-white font-bold">{wishlistCount}</strong> delicious {wishlistCount === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddAllToCart}
            className="px-4 py-2.5 bg-[#84CC16] hover:bg-[#65a30d] text-forest-950 font-black text-xs rounded-xl shadow-sm flex items-center gap-1.5 cursor-pointer hover:scale-102 transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add All to Bag</span>
          </button>
          <button
            onClick={clearWishlist}
            className="px-4 py-2.5 bg-white dark:bg-forest-900 border border-gray-300 dark:border-forest-700 text-charcoal-700 dark:text-gray-300 hover:text-red-500 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Grid of Wishlisted Products */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
        {wishlistItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </PageTransition>
  );
};
