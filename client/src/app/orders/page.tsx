"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, ShoppingBag, ChevronRight, Package } from "lucide-react";

type OrderItem = {
    id: string;
    name: string;
    price: number;
    quantity: number;
    restaurant?: { name?: string } | null;
};

type Order = {
    id: string;
    status: string;
    totalAmount: number;
    createdAt: string;
    orderItems: OrderItem[];
};

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
    PENDING: { color: "text-yellow-700", bg: "bg-yellow-100", label: "Pending" },
    CONFIRMED: { color: "text-blue-700", bg: "bg-blue-100", label: "Confirmed" },
    PREPARING: { color: "text-orange-700", bg: "bg-orange-100", label: "Preparing" },
    READY: { color: "text-green-700", bg: "bg-green-100", label: "Ready" },
    DELIVERED: { color: "text-gray-700", bg: "bg-gray-100", label: "Delivered" },
    CANCELLED: { color: "text-red-700", bg: "bg-red-100", label: "Cancelled" },
};

export default function OrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let mounted = true;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('/api/orders', { cache: 'no-store' });
                if (!res.ok) throw new Error('Failed to fetch orders');
                const data = await res.json();
                if (mounted) setOrders(data || []);
            } catch (err: unknown) {
                console.error(err);
                const message = err instanceof Error ? err.message : String(err);
                if (mounted) setError(message);
            } finally {
                if (mounted) setLoading(false);
            }
        }

        load();

        return () => { mounted = false };
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container mx-auto px-4 py-6 sm:py-8 max-w-5xl">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
                    <p className="text-gray-600">Track and manage your food court orders</p>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
                                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <p className="text-red-600 font-medium">{error}</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-8 sm:p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                            <ShoppingBag className="w-10 h-10 text-gray-400" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">No orders yet</h2>
                        <p className="text-gray-600 mb-6">Start browsing food stalls and place your first order!</p>
                        <Link
                            href="/seats"
                            className="inline-flex items-center gap-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-medium transition-colors"
                        >
                            Browse Food Stalls
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4 sm:space-y-6">
                        {orders.map((order) => {
                            const status = statusConfig[order.status] || statusConfig.PENDING;
                            const itemCount = order.orderItems.reduce((sum, item) => sum + item.quantity, 0);

                            return (
                                <div
                                    key={order.id}
                                    className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                                >
                                    {/* Order Header */}
                                    <div className="bg-gradient-to-r from-green-50 to-blue-50 px-4 sm:px-6 py-4 border-b border-gray-100">
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Package className="w-4 h-4 text-gray-500" />
                                                    <span className="text-xs sm:text-sm font-mono text-gray-600">
                                                        {order.id.slice(0, 12)}...
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                                                    <Clock className="w-3 h-3" />
                                                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between sm:justify-end gap-4">
                                                <span className={`${status.bg} ${status.color} px-3 py-1 rounded-full text-xs sm:text-sm font-semibold`}>
                                                    {status.label}
                                                </span>
                                                <div className="text-right">
                                                    <div className="text-lg sm:text-xl font-bold text-gray-900">
                                                        ₹{order.totalAmount.toFixed(2)}
                                                    </div>
                                                    <div className="text-xs text-gray-500">{itemCount} item{itemCount !== 1 ? 's' : ''}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="px-4 sm:px-6 py-4">
                                        <div className="space-y-3">
                                            {order.orderItems.map((item, idx) => (
                                                <div
                                                    key={item.id}
                                                    className={`flex items-center justify-between gap-4 py-3 ${idx !== order.orderItems.length - 1 ? 'border-b border-gray-100' : ''
                                                        }`}
                                                >
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-semibold text-gray-900 truncate">{item.name}</div>
                                                        <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                                                            {item.restaurant?.name && (
                                                                <>
                                                                    <span className="truncate">{item.restaurant.name}</span>
                                                                    <span className="text-gray-300">•</span>
                                                                </>
                                                            )}
                                                            <span className="font-medium text-gray-600">Qty: {item.quantity}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-right flex-shrink-0">
                                                        <div className="font-bold text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</div>
                                                        <div className="text-xs text-gray-500">₹{item.price.toFixed(2)} each</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
