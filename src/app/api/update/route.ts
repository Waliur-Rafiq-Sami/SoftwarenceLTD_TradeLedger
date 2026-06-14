import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { getServerSession } from "next-auth"; // Assuming you use NextAuth
import { authOptions } from "../auth/[...nextauth]/options"; // Path to your auth config

export async function PATCH(request: Request) {
  await dbConnect();

  // 1. Authenticate the request
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return Response.json({ success: false, message: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { username, dateOfBirth, phoneNumber, address, profession } = await request.json();

    // 2. Find the existing user by ID (from session)
    const user = await UserModel.findById(session.user._id);

    if (!user) {
      return Response.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // 3. Prevent Username Collisions
    // Only check if the user is actually trying to change their username
    if (username && username !== user.username) {
      const existingUser = await UserModel.findOne({
        username,
        _id: { $ne: user._id }, // Ensure it's not the current user
      });

      if (existingUser) {
        return Response.json({ success: false, message: "Username is already taken by another user" }, { status: 400 });
      }
      user.username = username;
    }

    // 4. Update fields (Only allow safe, non-sensitive fields)
    // We intentionally exclude 'email' and 'isVerified' to prevent tampering
    if (dateOfBirth) user.dateOfBirth = new Date(dateOfBirth);
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (address) user.address = address;
    if (profession) user.profession = profession;

    await user.save();

    return Response.json(
      {
        success: true,
        message: "Profile updated successfully",
        data: {
          username: user.username,
          phoneNumber: user.phoneNumber,
          address: user.address,
          profession: user.profession,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating user profile:", error);
    return Response.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
