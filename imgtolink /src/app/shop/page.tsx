"use client";

import { useState } from "react";
import { ArrowRight, ShoppingBag, X, Plus, Minus } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 299,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
  },
  {
    id: 2,
    name: "Minimalist Smart Watch",
    price: 199,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
  },
  {
    id: 3,
    name: "Professional Camera Lens",
    price: 899,
    image: "https://images.unsplash.com/photo-1526170315870-efeca63c5d53?w=800&q=80",
  },
];

export default function ShopPage() {
  const [bag, setBag] = useState<{ product: Product; quantity: number }[]>([]);
  const [isBagOpen, setIsBagOpen] = useState(false);

  const addToBag = (product: Product) => {
    setBag((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsBagOpen(true);
  };

  const removeFromBag = (productId: number) => {
    setBag((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setBag((prev) =>
      prev.map((item) => {
        if (item.product.id === productId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const totalAmount = bag.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      {/* Header */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-40 border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tighter">PREMIUM STORE</h1>
          <button
            onClick={() => setIsBagOpen(true)}
            className="relative p-2 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <ShoppingBag size={24} />
            {bag.length > 0 && (
              <span className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {bag.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-6xl font-black tracking-tight mb-4">New Arrivals</h2>
          <p className="text-zinc-500 text-xl">Discover our curated collection of premium tech.</p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {PRODUCTS.map((product) => (
            <div key={product.id} className="group">
              <div className="aspect-square bg-zinc-100 rounded-3xl overflow-hidden mb-6 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <button
                  onClick={() => addToBag(product)}
                  className="absolute bottom-6 left-6 right-6 bg-white text-zinc-900 py-4 rounded-2xl font-bold shadow-xl opacity-0 translate-y-4 transition-all group-hover:opacity-100 group-hover:translate-y-0"
                >
                  Add to Bag
                </button>
              </div>
              <h3 className="text-xl font-bold mb-1">{product.name}</h3>
              <p className="text-rose-500 font-black">${product.price}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Shopping Bag Sidebar */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-500 ${
          isBagOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setIsBagOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-full max-w-lg bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col ${
            isBagOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="p-8 flex items-center justify-between border-b border-zinc-100">
            <h3 className="text-2xl font-black">Your Bag</h3>
            <button
              onClick={() => setIsBagOpen(false)}
              className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8">
            {bag.length === 0 ? (
              <div className="text-center py-20">
                <ShoppingBag size={48} className="mx-auto mb-4 text-zinc-200" />
                <p className="text-zinc-400 font-medium">Your bag is empty</p>
              </div>
            ) : (
              bag.map((item) => (
                <div key={item.product.id} className="flex gap-6">
                  <div className="w-24 h-24 bg-zinc-100 rounded-2xl overflow-hidden flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-bold text-lg">{item.product.name}</h4>
                      <button
                        onClick={() => removeFromBag(item.product.id)}
                        className="text-zinc-400 hover:text-rose-500 transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <p className="text-zinc-400 mb-4">${item.product.price}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-zinc-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="p-1 hover:bg-zinc-50 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="p-1 hover:bg-zinc-50 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Section - This was the part causing the error */}
          {bag.length > 0 && (
            <div className="p-8 bg-white border-t border-zinc-100 shadow-[0_-30px_60px_-20px_rgba(0,0,0,0.1)]">
              <div className="flex flex-col gap-1 mb-6">
                <span className="text-stone-400 font-black uppercase tracking-[0.3em] text-sm">
                  Amount Payable
                </span>
                <span className="text-6xl font-black text-zinc-900">
                  ${totalAmount}
                </span>
              </div>
              
              <button className="w-full bg-rose-500 hover:bg-rose-600 text-white py-8 text-3xl font-black rounded-[40px] shadow-2xl shadow-rose-200 transition-all active:scale-[0.98] flex items-center justify-center gap-4">
                Checkout <ArrowRight size={32} strokeWidth={4} />
              </button>
              
              <p className="mt-6 text-center text-zinc-400 font-black uppercase tracking-[0.4em] text-xs">
                Zero Platform Fees
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
