import mongoose, { Document, Schema } from 'mongoose';

export interface IVideoContent extends Document {
  creatorId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  tags: string[];
  videoUrl: string;
  thumbnailUrl?: string;
  duration: number;
  fileSize: number;
  processingStatus: 'uploading' | 'processing' | 'ready' | 'failed';
  engagement: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
  visibility: 'public' | 'private' | 'unlisted';
  createdAt: Date;
  updatedAt: Date;
}

const videoContentSchema = new Schema<IVideoContent>({
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator ID is required']
  },
  title: {
    type: String,
    required: [true, 'Video title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters'],
    trim: true
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    trim: true
  },
  tags: [{
    type: String,
    maxlength: [30, 'Tag cannot exceed 30 characters'],
    validate: {
      validator: function(v: string) {
        return /^[a-zA-Z0-9_]+$/.test(v);
      },
      message: 'Tags can only contain letters, numbers, and underscores'
    }
  }],
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required'],
    validate: {
      validator: function(v: string) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Video URL must be a valid HTTP/HTTPS URL'
    }
  },
  thumbnailUrl: {
    type: String,
    validate: {
      validator: function(v: string) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Thumbnail URL must be a valid HTTP/HTTPS URL'
    }
  },
  duration: {
    type: Number,
    required: [true, 'Video duration is required'],
    min: [1, 'Duration must be at least 1 second'],
    max: [300, 'Duration cannot exceed 300 seconds (5 minutes)']
  },
  fileSize: {
    type: Number,
    required: [true, 'File size is required'],
    min: [1, 'File size must be greater than 0'],
    max: [100 * 1024 * 1024, 'File size cannot exceed 100MB']
  },
  processingStatus: {
    type: String,
    enum: {
      values: ['uploading', 'processing', 'ready', 'failed'],
      message: 'Processing status must be uploading, processing, ready, or failed'
    },
    default: 'uploading'
  },
  engagement: {
    views: {
      type: Number,
      default: 0,
      min: [0, 'Views cannot be negative']
    },
    likes: {
      type: Number,
      default: 0,
      min: [0, 'Likes cannot be negative']
    },
    shares: {
      type: Number,
      default: 0,
      min: [0, 'Shares cannot be negative']
    },
    comments: {
      type: Number,
      default: 0,
      min: [0, 'Comments cannot be negative']
    }
  },
  visibility: {
    type: String,
    enum: {
      values: ['public', 'private', 'unlisted'],
      message: 'Visibility must be public, private, or unlisted'
    },
    default: 'public'
  }
}, {
  timestamps: true
});

// Validation for tags array length
videoContentSchema.path('tags').validate(function(tags: string[]) {
  return tags.length <= 10;
}, 'Cannot have more than 10 tags');

// Indexes for performance
videoContentSchema.index({ creatorId: 1 });
videoContentSchema.index({ processingStatus: 1 });
videoContentSchema.index({ visibility: 1 });
videoContentSchema.index({ tags: 1 });
videoContentSchema.index({ createdAt: -1 });
videoContentSchema.index({ 'engagement.views': -1 });
videoContentSchema.index({ 'engagement.likes': -1 });

// Compound indexes for feed queries
videoContentSchema.index({ visibility: 1, processingStatus: 1, createdAt: -1 });
videoContentSchema.index({ creatorId: 1, visibility: 1, createdAt: -1 });

export const VideoContent = mongoose.model<IVideoContent>('VideoContent', videoContentSchema);