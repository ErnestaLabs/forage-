// apify-auth.ts

function getApifyToken() {
  const token = process.env.APIFY_TOKEN;
  if (!token) {
    throw new Error('APIFY_TOKEN not configured in environment variables');
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
  const token = getApifyToken();
  
  const res = await fetch(`https://api.apify.com/v2/key-value-stores/${KV_STORE_ID}/records/${apifyUserId}?token=${token}`);
  if (res.status === 404) return null;
  
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Apify API error (getUserRecord): ${res.status} ${text}`);
  }
  
  try {
    return JSON.parse(text);
  } catch (err: any) {
    throw new Error(`JSON parse error (getUserRecord): ${err.message}. Body starts with: ${text.substring(0, 50)}`);
  }
}

// Simple hash function to avoid crypto import issues in Edge/restricted environments
function simpleHash(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

export async function setUserRecord(record: UserRecord) {
  const token = getApifyToken();

  // Set the primary record
  const res1 = await fetch(`https://api.apify.com/v2/key-value-stores/${KV_STORE_ID}/records/${record.apifyUserId}?token=${token}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record)
  });
  
  if (!res1.ok) {
    const text = await res1.text();
    throw new Error(`Apify API error (setUserRecord primary): ${res1.status} ${text}`);
  }

  // Set the email index
  // Use simple hash of email to avoid invalid characters
  const emailHash = simpleHash(record.email.toLowerCase());
  const emailKey = `email_idx_${emailHash}`;
  const res2 = await fetch(`https://api.apify.com/v2/key-value-stores/${KV_STORE_ID}/records/${emailKey}?token=${token}`, {
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
  const token = getApifyToken();
  
  const emailHash = simpleHash(email.toLowerCase());
  const emailKey = `email_idx_${emailHash}`;
  
  const res = await fetch(`https://api.apify.com/v2/key-value-stores/${KV_STORE_ID}/records/${emailKey}?token=${token}`);
  if (res.status === 404) return null;
  
  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Apify API error (getUserIdByEmail): ${res.status} ${text}`);
  }
  
  try {
    const data = JSON.parse(text);
    return data.apifyUserId;
  } catch (err: any) {
    throw new Error(`JSON parse error (getUserIdByEmail): ${err.message}. Body starts with: ${text.substring(0, 50)}`);
  }
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
