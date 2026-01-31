import mongoose from 'mongoose';
import { IPackage, Package } from '../models/Package';
import { BaseRepository } from './BaseRepository';

export class PackageRepository extends BaseRepository<IPackage> {
  constructor() {
    super(Package);
  }

  async findByInfluencer(influencerId: string | mongoose.Types.ObjectId): Promise<IPackage[]> {
    return this.find({ influencerId }, { sort: { createdAt: -1 } });
  }

  async findActiveByInfluencer(influencerId: string | mongoose.Types.ObjectId): Promise<IPackage[]> {
    return this.find({ 
      influencerId, 
      isActive: true 
    }, { sort: { createdAt: -1 } });
  }

  async findActivePackages(limit: number = 20, skip: number = 0): Promise<IPackage[]> {
    return this.find(
      { isActive: true },
      { 
        sort: { createdAt: -1 },
        limit,
        skip,
        populate: 'influencerId'
      }
    );
  }

  async findByType(packageType: 'personalized_video' | 'shoutout' | 'consultation'): Promise<IPackage[]> {
    return this.find({ 
      packageType, 
      isActive: true 
    }, { 
      sort: { price: 1 },
      populate: 'influencerId'
    });
  }

  async findByPriceRange(minPrice: number, maxPrice: number): Promise<IPackage[]> {
    return this.find({
      price: { $gte: minPrice, $lte: maxPrice },
      isActive: true
    }, { 
      sort: { price: 1 },
      populate: 'influencerId'
    });
  }

  async searchPackages(searchTerm: string, limit: number = 20): Promise<IPackage[]> {
    const regex = new RegExp(searchTerm, 'i');
    return this.find({
      $or: [
        { title: regex },
        { description: regex }
      ],
      isActive: true
    }, { 
      sort: { purchaseCount: -1 },
      limit,
      populate: 'influencerId'
    });
  }

  async countActivePackagesByInfluencer(influencerId: string | mongoose.Types.ObjectId): Promise<number> {
    return this.count({ 
      influencerId, 
      isActive: true 
    });
  }

  async incrementPurchaseCount(packageId: string | mongoose.Types.ObjectId): Promise<IPackage | null> {
    return this.updateById(packageId, { $inc: { purchaseCount: 1 } });
  }

  async activatePackage(packageId: string | mongoose.Types.ObjectId): Promise<IPackage | null> {
    return this.updateById(packageId, { isActive: true });
  }

  async deactivatePackage(packageId: string | mongoose.Types.ObjectId): Promise<IPackage | null> {
    return this.updateById(packageId, { isActive: false });
  }

  async getMostPopularPackages(limit: number = 10): Promise<IPackage[]> {
    return this.find(
      { isActive: true },
      { 
        sort: { purchaseCount: -1 },
        limit,
        populate: 'influencerId'
      }
    );
  }
}