import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { TradeRecord } from "@/model/TradeRecord";
import { z } from "zod";

// Validate that we receive an array of IDs
const bulkDeleteSchema = z.object({
  ids: z.array(z.string()).min(1, "No trade IDs provided"),
});

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    return NextResponse.json(
      { success: false, message: "Unauthorized access" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { ids } = bulkDeleteSchema.parse(body);

    // Strict validation: Only delete records that belong to the logged-in user
    // The $in operator checks if the record _id is in the provided array
    const result = await TradeRecord.deleteMany({
      _id: { $in: ids },
      userId: session.user._id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "No records found to delete or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: `Successfully deleted ${result.deletedCount} record(s).` 
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid input", errors: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "Failed to process bulk deletion" },
      { status: 500 }
    );
  }
}