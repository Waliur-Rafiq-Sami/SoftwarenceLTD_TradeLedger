import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import { ShareCalc } from "@/model/ShareCalc";
import { ShareCalcZodSchema } from "@/schemas/shareCalcSchema";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const result = ShareCalcZodSchema.safeParse(body);
    if (!result.success)
      return Response.json({ errors: result.error.flatten() }, { status: 400 });

    const calculation = await ShareCalc.findOne({
      _id: params.id,
      userId: session.user._id,
    });
    if (!calculation)
      return Response.json({ message: "Not found" }, { status: 404 });

    // Update with fresh inputs
    calculation.instrument = result.data.instrument;
    calculation.quantity = result.data.quantity;
    calculation.buyPrice = result.data.buyPrice;
    calculation.sellPrice = result.data.sellPrice;

    await calculation.save(); // Triggers calculation pre-save logic
    return Response.json({ success: true, data: calculation });
  } catch (error) {
    return Response.json({ message: "Update failed" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } },
) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  try {
    const deletedItem = await ShareCalc.findOneAndDelete({
      _id: params.id,
      userId: session.user._id,
    });
    if (!deletedItem)
      return Response.json({ message: "Data not found" }, { status: 404 });
    return Response.json({ success: true, message: "Deleted cleanly" });
  } catch (error) {
    return Response.json({ message: "Deletion failed" }, { status: 500 });
  }
}
