import mongoose from 'mongoose';
import { IVideoContent, VideoContent } from '../models/VideoContent';
import { BaseRepository } from './BaseRepository';

export class VideoContentRepository extends BaseRepository<IVideoContent> {
  constructor() {
    super(VideoContent);
  }

  async findByCreator(creatorId: string | mongoose.Types.ObjectId): Promise<IVideoContent[]> {
    return this.find({ creatorId }, { sort: { createdAt: -1 } });
  }

  async findPublicVideos(limit: number = 20, skip: number = 0): Promise<IVideoContent[]> {
    return this.find(
      { 
        visibility: 'public',
        processingStatus: 'ready'
      },
      { 
        sort: { createdAt: -1 },
        limit,
        skip
      }
    );
  }

  async findTrendingVideos(limit: number = 20): Promise<IVideoContent[]> {
    return this.find(
      { 
        visibility: 'public',
        processingStatus: 'ready'
      },
      { 
        sort: { 'engagement.views': -1, 'engagement.likes': -1 },
        limit
      }
    );
  }

  async findByTags(tags: string[], limit: number = 20): Promise<IVideoContent[]> {
    return this.find(
      { 
        tags: { $in: tags },
        visibility: 'public',
        processingStatus: 'ready'
      },
      { 
        sort: { createdAt: -1 },
        limit
      }
    );
  }

  async searchVideos(searchTerm: string, limit: number = 20): Promise<IVideoContent[]> {
    const regex = new RegExp(searchTerm, 'i');
    return this.find(
      {
        $or: [
          { title: regex },
          { description: regex },
          { tags: regex }
        ],
        visibility: 'public',
        processingStatus: 'ready'
      },
      { 
        sort: { 'engagement.views': -1 },
        limit
      }
    );
  }

  async incrementViews(videoId: string | mongoose.Types.ObjectId): Promise<IVideoContent | null> {
    return this.updateById(videoId, { $inc: { 'engagement.views': 1 } });
  }

  async incrementLikes(videoId: string | mongoose.Types.ObjectId): Promise<IVideoContent | null> {
    return this.updateById(videoId, { $inc: { 'engagement.likes': 1 } });
  }

  async incrementShares(videoId: string | mongoose.Types.ObjectId): Promise<IVideoContent | null> {
    return this.updateById(videoId, { $inc: { 'engagement.shares': 1 } });
  }

  async incrementComments(videoId: string | mongoose.Types.ObjectId): Promise<IVideoContent | null> {
    return this.updateById(videoId, { $inc: { 'engagement.comments': 1 } });
  }

  async updateProcessingStatus(
    videoId: string | mongoose.Types.ObjectId, 
    status: 'uploading' | 'processing' | 'ready' | 'failed'
  ): Promise<IVideoContent | null> {
    return this.updateById(videoId, { processingStatus: status });
  }
}