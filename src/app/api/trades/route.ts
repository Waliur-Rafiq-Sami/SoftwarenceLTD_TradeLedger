import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { TradeRecord } from "@/model/TradeRecord";
import { z } from "zod";

import { tradeInputSchema } from "@/schemas/tradeSchema";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    const parsedBody = tradeInputSchema.parse(body);

    const newTrade = await TradeRecord.create({
      userId: session.user._id,
      instrument: parsedBody.instrument,
      tradeType: parsedBody.tradeType,
      quantity: parsedBody.quantity,
      rate: parsedBody.rate,
      commission: parsedBody.commission,
      transactionDate: parsedBody.transactionDate ? new Date(parsedBody.transactionDate) : new Date(),
    });

    return NextResponse.json({ success: true, data: newTrade }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payload fields",
          errors: error.errors,
        },
        { status: 400 },
      );
    }
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// export async function GET(request: Request) {
//   await dbConnect();
//   const session = await getServerSession(authOptions);

//   if (!session?.user?._id) {
//     return NextResponse.json(
//       { success: false, message: "Unauthorized access detected." },
//       { status: 401 },
//     );
//   }

//   try {
//     const { searchParams } = new URL(request.url);
//     const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
//     const limit = Math.max(
//       1,
//       Math.min(100, parseInt(searchParams.get("limit") || "10", 10)),
//     );

//     const instrumentSearch = searchParams.get("instrument");
//     const actionSearch = searchParams.get("action");

//     // Range Boundaries
//     const startDate = searchParams.get("startDate");
//     const endDate = searchParams.get("endDate");
//     const minAmount = searchParams.get("minAmount");
//     const maxAmount = searchParams.get("maxAmount");

//     const query: Record<string, any> = { userId: session.user._id };

//     // 1. Text Search (Instrument Ticker)
//     if (instrumentSearch) {
//       const sanitizedSearch = instrumentSearch.replace(
//         /[.*+?^${}()|[\]\\]/g,
//         "\\$&",
//       );
//       query.instrument = { $regex: sanitizedSearch, $options: "i" };
//     }

//     // 2. Action Type Lookup
//     if (actionSearch && actionSearch !== "ALL") {
//       query.tradeType = actionSearch.toUpperCase();
//     }

//     // 3. Temporal Range Construction ($gte / $lte)
//     if (startDate || endDate) {
//       query.transactionDate = {};

//       if (startDate && !isNaN(Date.parse(startDate))) {
//         const start = new Date(startDate);
//         start.setUTCHours(0, 0, 0, 0); // Include start of day
//         query.transactionDate.$gte = start;
//       }

//       if (endDate && !isNaN(Date.parse(endDate))) {
//         const end = new Date(endDate);
//         end.setUTCHours(23, 59, 59, 999); // Include end of day
//         query.transactionDate.$lte = end;
//       }
//     }

//     // 4. Gross Amount Range Construction ($gte / $lte)
//     if (minAmount || maxAmount) {
//       query.amount = {};

//       if (minAmount && !isNaN(parseFloat(minAmount))) {
//         query.amount.$gte = parseFloat(minAmount);
//       }

//       if (maxAmount && !isNaN(parseFloat(maxAmount))) {
//         query.amount.$lte = parseFloat(maxAmount);
//       }
//     }

//     const skipAmount = (page - 1) * limit;

//     const [trades, totalRecords] = await Promise.all([
//       TradeRecord.find(query)
//         .sort({ transactionDate: -1 })
//         .skip(skipAmount)
//         .limit(limit)
//         .lean(),
//       TradeRecord.countDocuments(query),
//     ]);

//     return NextResponse.json(
//       {
//         success: true,
//         data: trades,
//         pagination: {
//           totalRecords,
//           currentPage: page,
//           totalPages: Math.ceil(totalRecords / limit),
//           hasNextPage: page * limit < totalRecords,
//         },
//       },
//       { status: 200 },
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to compile requested metrics matrix.",
//       },
//       { status: 500 },
//     );
//   }
// }

export async function GET(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session?.user?._id) {
    return NextResponse.json({ success: false, message: "Unauthorized access detected." }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);

    // 1. Pagination Setup
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get("limit") || "10", 10)));
    const skipAmount = (page - 1) * limit;

    // 2. Query Construction
    const query: Record<string, any> = { userId: session.user._id };

    // Text Search
    const instrument = searchParams.get("instrument");
    if (instrument) {
      query.instrument = { $regex: instrument, $options: "i" };
    }

    // Action Search
    const action = searchParams.get("action");
    if (action && action !== "ALL") {
      query.tradeType = action.toUpperCase();
    }

    // Date Range (Expects format YYYY-MM-DD for standard Date parsing)
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    if (startDate || endDate) {
      query.transactionDate = {};

      if (startDate) query.transactionDate.$gte = new Date(startDate);
      if (endDate) query.transactionDate.$lte = new Date(endDate);
    }

    // Amount Range
    const minAmount = searchParams.get("minAmount");
    const maxAmount = searchParams.get("maxAmount");
    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = parseFloat(minAmount);
      if (maxAmount) query.amount.$lte = parseFloat(maxAmount);
    }

    // 3. Dynamic Sorting
    const sortBy = searchParams.get("sortBy"); // 'rate' or 'commission'
    const sortOrder = searchParams.get("sortOrder") === "asc" ? 1 : -1;

    // Security: Whitelist allowed fields to prevent NoSQL Injection
    const allowedSortFields = ["rate", "commission", "transactionDate", "amount"];
    const sortConfig: Record<string, number> = {};

    if (sortBy && allowedSortFields.includes(sortBy)) {
      sortConfig[sortBy] = sortOrder;
    } else {
      // Default fallback
      sortConfig.transactionDate = -1;
    }

    // 4. Execution
    const [trades, totalRecords] = await Promise.all([
      TradeRecord.find(query).sort(sortConfig).skip(skipAmount).limit(limit).lean(),
      TradeRecord.countDocuments(query),
    ]);

    return NextResponse.json(
      {
        success: true,
        data: trades,
        pagination: {
          totalRecords,
          currentPage: page,
          totalPages: Math.ceil(totalRecords / limit),
        },
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
