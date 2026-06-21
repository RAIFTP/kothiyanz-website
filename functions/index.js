/* Cloud Functions stubs for Kothiyanz
 * - setAdmin: set custom admin claim for a user (requires ADMIN_SECRET env)
 * - sendWhatsApp: send a WhatsApp/SMS via Twilio (requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM)
 *
 * Deploy with Firebase CLI: `firebase deploy --only functions`
 * Set env vars before deploy: `firebase functions:config:set kothiyanz.admin_secret="YOUR_SECRET" twilio.sid="..." twilio.token="..." twilio.from="whatsapp:+123..."`
 */

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const twilio = require('twilio');

exports.setAdmin = functions.https.onRequest(async (req, res) => {
  try {
    const secret = functions.config().kothiyanz?.admin_secret;
    const provided = req.get('x-admin-secret') || req.query.secret || req.body.secret;
    if (!secret || provided !== secret) {
      return res.status(403).send('Forbidden');
    }
    const uid = req.body.uid || req.query.uid;
    if (!uid) return res.status(400).send('Missing uid');
    await admin.auth().setCustomUserClaims(uid, { admin: true });
    return res.status(200).send({ success: true, uid });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: err.message });
  }
});

exports.sendWhatsApp = functions.https.onRequest(async (req, res) => {
  try {
    const cfg = functions.config().twilio || {};
    const sid = cfg.sid;
    const token = cfg.token;
    const from = cfg.from;
    if (!sid || !token || !from) return res.status(500).send('Twilio not configured');
    const client = twilio(sid, token);
    const to = req.body.to || req.query.to;
    const body = req.body.body || req.query.body;
    if (!to || !body) return res.status(400).send('Missing to or body');
    const message = await client.messages.create({ body, from, to });
    return res.status(200).send({ sid: message.sid });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: err.message });
  }
});

// getUserByEmail: return uid for an email address (protected by admin secret)
exports.getUserByEmail = functions.https.onRequest(async (req, res) => {
  try {
    const secret = functions.config().kothiyanz?.admin_secret;
    const provided = req.get('x-admin-secret') || req.query.secret || req.body.secret;
    if (!secret || provided !== secret) {
      return res.status(403).send('Forbidden');
    }
    const email = req.body.email || req.query.email;
    if (!email) return res.status(400).send('Missing email');
    const userRecord = await admin.auth().getUserByEmail(email);
    return res.status(200).send({ uid: userRecord.uid, email: userRecord.email });
  } catch (err) {
    console.error(err);
    return res.status(500).send({ error: err.message });
  }
});
