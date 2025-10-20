/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const { items } = await request.json()

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Invalid order items" }, { status: 400 })
    }

    // Group items by restaurant
    const itemsByRestaurant = items.reduce((acc, item) => {
      if (!acc[item.restaurantId]) {
        acc[item.restaurantId] = []
      }
      acc[item.restaurantId].push(item)
      return acc
    }, {})

    // Create the order
    const order = await prisma.order.create({
      data: {
        status: "PENDING",
        totalAmount: items.reduce((total, item) => total + item.price * item.quantity, 0),
        orderItems: {
          create: items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            restaurantId: item.restaurantId,
          })),
        },
      },
      include: {
        orderItems: true,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      select: {
        id: true,
        status: true,
        totalAmount: true,
        createdAt: true,
        orderItems: {
          select: {
            id: true,
            name: true,
            price: true,
            quantity: true,
            restaurant: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50, // Limit to last 50 orders for performance
    });

    return NextResponse.json(orders, {
      headers: {
        'Cache-Control': 'private, no-cache, must-revalidate',
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

