// import { getServerSession } from "next-auth/next";
// import { authOptions } from "../auth/[...nextauth]/options";
// import dbConnect from "@/lib/dbConnect";
// import { ShareCalc } from "@/model/ShareCalc";
// import { ShareCalcZodSchema } from "@/schemas/shareCalcSchema";

// export async function GET() {
//   await dbConnect();
//   const session = await getServerSession(authOptions);
//   if (!session?.user)
//     return Response.json({ message: "Unauthorized" }, { status: 401 });

//   try {
//     const data = await ShareCalc.find({ userId: session.user._id }).sort({
//       createdAt: -1,
//     });
//     return Response.json(data, { status: 200 });
//   } catch (error) {
//     return Response.json({ message: "Server Error" }, { status: 500 });
//   }
// }

// export async function POST(request: Request) {
//   await dbConnect();
//   const session = await getServerSession(authOptions);
//   if (!session?.user)
//     return Response.json({ message: "Unauthorized" }, { status: 401 });

//   try {
//     const body = await request.json();
//     const result = ShareCalcZodSchema.safeParse(body);
//     if (!result.success)
//       return Response.json({ errors: result.error.flatten() }, { status: 400 });

//     const newCalculation = new ShareCalc({
//       ...result.data,
//       userId: session.user._id,
//     });
//     await newCalculation.save();
//     return Response.json(
//       { success: true, data: newCalculation },
//       { status: 201 },
//     );
//   } catch (error) {
//     return Response.json(
//       { message: "Failed to process calculation" },
//       { status: 500 },
//     );
//   }
// }

import dbConnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { UserPortfolio } from "@/model/ShareCalc";

export async function POST(request: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();

    const totalCost = body.quantity * body.buyPrice;
    const totalValue = body.quantity * body.sellPrice;
    const profit = totalValue - totalCost;

    const newItem = { ...body, totalCost, totalValue, profit };

    const portfolio = await UserPortfolio.findOneAndUpdate(
      { userId: session.user._id },
      { $push: { calculations: newItem } },
      { new: true, upsert: true },
    );

    return Response.json({ success: true, data: portfolio }, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: "Failed to save calculation" },
      { status: 500 },
    );
  }
}
