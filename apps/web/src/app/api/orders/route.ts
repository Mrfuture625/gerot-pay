import { NextResponse } from "next/server";
import { createOrder } from "@/server/orders/createOrder";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = await createOrder({
      cardProductId: body.cardProductId,
      cardholderName: body.cardholderName,
      customerEmail: body.customerEmail,
      walletAddress: body.walletAddress,
      priceEth: body.priceEth,
      txHash: body.txHash,
      cardType: body.cardType,
      shippingAddress: body.shippingAddress,
    });

    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      orderId: result.orderId,
    });
  } catch {
    return NextResponse.json(
      { error: "Could not create order." },
      { status: 500 }
    );
  }
}