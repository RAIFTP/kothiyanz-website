// admin-helpers.js
// Simple helper to call deployed Cloud Functions endpoints.
// Usage (after you deploy functions):
// setAdminClaim('https://us-central1-YOUR_PROJECT.cloudfunctions.net/setAdmin', 'USER_UID', 'YOUR_SECRET')

export async function setAdminClaim(functionUrl, uid, secret){
  const res = await fetch(functionUrl + '?uid=' + encodeURIComponent(uid), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
    body: JSON.stringify({ uid })
  });
  return res.json();
}

export async function sendWhatsApp(functionUrl, to, message){
  const res = await fetch(functionUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, body: message })
  });
  return res.json();
}

export async function getUserUidByEmail(functionUrl, email, secret){
  const res = await fetch(functionUrl + '?email=' + encodeURIComponent(email), {
    method: 'GET',
    headers: { 'x-admin-secret': secret }
  });
  return res.json();
}
