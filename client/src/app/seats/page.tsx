"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SeatsPage() {
  const router = useRouter();
  const [selectedSeat, setSelectedSeat] = useState<number | null>(null);

  // Mock available seats (1-100). In reality, fetch from DB/API with availability status
  const totalSeats = 100;
  const seats = Array.from({ length: totalSeats }, (_, i) => i + 1);

  const handleSeatClick = (seatNumber: number) => {
    setSelectedSeat(seatNumber);
  };

  const handleConfirm = () => {
    if (selectedSeat) {
      // Navigate to home with seat in query params
      router.push(`/?seat=${selectedSeat}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Select Your Seat
        </h1>

        <p className="text-gray-600 mb-6">
          Choose an available seat number. Your order will be delivered to this seat.
        </p>

        {/* Seat Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-10 md:grid-cols-15 lg:grid-cols-20 gap-2 mb-6">
          {seats.map((seat) => {
            const isSelected = selectedSeat === seat;
            // Mock occupied seats (for demo purposes, seats divisible by 7 are occupied)
            const isOccupied = seat % 7 === 0;

            return (
              <button
                key={seat}
                onClick={() => !isOccupied && handleSeatClick(seat)}
                disabled={isOccupied}
                className={`
                  p-3 rounded-lg font-medium text-sm transition-all
                  ${isOccupied 
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                    : isSelected 
                      ? "bg-green-600 text-white shadow-lg" 
                      : "bg-white text-gray-800 hover:bg-green-100 border border-gray-200"
                  }
                `}
              >
                {seat}
              </button>
            );
          })}
        </div>

        {/* Confirm Button */}
        {selectedSeat && (
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg mb-4">
              You selected seat <span className="font-bold text-green-600">{selectedSeat}</span>
            </p>
            <button
              onClick={handleConfirm}
              className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 font-medium"
            >
              Confirm and Browse Restaurants
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
