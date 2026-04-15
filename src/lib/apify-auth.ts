import crypto from 'crypto';

const APIFY_TOKEN = process.env.APIFY_TOKEN;
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

export async function verifyApifyToken(token: string) {
  try {
    const res = await fetch('https://api.apify.com/v2/users/me', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      return { valid: false, error: 'Invalid Apify token' };
    }

    const { data } = await res.json();
    return {
      valid: true,
      userId: data.id,
      username: data.username,
      email: data.email
    };
  } catch (error) {
    return { valid: false, error: 'Failed to verify token' };
  }
}

export async function getUserRecord(apifyUserId: string): Promise<UserRecord | null> {
  if (!APIFY_TOKEN) throw new Error('APIFY_TOKEN not configured');
  
  const res = await fetch(`https://api.apify.com/v2/key-value-stores/${KV_STORE_ID}/records/${apifyUserId}?token=${APIFY_TOKEN}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Apify API error (getUserRecord): ${res.status} ${text}`);
  }
  return await res.json();
}

export async function setUserRecord(record: UserRecord) {
  if (!APIFY_TOKEN) throw new Error('APIFY_TOKEN not configured');

  // Set the primary record
  const res1 = await fetch(`https://api.apify.com/v2/key-value-stores/${KV_STORE_ID}/records/${record.apifyUserId}?token=${APIFY_TOKEN}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record)
  });
  
  if (!res1.ok) {
    const text = await res1.text();
    throw new Error(`Apify API error (setUserRecord primary): ${res1.status} ${text}`);
  }

  // Set the email index
  // Apify keys only allow a-z, A-Z, 0-9, _, -, ., ~
  // Use MD5 hash of email to avoid invalid characters and potential collisions
  const emailHash = crypto.createHash('md5').update(record.email.toLowerCase()).digest('hex');
  const emailKey = `email_idx_${emailHash}`;
  const res2 = await fetch(`https://api.apify.com/v2/key-value-stores/${KV_STORE_ID}/records/${emailKey}?token=${APIFY_TOKEN}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apifyUserId: record.apifyUserId })
  });

  if (!res2.ok) {
    const text = await res2.text();
    throw new Error(`Apify API error (setUserRecord index): ${res2.status} ${text}`);
  }
}

export async function getUserIdByEmail(email: string): Promise<string | null> {
  if (!APIFY_TOKEN) throw new Error('APIFY_TOKEN not configured');
  
  const emailHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');
  const emailKey = `email_idx_${emailHash}`;
  
  const res = await fetch(`https://api.apify.com/v2/key-value-stores/${KV_STORE_ID}/records/${emailKey}?token=${APIFY_TOKEN}`);
  if (res.status === 404) return null;
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Apify API error (getUserIdByEmail): ${res.status} ${text}`);
  }
  const data = await res.json();
  return data.apifyUserId;
}

export async function checkDuplicate(apifyUserId: string, email: string) {
  const byId = await getUserRecord(apifyUserId);
  if (byId) return { isDuplicate: true, record: byId };

  const idByEmail = await getUserIdByEmail(email);
  if (idByEmail) {
    const byEmail = await getUserRecord(idByEmail);
    if (byEmail) return { isDuplicate: true, record: byEmail };
  }

  return { isDuplicate: false };
}
