import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

/**
 * Supabase transaction pooler (PgBouncer / port 6543) does not support Prisma's
 * default prepared statements; without `pgbouncer=true` Postgres can return
 * 08P01 "bind message supplies N parameters, but prepared statement s1 requires M".
 *
 * @see https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections/pgbouncer
 */
function prismaDatasourceUrl(raw: string | undefined): string | undefined {
  if (!raw) return raw
  if (raw.includes('pgbouncer=true')) return raw

  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return raw
  }

  const host = url.hostname.toLowerCase()
  const port = url.port
  const looksLikeTxPooler = port === '6543' || host.includes('pooler.supabase.com')

  if (!looksLikeTxPooler) return raw

  url.searchParams.set('pgbouncer', 'true')
  return url.toString()
}

const databaseUrl = prismaDatasourceUrl(process.env.DATABASE_URL)

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(databaseUrl
      ? {
          datasources: {
            db: {
              url: databaseUrl,
            },
          },
        }
      : {}),
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

export { Prisma } from '@prisma/client'
export type { PrismaClient } from '@prisma/client'
export type { Database, Json } from './supabase-database.types'
