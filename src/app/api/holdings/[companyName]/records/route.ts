import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import mongoose from "mongoose";
import dbConnect from "@/lib/dbConnect";
import { ShareRecord } from "@/model/ShareRecord";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

interface RouteParams {
  params: {
    companyName: string;
  };
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    // 1. Establish Database Connection
    await dbConnect();

    // 2. Authentication Guard
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized access. Invalid session context.",
        },
        { status: 401 },
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(session.user._id);
    const { searchParams } = new URL(req.url);

    // 3. Extract, Sanitize, and Validate Parameters
    const companyName = decodeURIComponent(params.companyName)
      .toUpperCase()
      .trim();

    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(
      1,
      Math.min(100, parseInt(searchParams.get("limit") || "10", 10)),
    );
    const skip = (page - 1) * limit;

    const actionType = searchParams.get("actionType")?.toUpperCase() || "ALL";
    const status = searchParams.get("status")?.toUpperCase() || "ALL";
    const sortBy = searchParams.get("sortBy") || "transactionDate";
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    // 4. Construct Secure Dynamic Query Object
    const query: any = {
      userId: userObjectId,
      companyName: companyName,
    };

    // Optional Filter Logic
    if (
      actionType !== "ALL" &&
      ["BUY", "SELL", "DEPOSIT", "WITHDRAW"].includes(actionType)
    ) {
      query.actionType = actionType;
    }

    if (
      status !== "ALL" &&
      ["COMPLETED", "PENDING", "CANCELLED"].includes(status)
    ) {
      query.status = status;
    }

    // Validate Sort Fields to prevent NoSQL injection
    const allowedSortFields = [
      "transactionDate",
      "grossAmount",
      "rate",
      "quantity",
      "createdAt",
    ];
    const actualSortBy = allowedSortFields.includes(sortBy)
      ? sortBy
      : "transactionDate";

    // 5. Concurrent Core Database Engine
    const [records, totalCount] = await Promise.all([
      // A. Fetch paginated specific company records
      ShareRecord.find(query)
        .sort({ [actualSortBy]: sortOrder })
        .skip(skip)
        .limit(limit)
        .lean() // Strips heavy Mongoose tracking for max performance
        .exec(),

      // B. Fetch total count for accurate pagination metadata
      ShareRecord.countDocuments(query).exec(),
    ]);

    // 6. Data Normalization
    const totalPages = Math.ceil(totalCount / limit);

    // 7. Unified Enterprise Payload Delivery
    return NextResponse.json(
      {
        success: true,
        data: records,
        meta: {
          pagination: {
            total: totalCount,
            page,
            limit,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1,
          },
          filters: {
            companyName,
            actionType,
            status,
            sortBy: actualSortBy,
            sortOrder: sortOrder === 1 ? "asc" : "desc",
          },
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error(
      `[API_SHARE_RECORDS_GET_CRITICAL_ERROR] ${params.companyName}:`,
      error,
    );
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error occurred while pulling share records.",
      },
      { status: 500 },
    );
  }
}
