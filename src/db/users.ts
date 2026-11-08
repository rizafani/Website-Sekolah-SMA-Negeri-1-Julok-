import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, name: string = 'Pengguna') {
  try {
    const result = await db
      .insert(users)
      .values({
        uid,
        username: email.split('@')[0],
        email,
        name,
        role: 'guru',
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          name,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error('Database query failed in getOrCreateUser:', error);
    throw new Error('Database query failed. Please try again later.', { cause: error });
  }
}

export async function getAllUsers() {
  try {
    return await db.select().from(users);
  } catch (error) {
    console.error('Failed to get users from Cloud SQL:', error);
    throw new Error('Failed to retrieve users', { cause: error });
  }
}
