import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const restaurants = await prisma.restaurant.findMany({
      orderBy: {
        rating: "desc",
      },
    })

    return NextResponse.json(restaurants)
  } catch (error) {
    console.error("Error fetching restaurants:", error)
    return NextResponse.json({ error: "Failed to fetch restaurants" }, { status: 500 })
  }
}

