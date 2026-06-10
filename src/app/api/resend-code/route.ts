import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    // Find the user by their username
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    if (user.isVerified) {
      return Response.json(
        { success: false, message: "Account is already verified" },
        { status: 400 },
      );
    }

    // 1. Generate a fresh 6-digit verification code
    const newVerifyCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();

    // 2. Set new expiry time (Current time + 1 Hour)
    const newExpiryDate = new Date();
    newExpiryDate.setHours(newExpiryDate.getHours() + 1);

    // 3. Update user model fields
    user.verifyCode = newVerifyCode;
    user.verifyCodeExpiry = newExpiryDate;
    await user.save();

    // 4. Fire the actual email trigger using your helper
    const emailResponse = await sendVerificationEmail(
      user.email,
      user.username,
      newVerifyCode,
    );

    console.log("[resend-code] sendVerificationEmail response", emailResponse);

    if (!emailResponse.success) {
      return Response.json(
        {
          success: false,
          message:
            emailResponse.message || "Failed to deliver code to your email",
        },
        { status: 500 },
      );
    }

    return Response.json(
      {
        success: true,
        message:
          "A fresh 6-digit verification code has been delivered to your inbox.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error inside resend-code handler:", error);
    return Response.json(
      {
        success: false,
        message:
          "An internal error occurred while regenerating your verification code.",
      },
      { status: 500 },
    );
  }
}
