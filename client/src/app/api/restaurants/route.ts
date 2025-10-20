import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        image: true,
        rating: true,
        tags: true,
        cuisine: true,
        address: true,
      },
      orderBy: {
        rating: "desc",
      },
    })

    return NextResponse.json(restaurants, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error("Error fetching restaurants:", error)
    return NextResponse.json({ error: "Failed to fetch restaurants" }, { status: 500 })
  }
}

