// apify-auth.ts
// Robust authentication and storage library for Forage

function getApifyToken() {
  const token = (process.env.APIFY_TOKEN || '').trim();
  if (!token) {
    console.error('APIFY_TOKEN is missing from environment variables');
  }
  return token;
}

const KV_STORE_ID = 'C6MnJekCd6ekH9dAs'; // forage-users

export interface UserRecord {
  apifyUserId: string;
  apifyUsername: string;
  email: string;
  useCase: string;
  credits: number;
  creditsUsed: number;
  createdAt: string;
  source: string;
}

/**
 * Verifies an Apify token and returns user info
 */
export async function verifyApifyToken(token: string) {
  if (!token) return { valid: false, error: 'No token provided' };
  
  try {
    const res = await fetch('https://api.apify.com/v2/users/me', {
      headers: {
        'Authorization': `Bearer ${token.trim()}`
      }
    });

    if (!res.ok) {
      const text = await res.text();
      return { valid: false, error: `Apify error: ${res.status} ${text.substring(0, 50)}` };
    }

    const { data } = await res.json();
    return {
      valid: true,
      userId: data.id,
      username: data.username,
      email: data.email
    };
  } catch (error: any) {
    return { valid: false, error: `Fetch failed: ${error.message}` };
  }
}

/**
 * Fetches a user record from the KV store by Apify User ID
 */
export async function getUserRecord(apifyUserId: string): Promise<UserRecord | null> {
  const token = getApifyToken();
  if (!token) return null;
  
  try {
    const res = await fetch(`https://api.apify.com/v2/key-value-stores/${KV_STORE_ID}/records/${apifyUserId}?token=${token}`);
    if (res.status === 404) return null;
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    return null;
  }
}

/**
 * Maps an email to a safe Apify KV store key
 */
function getEmailIndexKey(email: string): string {
  // Simple alphanumeric replacement + prefix
  return 'email_idx_' + email.toLowerCase().replace(/[^a-z0-9]/g, '_');
}

/**
 * Sets a user record and its email index in the KV store
 */
export async function setUserRecord(record: UserRecord) {
  const token = getApifyToken();
  if (!token) throw new Error('APIFY_TOKEN not configured');

  // 1. Set the primary record
  const res1 = await fetch(`https://api.apify.com/v2/key-value-stores/${KV_STORE_ID}/records/${record.apifyUserId}?token=${token}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record)
  });
  
  if (!res1.ok) {
    const text = await res1.text();
    throw new Error(`Failed to save user: ${res1.status} ${text.substring(0, 50)}`);
  }

  // 2. Set the email index
  const emailKey = getEmailIndexKey(record.email);
  await fetch(`https://api.apify.com/v2/key-value-stores/${KV_STORE_ID}/records/${emailKey}?token=${token}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apifyUserId: record.apifyUserId })
  });
}

/**
 * Resolves an email to an Apify User ID using the index
 */
export async function getUserIdByEmail(email: string): Promise<string | null> {
  const token = getApifyToken();
  if (!token) return null;
  
  const emailKey = getEmailIndexKey(email);
  try {
    const res = await fetch(`https://api.apify.com/v2/key-value-stores/${KV_STORE_ID}/records/${emailKey}?token=${token}`);
    if (res.status === 404) return null;
    if (!res.ok) return null;
    const data = await res.json();
    return data.apifyUserId;
  } catch (err) {
    return null;
  }
}

/**
 * Checks if a user or email already exists
 */
export async function checkDuplicate(apifyUserId: string, email: string) {
  // Check ID first
  const byId = await getUserRecord(apifyUserId);
  if (byId) return { isDuplicate: true, record: byId };

  // Check Email
  const idByEmail = await getUserIdByEmail(email);
  if (idByEmail) {
    const byEmail = await getUserRecord(idByEmail);
    if (byEmail) return { isDuplicate: true, record: byEmail };
  }

  return { isDuplicate: false };
}
