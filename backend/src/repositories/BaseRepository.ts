import mongoose, { Document, FilterQuery, Model, QueryOptions, UpdateQuery } from 'mongoose';

export abstract class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    try {
      const document = new this.model(data);
      return await document.save();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findById(id: string | mongoose.Types.ObjectId): Promise<T | null> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOne(filter);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async find(filter: FilterQuery<T> = {}, options: QueryOptions = {}): Promise<T[]> {
    try {
      return await this.model.find(filter, null, options);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateById(id: string | mongoose.Types.ObjectId, update: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, update, { new: true, runValidators: true });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOneAndUpdate(filter, update, { new: true, runValidators: true });
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteById(id: string | mongoose.Types.ObjectId): Promise<T | null> {
    try {
      return await this.model.findByIdAndDelete(id);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async deleteOne(filter: FilterQuery<T>): Promise<T | null> {
    try {
      return await this.model.findOneAndDelete(filter);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    try {
      return await this.model.countDocuments(filter);
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async exists(filter: FilterQuery<T>): Promise<boolean> {
    try {
      const result = await this.model.exists(filter);
      return result !== null;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  protected handleError(error: any): Error {
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(err => err.message);
      return new Error(`Validation Error: ${messages.join(', ')}`);
    }
    
    if (error instanceof mongoose.Error.CastError) {
      return new Error(`Invalid ID format: ${error.value}`);
    }
    
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return new Error(`Duplicate value for field: ${field}`);
    }
    
    return error instanceof Error ? error : new Error('Database operation failed');
  }
}