// User Types
export interface User {
  id: string
  email: string
  name?: string
  isActive: boolean
  isAdmin: boolean
  createdAt: Date
  updatedAt: Date
}

// Device Types
export interface Device {
  id: string
  userId: string
  fingerprint: string
  userAgent: string
  ipAddress: string
  lastActiveAt: Date
  isActive: boolean
}

// Task Types
export type TaskType = 'music_cover' | 'image_gen' | 'video_gen' | 'mastering'
export type TaskStatus = 'pending' | 'processing' | 'completed' | 'failed'

export interface Task {
  id: string
  userId: string
  type: TaskType
  provider: string
  externalTaskId?: string
  status: TaskStatus
  progress: number
  inputData: any
  outputData?: any
  errorMessage?: string
  createdAt: Date
  updatedAt: Date
  completedAt?: Date
}

// Result Types
export type ResultType = 'image' | 'audio' | 'video'

export interface Result {
  id: string
  userId: string
  taskId: string
  type: ResultType
  title?: string
  description?: string
  cloudinaryUrl: string
  cloudinaryId: string
  metadata?: any
  isStarred: boolean
  createdAt: Date
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  error?: string
  code?: number
}
