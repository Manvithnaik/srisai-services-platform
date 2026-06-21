import { z } from 'zod';

// Auth Schemas
export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const RegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// Complaint Schemas
export const ComplaintSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string(),
  category: z.enum(['product', 'service', 'billing', 'delivery', 'other']),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CreateComplaintSchema = ComplaintSchema.omit({
  id: true,
  status: true,
  createdAt: true,
  updatedAt: true,
});

// Gallery Schemas
export const GalleryImageSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().url(),
  category: z.enum(['products', 'services', 'team', 'events']),
  status: z.enum(['active', 'inactive']),
  createdAt: z.string().datetime(),
});

export const CreateGalleryImageSchema = GalleryImageSchema.omit({
  id: true,
  createdAt: true,
});

// Feedback Schemas
export const FeedbackSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  rating: z.number().int().min(1).max(5),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  status: z.enum(['pending', 'approved', 'rejected']),
  createdAt: z.string().datetime(),
});

export const CreateFeedbackSchema = FeedbackSchema.omit({
  id: true,
  status: true,
  createdAt: true,
});

// Admin User Schemas
export const AdminUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['admin', 'moderator']),
  createdAt: z.string().datetime(),
});

// Settings Schemas
export const SettingsSchema = z.object({
  companyName: z.string(),
  contactEmail: z.string().email(),
  contactPhone: z.string(),
  address: z.string(),
  about: z.string(),
  socialMedia: z.object({
    facebook: z.string().url().optional(),
    twitter: z.string().url().optional(),
    instagram: z.string().url().optional(),
  }).optional(),
});

// Types (exported for convenience)
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type Complaint = z.infer<typeof ComplaintSchema>;
export type CreateComplaintInput = z.infer<typeof CreateComplaintSchema>;
export type GalleryImage = z.infer<typeof GalleryImageSchema>;
export type CreateGalleryImageInput = z.infer<typeof CreateGalleryImageSchema>;
export type Feedback = z.infer<typeof FeedbackSchema>;
export type CreateFeedbackInput = z.infer<typeof CreateFeedbackSchema>;
export type AdminUser = z.infer<typeof AdminUserSchema>;
export type Settings = z.infer<typeof SettingsSchema>;
