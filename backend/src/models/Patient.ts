import mongoose, { Document, Schema } from 'mongoose';

export interface IPatient extends Document {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  email?: string;
  phone?: string;
  address?: string;
  medicalHistory: {
    conditions: string[];
    medications: string[];
    allergies: string[];
  };
  lifestyle: {
    diet: 'vegetarian' | 'non-vegetarian' | 'vegan';
    exercise: 'none' | 'light' | 'moderate' | 'intense';
    sleep: string;
    stress: 'low' | 'medium' | 'high';
  };
  symptoms: string[];
  consentGiven: boolean;
  consentDate?: Date;
  testResults?: {
    testId: string;
    date: Date;
    doshaPrediction: 'vata' | 'pitta' | 'kapha';
    confidence: number;
    observations: string[];
    remarks: string;
    imageUrl?: string;
    videoUrl?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Patient name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  age: {
    type: Number,
    required: [true, 'Age is required'],
    min: [0, 'Age must be positive'],
    max: [150, 'Age cannot exceed 150']
  },
  gender: {
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female', 'other']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    trim: true,
    match: [/^[\d\s\-\+\(\)]+$/, 'Please enter a valid phone number']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [500, 'Address cannot exceed 500 characters']
  },
  medicalHistory: {
    conditions: [{
      type: String,
      trim: true
    }],
    medications: [{
      type: String,
      trim: true
    }],
    allergies: [{
      type: String,
      trim: true
    }]
  },
  lifestyle: {
    diet: {
      type: String,
      enum: ['vegetarian', 'non-vegetarian', 'vegan'],
      default: 'non-vegetarian'
    },
    exercise: {
      type: String,
      enum: ['none', 'light', 'moderate', 'intense'],
      default: 'moderate'
    },
    sleep: {
      type: String,
      trim: true,
      maxlength: [200, 'Sleep description cannot exceed 200 characters']
    },
    stress: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  symptoms: [{
    type: String,
    trim: true
  }],
  consentGiven: {
    type: Boolean,
    required: [true, 'Consent is required'],
    default: false
  },
  consentDate: {
    type: Date
  },
  testResults: [{
    testId: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    doshaPrediction: {
      type: String,
      enum: ['vata', 'pitta', 'kapha'],
      required: true
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    },
    observations: [{
      type: String,
      trim: true
    }],
    remarks: {
      type: String,
      trim: true,
      maxlength: [1000, 'Remarks cannot exceed 1000 characters']
    },
    imageUrl: String,
    videoUrl: String
  }]
}, {
  timestamps: true
});

// Index for better search performance
PatientSchema.index({ name: 1 });
PatientSchema.index({ email: 1 });
PatientSchema.index({ createdAt: -1 });

export default mongoose.model<IPatient>('Patient', PatientSchema);
