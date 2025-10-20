"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { Trash2, Plus, Minus } from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice } = useCart();

  // Calculate total items
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            {cart.map((item) => (
              <div
                key={item.id} // Changed from menuItemId to id based on your CartItem type
                className="flex items-center justify-between bg-white shadow rounded-lg p-4 mb-4"
              >
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-500">₹{item.price}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={
                      () => updateQuantity(item.id, item.quantity - 1) // Changed from menuItemId to id
                    }
                    disabled={item.quantity <= 1}
                    className="bg-gray-200 p-2 rounded-full disabled:opacity-50"
                  >
                    <Minus size={16} />
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={
                      () => updateQuantity(item.id, item.quantity + 1) // Changed from menuItemId to id
                    }
                    className="bg-gray-200 p-2 rounded-full"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => removeFromCart(item.id)} // Changed from menuItemId to id
                    className="text-red-500 hover:bg-red-100 p-2 rounded-full"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            {/* Mocked store points - replace with real data */}
            <div className="mb-4">
              <h3 className="font-medium mb-2">Available discounts from mall partners</h3>
              <p className="text-sm text-gray-500 mb-2">Select a discount to apply points from partner stores.</p>

              <DiscountSelector totalPrice={totalPrice} />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Total Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between font-bold">
                <span>Total Price</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <button className="w-full bg-green-500 text-white py-3 rounded-lg mt-6 hover:bg-green-600">
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DiscountSelector({ totalPrice }: { totalPrice: number }) {
  // Mock partners and points. In reality load from user profile / API
  const partners = [
    { id: "mall_a", name: "Mall A Rewards", points: 1200, valuePerPoint: 0.01 },
    { id: "store_b", name: "Store B Points", points: 500, valuePerPoint: 0.02 },
    { id: "shop_c", name: "Shop C Credits", points: 300, valuePerPoint: 0.015 },
  ];

  const [selected, setSelected] = useState<string | null>(null);
  const [appliedAmount, setAppliedAmount] = useState(0);

  useEffect(() => {
    // reset when total changes
    setSelected(null);
    setAppliedAmount(0);
  }, [totalPrice]);

  const applyPartner = (p: typeof partners[number]) => {
    setSelected(p.id);
    // user can apply up to points * valuePerPoint but not more than totalPrice
    const maxValue = p.points * p.valuePerPoint;
    setAppliedAmount(Math.min(maxValue, totalPrice));
  };

  return (
    <div>
      <div className="space-y-2">
        {partners.map((p) => (
          <div key={p.id} className="flex items-center justify-between">
            <div>
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-500">{p.points} points</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => applyPartner(p)}
                className={`px-3 py-1 rounded ${selected === p.id ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700"}`}
              >
                Apply
              </button>
              {selected === p.id && (
                <div className="text-sm text-gray-700">-₹{appliedAmount.toFixed(2)}</div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-3 text-sm text-gray-600">Discount applied from partner: {selected}</div>
      )}
    </div>
  );
}
