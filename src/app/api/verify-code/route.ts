// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";

// export async function POST(request: Request) {
//   // Connect to the database
//   await dbConnect();

//   try {
//     const { username, code } = await request.json();
//     const decodedUsername = decodeURIComponent(username);
//     const user = await UserModel.findOne({ username: decodedUsername });

//     if (!user) {
//       return Response.json({ success: false, message: "User not found" }, { status: 404 });
//     }

//     // Check if the code is correct and not expired
//     const isCodeValid = user.verifyCode === code;
//     const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

//     if (isCodeValid && isCodeNotExpired) {
//       // Update the user's verification status
//       user.isVerified = true;
//       await user.save();

//       return Response.json({ success: true, message: "Account verified successfully" }, { status: 200 });
//     } else if (!isCodeNotExpired) {
//       // Code has expired
//       return Response.json(
//         {
//           success: false,
//           message: "Verification code has expired. Please sign up again to get a new code.",
//         },
//         { status: 400 },
//       );
//     } else {
//       // Code is incorrect
//       return Response.json({ success: false, message: "Incorrect verification code" }, { status: 400 });
//     }
//   } catch (error) {
//     console.error("Error verifying user:", error);
//     return Response.json({ success: false, message: "Error verifying user" }, { status: 500 });
//   }
// }

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  // 1. Force drop the old strict index to prevent E11000 errors
  try {
    await UserModel.collection.dropIndex("username_1");
  } catch (error) {
    // Silently ignore if index doesn't exist
  }

  try {
    const { username, email, code } = await request.json();
    const decodedUsername = decodeURIComponent(username);

    console.log(username, email, code);
    // Find the unverified user
    const user = await UserModel.findOne({
      username: decodedUsername,
      email: email,
    });
    console.log(user);

    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // --- 🚨 DEBUG BLOCK: Check your VS Code Terminal 🚨 ---
    console.log("\n=== 🔍 VERIFICATION DEBUG ===");
    console.log("Target User    :", decodedUsername);
    console.log("Code from UI   :", code);
    console.log("Code in DB     :", user.verifyCode);
    console.log("Current Time   :", new Date().toISOString());
    console.log("DB Expiry Time :", new Date(user.verifyCodeExpiry).toISOString());
    console.log("Match Status   :", user.verifyCode === code ? "✅ MATCH" : "❌ FAILED");
    console.log("Time Status    :", new Date(user.verifyCodeExpiry) > new Date() ? "✅ VALID" : "❌ EXPIRED");
    console.log("=============================\n");
    // --------------------------------------------------------

    // 2. Validate the verification code and expiration
    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      // 3. Update the user's verification status
      user.isVerified = true;
      await user.save();

      return Response.json({ success: true, message: "Account verified successfully" }, { status: 200 });
    } else if (!isCodeNotExpired) {
      return Response.json({ success: false, message: "Verification code has expired. Please sign up again." }, { status: 400 });
    } else {
      return Response.json({ success: false, message: "Incorrect verification code" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    return Response.json({ success: false, message: "Error verifying user" }, { status: 500 });
  }
}
