// import mongoose, { Schema, Document } from "mongoose";

// export interface Message extends Document {
//   content: string;
//   createdAt: Date;
// }

// export interface User extends Document {
//   username: string;
//   email: string;
//   password: string;
//   dateOfBirth: Date;
//   phoneNumber: string;
//   address: string;
//   profession?: string;
//   verifyCode: string;
//   verifyCodeExpiry: Date;
//   isVerified: boolean;
// }

// // Updated User schema
// const UserSchema: Schema<User> = new mongoose.Schema({
//   username: {
//     type: String,
//     required: [true, "Username is required"],
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: [true, "Email is required"],
//     unique: true,
//     match: [/.+\@.+\..+/, "Please use a valid email address"],
//   },
//   password: {
//     type: String,
//     required: [true, "Password is required"],
//   },
//   dateOfBirth: {
//     type: Date,
//     required: [true, "Date of birth is required"],
//   },
//   phoneNumber: {
//     type: String,
//     required: [true, "Phone number is required"],
//   },
//   address: {
//     type: String,
//     required: [true, "Address is required"],
//   },
//   profession: {
//     type: String,
//     required: false,
//     trim: true,
//   },
//   verifyCode: {
//     type: String,
//     required: [true, "Verify Code is required"],
//   },
//   verifyCodeExpiry: {
//     type: Date,
//     required: [true, "Verify Code Expiry is required"],
//   },
//   isVerified: {
//     type: Boolean,
//     default: false,
//   },
// });

// const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

// export default UserModel;

import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  dateOfBirth: Date;
  phoneNumber: string;
  address: string;
  profession?: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
}

const UserSchema: Schema<User> = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Date of birth is required"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
  },
  address: {
    type: String,
    required: [true, "Address is required"],
  },
  profession: {
    type: String,
    required: false,
    trim: true,
  },
  verifyCode: {
    type: String,
    required: [true, "Verify Code is required"],
  },
  verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is required"],
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

// Production Architecture Fix: Define the partial index explicitly.
// This tells MongoDB: Enforce absolute uniqueness ONLY when isVerified is true.
UserSchema.index(
  { username: 1 },
  {
    unique: true,
    partialFilterExpression: { isVerified: true },
  },
);

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

// Programmatic Production Guard: Drops the old legacy index automatically
// if it still exists in your MongoDB instance collections.
if (mongoose.connection.states[mongoose.connection.readyState] === "connected" || mongoose.connection.readyState === 1) {
  UserModel.collection
    .dropIndex("username_1")
    .then(() => console.log("[Database] Stale username unique index dropped successfully."))
    .catch(() => {
      // Slences error if index was already removed or doesn't exist anymore
    });
} else {
  mongoose.connection.once("open", () => {
    UserModel.collection.dropIndex("username_1").catch(() => {});
  });
}

export default UserModel;
