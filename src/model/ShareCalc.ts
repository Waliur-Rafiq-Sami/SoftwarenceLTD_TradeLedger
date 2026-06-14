import { Schema, model, models, Document, Types } from 'mongoose';

// 1. Define the child calculation item
interface ICalculationItem {
  instrument: string;
  quantity: number;
  buyPrice: number;
  sellPrice: number;
  totalCost: number;
  totalValue: number;
  profit: number;
}

// 2. Define the parent portfolio container document
export interface IUserPortfolio extends Document {
  userId: Types.ObjectId;
  calculations: ICalculationItem[];
}

const CalculationItemSchema = new Schema<ICalculationItem>({
  instrument: { type: String, required: true, uppercase: true, trim: true },
  quantity: { type: Number, required: true },
  buyPrice: { type: Number, required: true },
  sellPrice: { type: Number, required: true },
  totalCost: { type: Number, required: true },
  totalValue: { type: Number, required: true },
  profit: { type: Number, required: true }
});

const UserPortfolioSchema = new Schema<IUserPortfolio>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  calculations: [CalculationItemSchema] // Array of nested calculation items
}, { timestamps: true });

export const UserPortfolio = models.UserPortfolio || model<IUserPortfolio>('UserPortfolio', UserPortfolioSchema);