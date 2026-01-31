import { FilterQuery } from 'mongoose';
import { IUser, User } from '../models/User';
import { BaseRepository } from './BaseRepository';

export class UserRepository extends BaseRepository<IUser> {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.findOne({ email: email.toLowerCase() });
  }

  async findByUsername(username: string): Promise<IUser | null> {
    return this.findOne({ username });
  }

  async findInfluencers(filter: FilterQuery<IUser> = {}): Promise<IUser[]> {
    return this.find({ 
      ...filter, 
      accountType: 'influencer',
      verificationStatus: 'verified'
    });
  }

  async findPendingInfluencers(): Promise<IUser[]> {
    return this.find({ 
      accountType: 'influencer',
      verificationStatus: 'pending'
    });
  }

  async updateVerificationStatus(
    userId: string, 
    status: 'pending' | 'verified' | 'rejected'
  ): Promise<IUser | null> {
    return this.updateById(userId, { verificationStatus: status });
  }

  async promoteToInfluencer(userId: string): Promise<IUser | null> {
    return this.updateById(userId, { 
      accountType: 'influencer',
      verificationStatus: 'verified'
    });
  }

  async searchUsers(searchTerm: string, limit: number = 20): Promise<IUser[]> {
    const regex = new RegExp(searchTerm, 'i');
    return this.find({
      $or: [
        { username: regex },
        { 'profile.displayName': regex }
      ]
    }, { limit });
  }
}