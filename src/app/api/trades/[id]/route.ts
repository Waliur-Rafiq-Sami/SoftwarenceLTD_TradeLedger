import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { TradeRecord } from "@/model/TradeRecord";
import { tradeInputSchema } from "@/schemas/tradeSchema";
import { z } from "zod";

// Pure module for financial calculations
// BUY: Money leaves account (Negative Net)
// SELL: Money enters account (Positive Net)
const calculateFinancials = (tradeType: string, quantity: number, rate: number, commission: number) => {
  const amount = quantity * rate;
  const netAmount = tradeType === "BUY" ? -(amount + commission) : amount - commission;

  return { amount, netAmount };
};

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const parsedBody = tradeInputSchema.parse(body);

    // Calculate exact financial impact server-side
    const { amount, netAmount } = calculateFinancials(parsedBody.tradeType, parsedBody.quantity, parsedBody.rate, parsedBody.commission);

    const updatedTrade = await TradeRecord.findOneAndUpdate(
      { _id: params.id, userId: session.user._id }, //! Ensure user owns the record
      {
        $set: {
          instrument: parsedBody.instrument,
          tradeType: parsedBody.tradeType,
          quantity: parsedBody.quantity,
          rate: parsedBody.rate,
          commission: parsedBody.commission,
          transactionDate: parsedBody.transactionDate ? new Date(parsedBody.transactionDate) : new Date(),
          amount,
          netAmount,
        },
      },
      { new: true, runValidators: true },
    );

    if (!updatedTrade) {
      return NextResponse.json({ success: false, message: "Trade not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedTrade }, { status: 200 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, message: "Invalid payload fields", errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const deletedTrade = await TradeRecord.findOneAndDelete({
      _id: params.id,
      userId: session.user._id, //! Strict ownership validation
    });

    if (!deletedTrade) {
      return NextResponse.json({ success: false, message: "Trade not found or unauthorized" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Record permanently deleted" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: "Failed to execute deletion protocol" }, { status: 500 });
  }
}
