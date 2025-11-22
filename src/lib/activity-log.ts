import { prisma } from './prisma'

export interface ActivityLogInput {
  userId: string
  action: string
  resource: string
  resourceId?: string
  details?: string
  ipAddress?: string
  userAgent?: string
}

export interface ActivityLogFilters {
  page?: number
  limit?: number
  userId?: string
  action?: string
  resource?: string
  resourceId?: string
  startDate?: Date
  endDate?: Date
}

export interface ActivityLogResult {
  logs: any[]
  total: number
  page: number
  limit: number
  totalPages: number
}

/**
 * Log an admin activity
 */
export async function logActivity(input: ActivityLogInput) {
  try {
    const log = await prisma.adminActivityLog.create({
      data: {
        userId: input.userId,
        action: input.action,
        resource: input.resource,
        resourceId: input.resourceId,
        details: input.details,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    })
    return log
  } catch (error) {
    console.error('Error logging activity:', error)
    throw error
  }
}

/**
 * Get activity logs with filters and pagination
 */
export async function getActivityLogs(
  filters: ActivityLogFilters = {}
): Promise<ActivityLogResult> {
  const {
    page = 1,
    limit = 20,
    userId,
    action,
    resource,
    resourceId,
    startDate,
    endDate,
  } = filters

  const where: any = {}

  if (userId) {
    where.userId = userId
  }

  if (action) {
    where.action = action
  }

  if (resource) {
    where.resource = resource
  }

  if (resourceId) {
    where.resourceId = resourceId
  }

  if (startDate || endDate) {
    where.createdAt = {}
    if (startDate) {
      where.createdAt.gte = startDate
    }
    if (endDate) {
      where.createdAt.lte = endDate
    }
  }

  const [logs, total] = await Promise.all([
    prisma.adminActivityLog.findMany({
      where,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.adminActivityLog.count({ where }),
  ])

  return {
    logs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit) || 0,
  }
}

/**
 * Get activity logs by user ID
 */
export async function getActivityLogsByUser(
  userId: string,
  options: { page?: number; limit?: number } = {}
): Promise<ActivityLogResult> {
  return getActivityLogs({
    userId,
    page: options.page,
    limit: options.limit,
  })
}

/**
 * Get activity logs by resource
 */
export async function getActivityLogsByResource(
  resource: string,
  resourceId?: string,
  options: { page?: number; limit?: number } = {}
): Promise<ActivityLogResult> {
  return getActivityLogs({
    resource,
    resourceId,
    page: options.page,
    limit: options.limit,
  })
}

/**
 * Helper to extract IP address from request
 */
export function getClientIp(request: Request): string | undefined {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }
  return undefined
}

/**
 * Helper to extract user agent from request
 */
export function getUserAgent(request: Request): string | undefined {
  return request.headers.get('user-agent') || undefined
}
