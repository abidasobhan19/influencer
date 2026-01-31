import mongoose from 'mongoose';
import { ITransaction, Transaction } from '../models/Transaction';
import { BaseRepository } from './BaseRepository';

export class TransactionRepository extends BaseRepository<ITransaction> {
  constructor() {
    super(Transaction);
  }

  async findByBuyer(buyerId: string | mongoose.Types.ObjectId): Promise<ITransaction[]> {
    return this.find({ buyerId }, { 
      sort: { createdAt: -1 },
      populate: ['sellerId', 'packageId']
    });
  }

  async findBySeller(sellerId: string | mongoose.Types.ObjectId): Promise<ITransaction[]> {
    return this.find({ sellerId }, { 
      sort: { createdAt: -1 },
      populate: ['buyerId', 'packageId']
    });
  }

  async findByPackage(packageId: string | mongoose.Types.ObjectId): Promise<ITransaction[]> {
    return this.find({ packageId }, { 
      sort: { createdAt: -1 },
      populate: ['buyerId', 'sellerId']
    });
  }

  async findByPaymentStatus(
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded'
  ): Promise<ITransaction[]> {
    return this.find({ paymentStatus }, { 
      sort: { createdAt: -1 },
      populate: ['buyerId', 'sellerId', 'packageId']
    });
  }

  async findByDeliveryStatus(
    deliveryStatus: 'ordered' | 'in_progress' | 'delivered' | 'completed'
  ): Promise<ITransaction[]> {
    return this.find({ deliveryStatus }, { 
      sort: { createdAt: -1 },
      populate: ['buyerId', 'sellerId', 'packageId']
    });
  }

  async findByStripePaymentId(stripePaymentId: string): Promise<ITransaction | null> {
    return this.findOne({ stripePaymentId });
  }

  async updatePaymentStatus(
    transactionId: string | mongoose.Types.ObjectId,
    paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded',
    stripePaymentId?: string
  ): Promise<ITransaction | null> {
    const update: any = { paymentStatus };
    if (stripePaymentId) {
      update.stripePaymentId = stripePaymentId;
    }
    return this.updateById(transactionId, update);
  }

  async updateDeliveryStatus(
    transactionId: string | mongoose.Types.ObjectId,
    deliveryStatus: 'ordered' | 'in_progress' | 'delivered' | 'completed'
  ): Promise<ITransaction | null> {
    return this.updateById(transactionId, { deliveryStatus });
  }

  async getSellerEarnings(
    sellerId: string | mongoose.Types.ObjectId,
    startDate?: Date,
    endDate?: Date
  ): Promise<{ totalEarnings: number; transactionCount: number }> {
    const matchFilter: any = { 
      sellerId,
      paymentStatus: 'completed'
    };

    if (startDate || endDate) {
      matchFilter.createdAt = {};
      if (startDate) matchFilter.createdAt.$gte = startDate;
      if (endDate) matchFilter.createdAt.$lte = endDate;
    }

    const result = await this.model.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalEarnings: { 
            $sum: { $subtract: ['$amount', '$platformFee'] }
          },
          transactionCount: { $sum: 1 }
        }
      }
    ]);

    return result[0] || { totalEarnings: 0, transactionCount: 0 };
  }

  async getPlatformRevenue(startDate?: Date, endDate?: Date): Promise<{ totalRevenue: number; transactionCount: number }> {
    const matchFilter: any = { 
      paymentStatus: 'completed'
    };

    if (startDate || endDate) {
      matchFilter.createdAt = {};
      if (startDate) matchFilter.createdAt.$gte = startDate;
      if (endDate) matchFilter.createdAt.$lte = endDate;
    }

    const result = await this.model.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$platformFee' },
          transactionCount: { $sum: 1 }
        }
      }
    ]);

    return result[0] || { totalRevenue: 0, transactionCount: 0 };
  }

  async getTransactionsByDateRange(
    startDate: Date,
    endDate: Date,
    limit: number = 100
  ): Promise<ITransaction[]> {
    return this.find({
      createdAt: { $gte: startDate, $lte: endDate }
    }, {
      sort: { createdAt: -1 },
      limit,
      populate: ['buyerId', 'sellerId', 'packageId']
    });
  }
}