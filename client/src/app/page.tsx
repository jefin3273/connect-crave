"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { FoodStallCard } from "@/components/food-stall-card";

type Restaurant = {
  id: string;
  name: string;
  description: string;
  image?: string | null;
  rating: number;
  tags?: string[];
  cuisine: string;
  address: string;
};

async function fetchRestaurantsClient() {
  try {
    const res = await fetch(`/api/restaurants`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch restaurants");
    return res.json();
  } catch (err) {
    console.error(err);
    return [];
  }
}

function HomeContent() {
  const searchParams = useSearchParams();
  const seat = searchParams.get("seat");
  
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Do not load restaurants until seat is selected
    if (!seat) return;

    let mounted = true;
    setLoading(true);
    setError(null);

    fetchRestaurantsClient()
      .then((data) => {
        if (!mounted) return;
        setRestaurants(data || []);
      })
      .catch((e) => {
        console.error(e);
        if (mounted) setError(String(e?.message || e));
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [seat]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Welcome to the Mall Food Court
        </h2>

        {/* Seat info banner */}
        {seat && (
          <div className="mb-6 bg-green-50 border border-green-200 p-4 rounded-lg flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">Your seat:</p>
              <p className="text-lg font-bold text-green-700">Seat {seat}</p>
            </div>
            <Link 
              href="/seats"
              className="text-sm text-green-600 hover:text-green-800 underline"
            >
              Change seat
            </Link>
          </div>
        )}

        {/* Restaurants list (shown only after seat selected) */}
        {!seat ? (
          <div className="text-center bg-white p-8 rounded-lg shadow">
            <p className="text-gray-600 mb-4">Please select a seat to browse restaurants.</p>
            <Link 
              href="/seats"
              className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-medium"
            >
              Select Your Seat
            </Link>
          </div>
        ) : (
          <section>
            <h3 className="text-xl font-semibold mb-4">Popular Food Stalls</h3>

            {loading ? (
              <p className="text-center text-gray-500">Loading restaurants...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : restaurants.length === 0 ? (
              <p className="text-center text-gray-500">No restaurants found</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {restaurants.map((restaurant: any) => (
                  <FoodStallCard
                    key={restaurant.id}
                    stall={{
                      id: restaurant.id,
                      name: restaurant.name,
                      cuisine: restaurant.tags?.join(", ") || restaurant.cuisine,
                      image: restaurant.image || "/kfc.jpg",
                      rating: restaurant.rating,
                      reviewCount: 0,
                      isOpen: true,
                      description: restaurant.description,
                      address: restaurant.address,
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Welcome to the Mall Food Court
          </h2>
          <div className="text-center bg-white p-8 rounded-lg shadow">
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
      </div>
    }>
      <HomeContent />
    </Suspense>
  );
}