import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import multer from 'multer';
import { db, initDB } from './db.js';
import { requireAuth, createRateLimiter, verifyFirebaseIdToken } from './auth.js';
import { 
  createSubscriptionOrder, 
  verifySubscriptionPayment, 
  verifyWebhookSignature 
} from './payments.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

// Initialize DB
initDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Storage configuration (safe for serverless read-only environments)
const storageDir = isServerless
  ? path.join(os.tmpdir(), 'storage', 'uploads')
  : path.join(__dirname, 'storage', 'uploads');
try {
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }
} catch (e) {
  console.warn('[Storage] Read-only environment warning:', e.message);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storageDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.heic'];

/**
 * Validates image magic bytes to prevent masquerading non-image files
 */
function validateImageMagicBytes(filePath) {
  try {
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(12);
    const bytesRead = fs.readSync(fd, buffer, 0, 12, 0);
    fs.closeSync(fd);

    if (bytesRead < 4) return false;

    // JPEG: FF D8 FF
    if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return true;
    // PNG: 89 50 4E 47
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return true;
    // GIF: 47 49 46 38
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x38) return true;
    // WEBP: RIFF + WEBP
    if (bytesRead >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return true;
    // HEIC: offset 4 contains 'ftyp'
    if (bytesRead >= 8 && buffer.toString('ascii', 4, 8) === 'ftyp') return true;

    return false;
  } catch (err) {
    return false;
  }
}

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB per photo for web
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return cb(new Error(`File extension "${ext}" is not permitted. Only JPG, PNG, WEBP, and HEIC files are allowed.`), false);
    }
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only valid image files are allowed!'), false);
    }
  }
});

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  next();
});

// Restricted CORS Origins
const allowedOrigins = [
  'http://localhost:3001',
  'http://localhost:5173',
  'https://managestudio.io',
  'https://www.managestudio.io',
  'https://app.managestudio.io',
  ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(s => s.trim()).filter(Boolean) : [])
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || (origin && origin.endsWith('.vercel.app'))) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy blocked access from origin: ${origin}`));
    }
  },
  credentials: true
}));

app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
app.use('/storage/uploads', express.static(storageDir));

/**
 * Multi-tenant Studio isolation helper
 */
export function getOrCreateStudioForUser(user) {
  if (!user || !user.uid) {
    return db.prepare('SELECT * FROM studios WHERE id = ?').get('std_default');
  }
  let studio = db.prepare('SELECT * FROM studios WHERE owner_uid = ?').get(user.uid);
  if (!studio) {
    const defaultStudio = db.prepare('SELECT * FROM studios WHERE id = ?').get('std_default');
    if (defaultStudio && (!defaultStudio.owner_uid || defaultStudio.owner_uid === user.uid)) {
      db.prepare('UPDATE studios SET owner_uid = ? WHERE id = ?').run(user.uid, 'std_default');
      studio = db.prepare('SELECT * FROM studios WHERE id = ?').get('std_default');
    } else {
      const newStudioId = `std_${user.uid.slice(0, 10)}`;
      const studioName = user.studioName || (user.displayName ? `${user.displayName}'s Studio` : 'My Studio');
      const now = new Date().toISOString();
      db.prepare(`
        INSERT INTO studios (id, name, owner_name, email, storage_limit_gb, storage_used_gb, owner_uid, created_at, updated_at)
        VALUES (?, ?, ?, ?, 15, 0, ?, ?, ?)
      `).run(
        newStudioId,
        studioName,
        user.displayName || 'Studio Owner',
        user.email || '',
        user.uid,
        now,
        now
      );
      studio = db.prepare('SELECT * FROM studios WHERE id = ?').get(newStudioId);
    }
  }
  return studio;
}

/**
 * Helper to fetch valid active subscription (including cancelled subscriptions within their paid period)
 */
export function getActiveSubscription(userUid) {
  if (!userUid) return null;
  const now = new Date().toISOString();
  return db.prepare(`
    SELECT * FROM subscriptions 
    WHERE user_uid = ? 
      AND (status = 'active' OR (status = 'cancelled' AND current_period_end > ?))
    ORDER BY current_period_end DESC 
    LIMIT 1
  `).get(userUid, now);
}

async function resolveUserFromReq(req) {
  if (req.user) return req.user;
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  if (!token) return null;
  try {
    const user = await verifyFirebaseIdToken(token);
    req.user = user;
    return user;
  } catch {
    return null;
  }
}

// ==========================================
// 0. HEALTH & STATUS ENDPOINTS
// ==========================================
app.get('/api', (req, res) => {
  res.json({
    name: 'ManageStudio API',
    status: 'healthy',
    version: '1.0.0',
    mode: process.env.NODE_ENV || 'development'
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// 1. DASHBOARD STATS
// ==========================================
app.get('/api/dashboard/stats', async (req, res) => {
  try {
    const user = await resolveUserFromReq(req);
    const studio = getOrCreateStudioForUser(user);
    const totalAlbums = db.prepare('SELECT COUNT(*) as count FROM albums WHERE studio_id = ?').get(studio.id).count;
    const activeAlbums = db.prepare("SELECT COUNT(*) as count FROM albums WHERE studio_id = ? AND status != 'COMPLETED'").get(studio.id).count;
    const completedAlbums = db.prepare("SELECT COUNT(*) as count FROM albums WHERE studio_id = ? AND status = 'COMPLETED'").get(studio.id).count;
    const totalPhotos = db.prepare(`
      SELECT COUNT(*) as count FROM photos p JOIN albums a ON p.album_id = a.id WHERE a.studio_id = ?
    `).get(studio.id).count;

    let storageLimitGb = studio.storage_limit_gb || 15;
    if (user) {
      const sub = getActiveSubscription(user.uid);
      if (sub && sub.storage_quota_gb) storageLimitGb = sub.storage_quota_gb;
    }

    const usedBytes = db.prepare(`
      SELECT COALESCE(SUM(p.size_bytes), 0) as total FROM photos p JOIN albums a ON p.album_id = a.id WHERE a.studio_id = ?
    `).get(studio.id).total;
    const storageUsedGb = Number((usedBytes / (1024 * 1024 * 1024)).toFixed(2));

    res.json({
      studio: {
        id: studio.id,
        name: studio.name || 'STUDIO SELECT',
        ownerName: studio.owner_name || (user?.displayName) || 'Shaik Sadiq',
        email: studio.email || (user?.email) || 'sadiq@studioselect.io',
        storageLimitGb,
        storageUsedGb
      },
      stats: {
        totalAlbums,
        activeAlbums,
        completedAlbums,
        totalPhotos: totalPhotos > 0 ? totalPhotos : (user ? 0 : 8245),
        storageUsed: `${storageUsedGb} GB`,
        storageLimit: `${storageLimitGb} GB`
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 2. ALBUMS LIST & SEARCH (TENANT ISOLATED)
// ==========================================
app.get('/api/albums', async (req, res) => {
  try {
    const user = await resolveUserFromReq(req);
    const studio = getOrCreateStudioForUser(user);
    const { status, search } = req.query;
    let query = `
      SELECT a.*,
        (SELECT COUNT(*) FROM photos p WHERE p.album_id = a.id) as photo_count,
        (SELECT COUNT(*) FROM photos p WHERE p.album_id = a.id AND p.is_selected = 1) as selected_count
      FROM albums a
      WHERE a.studio_id = ?
    `;
    const params = [studio.id];

    if (status && status !== 'ALL') {
      query += ` AND a.status = ?`;
      params.push(status);
    }

    if (search) {
      query += ` AND (a.name LIKE ? OR a.client_name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY a.created_at DESC`;

    const albums = db.prepare(query).all(...params);

    const formatted = albums.map(alb => ({
      id: alb.id,
      name: alb.name,
      clientName: alb.client_name,
      weddingDate: alb.wedding_date,
      description: alb.description,
      coverPhotoUrl: alb.cover_photo_url,
      clientToken: alb.client_token,
      status: alb.status,
      photoCount: alb.photo_count,
      selectedCount: alb.selected_count,
      submittedAt: alb.submitted_at,
      clientNotes: alb.client_notes,
      createdAt: alb.created_at
    }));

    res.json(formatted);
  } catch (error) {
    console.error('List albums error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3. CREATE NEW ALBUM (TENANT ISOLATED)
// ==========================================
app.post('/api/albums', async (req, res) => {
  try {
    const user = await resolveUserFromReq(req);
    const studio = getOrCreateStudioForUser(user);
    const { name, clientName, weddingDate, description } = req.body;
    if (!name || !clientName) {
      return res.status(400).json({ error: 'Album name and Client name are required' });
    }

    const id = `alb_${Date.now()}`;
    const clientToken = `sel_${crypto.randomBytes(8).toString('hex')}`;
    const now = new Date().toISOString();

    // Default placeholder wedding cover until first photo upload
    const defaultCover = 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';

    db.prepare(`
      INSERT INTO albums (id, studio_id, name, client_name, wedding_date, description, cover_photo_url, client_token, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'WAITING', ?, ?)
    `).run(
      id,
      studio.id,
      name.trim(),
      clientName.trim(),
      weddingDate || '',
      description || '',
      defaultCover,
      clientToken,
      now,
      now
    );

    const newAlbum = db.prepare('SELECT * FROM albums WHERE id = ?').get(id);

    res.status(201).json({
      id: newAlbum.id,
      name: newAlbum.name,
      clientName: newAlbum.client_name,
      weddingDate: newAlbum.wedding_date,
      description: newAlbum.description,
      coverPhotoUrl: newAlbum.cover_photo_url,
      clientToken: newAlbum.client_token,
      status: newAlbum.status,
      photoCount: 0,
      selectedCount: 0,
      createdAt: newAlbum.created_at
    });
  } catch (error) {
    console.error('Create album error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 4. ALBUM DETAILS (STUDIO VIEW & TENANT CHECK)
// ==========================================
app.get('/api/albums/:id', async (req, res) => {
  try {
    const user = await resolveUserFromReq(req);
    const studio = getOrCreateStudioForUser(user);
    const album = db.prepare('SELECT * FROM albums WHERE id = ?').get(req.params.id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    // Strict cross-tenant check
    if (user && album.studio_id !== studio.id) {
      return res.status(403).json({ error: 'Unauthorized: Album belongs to another studio.' });
    }

    const photos = db.prepare(`
      SELECT * FROM photos WHERE album_id = ? ORDER BY is_selected DESC, created_at ASC
    `).all(album.id);

    const selectedCount = photos.filter(p => p.is_selected === 1).length;

    res.json({
      album: {
        id: album.id,
        name: album.name,
        clientName: album.client_name,
        weddingDate: album.wedding_date,
        description: album.description,
        coverPhotoUrl: album.cover_photo_url,
        clientToken: album.client_token,
        status: album.status,
        maxSelections: album.max_selections,
        submittedAt: album.submitted_at,
        clientNotes: album.client_notes,
        createdAt: album.created_at,
        photoCount: photos.length,
        selectedCount
      },
      photos: photos.map(p => ({
        id: p.id,
        filename: p.filename,
        originalName: p.original_name,
        url: p.url,
        sizeBytes: p.size_bytes,
        isSelected: p.is_selected === 1,
        selectedAt: p.selected_at
      }))
    });
  } catch (error) {
    console.error('Get album error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 5. PHOTO UPLOAD (VALIDATION & QUOTA ENFORCED)
// ==========================================
app.post('/api/albums/:id/photos', upload.array('photos', 50), async (req, res) => {
  try {
    const user = await resolveUserFromReq(req);
    const studio = getOrCreateStudioForUser(user);
    const album = db.prepare('SELECT * FROM albums WHERE id = ?').get(req.params.id);
    if (!album) {
      if (req.files) req.files.forEach(f => fs.existsSync(f.path) && fs.unlinkSync(f.path));
      return res.status(404).json({ error: 'Album not found' });
    }

    // Studio ownership verification
    if (user && album.studio_id !== studio.id) {
      if (req.files) req.files.forEach(f => fs.existsSync(f.path) && fs.unlinkSync(f.path));
      return res.status(403).json({ error: 'Unauthorized: Album belongs to another studio.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No photo files uploaded' });
    }

    // Storage quota verification
    let quotaGb = studio.storage_limit_gb || 15;
    if (user) {
      const sub = getActiveSubscription(user.uid);
      if (sub && sub.storage_quota_gb) quotaGb = sub.storage_quota_gb;
    }
    const quotaBytes = quotaGb * 1024 * 1024 * 1024;
    const currentUsedBytes = db.prepare(`
      SELECT COALESCE(SUM(p.size_bytes), 0) as total FROM photos p JOIN albums a ON p.album_id = a.id WHERE a.studio_id = ?
    `).get(studio.id).total;

    const incomingBytes = req.files.reduce((acc, f) => acc + f.size, 0);
    if (currentUsedBytes + incomingBytes > quotaBytes) {
      req.files.forEach(f => fs.existsSync(f.path) && fs.unlinkSync(f.path));
      return res.status(413).json({
        error: `Storage quota exceeded. Allowed quota is ${quotaGb} GB. Please upgrade storage addon on managestudio.io.`
      });
    }

    // Magic bytes verification
    for (const file of req.files) {
      if (!validateImageMagicBytes(file.path)) {
        req.files.forEach(f => fs.existsSync(f.path) && fs.unlinkSync(f.path));
        return res.status(400).json({
          error: `File "${file.originalname}" failed security check. File header does not match valid image content.`
        });
      }
    }

    const now = new Date().toISOString();
    const insertedPhotos = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const photoId = `pho_${Date.now()}_${i}`;
      const photoUrl = `/storage/uploads/${file.filename}`;

      db.prepare(`
        INSERT INTO photos (id, album_id, filename, original_name, url, size_bytes, is_selected, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 0, ?)
      `).run(
        photoId,
        album.id,
        file.filename,
        file.originalname,
        photoUrl,
        file.size,
        now
      );

      // If album had default cover, update cover to first uploaded photo
      if (i === 0 && (!album.cover_photo_url || album.cover_photo_url.includes('images.unsplash.com'))) {
        db.prepare('UPDATE albums SET cover_photo_url = ? WHERE id = ?').run(photoUrl, album.id);
      }

      insertedPhotos.push({
        id: photoId,
        filename: file.filename,
        originalName: file.originalname,
        url: photoUrl,
        sizeBytes: file.size,
        isSelected: false
      });
    }

    res.status(201).json({
      success: true,
      count: insertedPhotos.length,
      photos: insertedPhotos
    });
  } catch (error) {
    if (req.files) req.files.forEach(f => fs.existsSync(f.path) && fs.unlinkSync(f.path));
    console.error('Upload photos error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 6. PRIVATE CLIENT PORTAL (STRICTLY ISOLATED)
// ==========================================
app.get('/api/portal/:token', (req, res) => {
  try {
    const album = db.prepare('SELECT * FROM albums WHERE client_token = ?').get(req.params.token);
    if (!album) {
      return res.status(404).json({ error: 'Private selection album not found or link has expired' });
    }

    const studio = db.prepare('SELECT name, owner_name FROM studios WHERE id = ?').get(album.studio_id);

    const photos = db.prepare(`
      SELECT id, filename, original_name, url, size_bytes, is_selected, selected_at
      FROM photos
      WHERE album_id = ?
      ORDER BY created_at ASC
    `).all(album.id);

    const selectedPhotos = photos.filter(p => p.is_selected === 1);

    res.json({
      studio: {
        name: studio?.name || 'STUDIO SELECT'
      },
      album: {
        id: album.id,
        name: album.name,
        clientName: album.client_name,
        weddingDate: album.wedding_date,
        description: album.description,
        coverPhotoUrl: album.cover_photo_url,
        status: album.status,
        submittedAt: album.submitted_at,
        photoCount: photos.length,
        selectedCount: selectedPhotos.length
      },
      photos: photos.map(p => ({
        id: p.id,
        filename: p.filename,
        originalName: p.original_name,
        url: p.url,
        isSelected: p.is_selected === 1,
        selectedAt: p.selected_at
      }))
    });
  } catch (error) {
    console.error('Client portal error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 7. CLIENT SELECTION TOGGLE (INSTANT PERSISTENCE)
// ==========================================
app.post('/api/portal/:token/select', (req, res) => {
  try {
    const { photoId, isSelected } = req.body;
    const album = db.prepare('SELECT * FROM albums WHERE client_token = ?').get(req.params.token);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    if (album.status === 'COMPLETED') {
      return res.status(400).json({ error: 'Selection has already been finalized and submitted' });
    }

    // Verify photo belongs to this album
    const photo = db.prepare('SELECT * FROM photos WHERE id = ? AND album_id = ?').get(photoId, album.id);
    if (!photo) {
      return res.status(404).json({ error: 'Photo not found in this album' });
    }

    const now = new Date().toISOString();
    const selectFlag = isSelected ? 1 : 0;
    const selectedAt = isSelected ? now : null;

    db.prepare('UPDATE photos SET is_selected = ?, selected_at = ? WHERE id = ?').run(
      selectFlag,
      selectedAt,
      photoId
    );

    // If album was WAITING, change to IN_PROGRESS
    if (album.status === 'WAITING') {
      db.prepare("UPDATE albums SET status = 'IN_PROGRESS', updated_at = ? WHERE id = ?").run(now, album.id);
    }

    const count = db.prepare('SELECT COUNT(*) as count FROM photos WHERE album_id = ? AND is_selected = 1').get(album.id).count;

    res.json({
      success: true,
      photoId,
      isSelected: Boolean(selectFlag),
      selectedCount: count
    });
  } catch (error) {
    console.error('Select error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 8. CLIENT SUBMIT SELECTION (FINAL CONFIRMATION)
// ==========================================
app.post('/api/portal/:token/submit', (req, res) => {
  try {
    const { clientNotes } = req.body;
    const album = db.prepare('SELECT * FROM albums WHERE client_token = ?').get(req.params.token);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    if (album.status === 'COMPLETED') {
      return res.status(400).json({ error: 'This selection has already been submitted to the studio' });
    }

    const selectedPhotos = db.prepare('SELECT * FROM photos WHERE album_id = ? AND is_selected = 1').all(album.id);
    if (selectedPhotos.length === 0) {
      return res.status(400).json({ error: 'Please select at least one photo before submitting' });
    }

    const now = new Date().toISOString();

    db.prepare(`
      UPDATE albums
      SET status = 'COMPLETED',
          submitted_at = ?,
          client_notes = ?,
          updated_at = ?
      WHERE id = ?
    `).run(
      now,
      clientNotes ? clientNotes.trim() : null,
      now,
      album.id
    );

    // Record activity log
    db.prepare(`
      INSERT INTO activity_logs (id, album_id, action, details, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(
      `act_${Date.now()}`,
      album.id,
      'SELECTION_SUBMITTED',
      `Client submitted ${selectedPhotos.length} selected photos.`,
      now
    );

    res.json({
      success: true,
      message: 'Selection submitted successfully',
      submittedAt: now,
      selectedCount: selectedPhotos.length
    });
  } catch (error) {
    console.error('Submit error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 9. STUDIO EXPORT SELECTION FOR LIGHTROOM
// ==========================================
app.get('/api/albums/:id/export', async (req, res) => {
  try {
    const user = await resolveUserFromReq(req);
    const studio = getOrCreateStudioForUser(user);
    const album = db.prepare('SELECT * FROM albums WHERE id = ?').get(req.params.id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    if (user && album.studio_id !== studio.id) {
      return res.status(403).json({ error: 'Unauthorized: Album belongs to another studio.' });
    }

    const selectedPhotos = db.prepare('SELECT original_name FROM photos WHERE album_id = ? AND is_selected = 1').all(album.id);
    const filenames = selectedPhotos.map(p => p.original_name);
    const commaSeparated = filenames.join(', ');

    res.json({
      albumName: album.name,
      clientName: album.client_name,
      count: filenames.length,
      filenames,
      lightroomQuery: commaSeparated
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 10. DELETE ALBUM (PHYSICAL CLEANUP & ISOLATION)
// ==========================================
app.delete('/api/albums/:id', async (req, res) => {
  try {
    const user = await resolveUserFromReq(req);
    const studio = getOrCreateStudioForUser(user);
    const album = db.prepare('SELECT * FROM albums WHERE id = ?').get(req.params.id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    if (user && album.studio_id !== studio.id) {
      return res.status(403).json({ error: 'Unauthorized: Album belongs to another studio.' });
    }

    // Clean up physical files from disk
    const photos = db.prepare('SELECT filename FROM photos WHERE album_id = ?').all(album.id);
    photos.forEach(p => {
      const pPath = path.join(storageDir, p.filename);
      if (fs.existsSync(pPath)) {
        try { fs.unlinkSync(pPath); } catch {}
      }
    });

    db.prepare('DELETE FROM photos WHERE album_id = ?').run(album.id);
    db.prepare('DELETE FROM albums WHERE id = ?').run(album.id);
    res.json({ success: true, message: 'Album and all photos deleted successfully.' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 11. CONTACT FORM SUBMISSION
// ==========================================
app.post('/api/contact', (req, res) => {
  try {
    const { fullName, studioName, email, enquiryType, message } = req.body || {};
    if (!fullName || !fullName.trim()) {
      return res.status(400).json({ error: 'Full name is required.' });
    }
    if (!studioName || !studioName.trim()) {
      return res.status(400).json({ error: 'Studio name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Work email is required.' });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please provide a valid work email address.' });
    }
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message cannot be empty.' });
    }
    if (message.trim().length > 1000) {
      return res.status(400).json({ error: 'Message cannot exceed 1000 characters.' });
    }

    const id = `msg_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const createdAt = new Date().toISOString();
    
    db.prepare(`
      INSERT INTO contact_messages (id, full_name, studio_name, email, enquiry_type, message, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      fullName.trim(),
      studioName.trim(),
      email.trim(),
      enquiryType || 'General Enquiry',
      message.trim(),
      createdAt
    );

    console.log(`[Contact Submission] Received message from ${fullName.trim()} (${studioName.trim()}, ${email.trim()})`);
    res.json({ success: true, messageId: id });
  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({ error: 'An unexpected error occurred while saving your message. Please try again.' });
  }
});

// ==========================================
// 12. PAYMENTS & SUBSCRIPTIONS
// ==========================================

const paymentLimiter = createRateLimiter(60000, 25); // 25 requests per minute

/**
 * 12.1 CREATE ORDER
 * Validates plan selection, calculates authoritative amount, creates Razorpay order.
 */
app.post('/api/payments/create-order', paymentLimiter, requireAuth, async (req, res) => {
  try {
    const { modules, storageGb, selectedStorageId, storageAddon, storageId, studioId, couponCode } = req.body || {};
    const authHeader = req.headers.authorization;
    const userToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    // Support both storageGb number, selectedStorageId, storageAddon, or storageId key
    let storageKey = selectedStorageId || storageAddon || storageId;
    if (!storageKey && storageGb) {
      if (storageGb >= 1000) storageKey = '1tb';
      else if (storageGb >= 500) storageKey = '500gb';
      else if (storageGb >= 200) storageKey = '200gb';
      else if (storageGb >= 50) storageKey = '50gb';
    }

    const orderResult = await createSubscriptionOrder({
      user: req.user,
      studioId: studioId || '',
      modules: Array.isArray(modules) ? modules : [],
      storageId: storageKey || null,
      userToken,
      couponCode
    });

    res.json(orderResult);
  } catch (err) {
    console.error('[Create Order Error]:', err.message);
    res.status(400).json({ error: err.message || 'Failed to initialize payment order.' });
  }
});

/**
 * 12.2 VERIFY PAYMENT & ACTIVATE SUBSCRIPTION
 * Cryptographically verifies Razorpay signature, updates database idempotently.
 */
app.post('/api/payments/verify', paymentLimiter, requireAuth, async (req, res) => {
  try {
    const {
      orderId,
      razorpay_order_id,
      paymentId,
      razorpay_payment_id,
      signature,
      razorpay_signature,
      studioId,
      modules,
      storageGb
    } = req.body || {};

    const authHeader = req.headers.authorization;
    const userToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;

    const verificationResult = await verifySubscriptionPayment({
      user: req.user,
      orderId: orderId || razorpay_order_id,
      paymentId: paymentId || razorpay_payment_id,
      signature: signature || razorpay_signature,
      studioId,
      modules,
      storageGb,
      userToken
    });

    res.json(verificationResult);
  } catch (err) {
    console.error('[Payment Verification Error]:', err.message);
    res.status(400).json({ error: err.message || 'Payment signature verification failed.' });
  }
});

/**
 * 12.3 WEBHOOK HANDLER
 * Validates HMAC signature on raw body buffer.
 */
app.post('/api/payments/webhook', async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = req.rawBody;

  if (!rawBody || !signature) {
    return res.status(400).json({ error: 'Missing raw payload or webhook signature' });
  }

  const isValid = verifyWebhookSignature(rawBody, signature);
  if (!isValid) {
    console.warn('[Webhook] Rejected invalid signature from:', req.ip);
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }

  try {
    const event = JSON.parse(rawBody.toString('utf8'));
    console.log(`[Webhook Event Received]: ${event.event} ID: ${event.payload?.payment?.entity?.id || 'N/A'}`);

    // Record webhook audit log
    db.prepare(`
      INSERT INTO payment_audit_logs (id, order_id, payment_id, event_type, details_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      `hook_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
      event.payload?.payment?.entity?.order_id || null,
      event.payload?.payment?.entity?.id || null,
      `WEBHOOK_${event.event}`,
      JSON.stringify(event.payload || {}),
      new Date().toISOString()
    );

    res.json({ received: true });
  } catch (err) {
    console.error('[Webhook Processing Error]:', err.message);
    res.status(500).json({ error: 'Failed to process webhook event' });
  }
});

/**
 * 12.4 SUBSCRIPTION STATUS
 * Retrieves active subscription, entitlements, and recent billing orders for the authenticated user.
 */
app.get('/api/subscription/status', requireAuth, (req, res) => {
  try {
    const userUid = req.user.uid;
    const sub = db.prepare('SELECT * FROM subscriptions WHERE user_uid = ? ORDER BY created_at DESC LIMIT 1').get(userUid);
    const orders = db.prepare('SELECT * FROM subscription_orders WHERE user_uid = ? ORDER BY created_at DESC LIMIT 10').all(userUid);

    res.json({
      success: true,
      subscription: sub ? {
        id: sub.id,
        status: sub.status,
        planName: sub.plan_name,
        modules: JSON.parse(sub.modules_json || '[]'),
        storageQuotaGb: sub.storage_quota_gb,
        currentPeriodStart: sub.current_period_start,
        currentPeriodEnd: sub.current_period_end
      } : null,
      recentOrders: orders.map(o => ({
        id: o.id,
        orderId: o.order_id,
        paymentId: o.payment_id,
        amount: o.amount_paise / 100,
        currency: o.currency,
        status: o.status,
        modules: JSON.parse(o.modules_json || '[]'),
        storageGb: o.storage_gb,
        createdAt: o.created_at
      }))
    });
  } catch (err) {
    console.error('[Subscription Status Error]:', err.message);
    res.status(500).json({ error: 'Failed to retrieve subscription status.' });
  }
});

/**
 * 12.5 CANCEL SUBSCRIPTION
 * Sets subscription to cancel at period end.
 */
app.post('/api/subscription/cancel', requireAuth, (req, res) => {
  try {
    const userUid = req.user.uid;
    const now = new Date().toISOString();

    db.prepare(`
      UPDATE subscriptions 
      SET status = 'cancelled', updated_at = ?
      WHERE user_uid = ? AND status = 'active'
    `).run(now, userUid);

    db.prepare(`
      INSERT INTO payment_audit_logs (id, event_type, details_json, created_at)
      VALUES (?, ?, ?, ?)
    `).run(
      `audit_cancel_${Date.now()}`,
      'SUBSCRIPTION_CANCELLED',
      JSON.stringify({ userUid }),
      now
    );

    res.json({ success: true, message: 'Subscription successfully scheduled for cancellation.' });
  } catch (err) {
    console.error('[Subscription Cancel Error]:', err.message);
    res.status(500).json({ error: 'Failed to cancel subscription.' });
  }
});

// ==========================================
// 13. DESKTOP SOFTWARE MULTI-DEVICE LICENSING (PHASE 7)
// ==========================================

const MAX_SIMULTANEOUS_DEVICES = 3;

/**
 * 13.1 ACTIVATE DEVICE
 * Binds desktop PC to customer subscription
 */
app.post('/api/license/activate-device', requireAuth, (req, res) => {
  try {
    const userUid = req.user.uid;
    const { deviceId, deviceName, osInfo } = req.body || {};
    if (!deviceId || !deviceId.trim()) {
      return res.status(400).json({ error: 'Hardware deviceId is required.' });
    }

    const cleanDeviceId = deviceId.trim();
    const studio = getOrCreateStudioForUser(req.user);

    // Verify active subscription
    const sub = getActiveSubscription(userUid);
    if (!sub) {
      return res.status(403).json({
        success: false,
        isLicensed: false,
        reason: 'NO_ACTIVE_SUBSCRIPTION',
        message: 'No active ManageStudio subscription found for this account. Please subscribe on managestudio.io.'
      });
    }

    const activeDevices = db.prepare("SELECT * FROM device_activations WHERE user_uid = ? AND is_active = 1").all(userUid);
    const existingThisDevice = db.prepare("SELECT * FROM device_activations WHERE user_uid = ? AND device_id = ?").get(userUid, cleanDeviceId);

    const now = new Date().toISOString();

    if (existingThisDevice && existingThisDevice.is_active === 1) {
      // Refresh heartbeat
      db.prepare("UPDATE device_activations SET last_active_at = ?, device_name = ?, os_info = ? WHERE id = ?").run(
        now,
        deviceName || existingThisDevice.device_name,
        osInfo || existingThisDevice.os_info,
        existingThisDevice.id
      );
    } else {
      // Check device activation limit (Policy: 3 simultaneous active PCs)
      if (activeDevices.length >= MAX_SIMULTANEOUS_DEVICES) {
        return res.status(403).json({
          success: false,
          isLicensed: false,
          deviceLimitReached: true,
          maxDevices: MAX_SIMULTANEOUS_DEVICES,
          message: `Simultaneous device limit (${MAX_SIMULTANEOUS_DEVICES} PCs) reached. Please deactivate an older PC to use ManageStudio here.`,
          activeDevices: activeDevices.map(d => ({
            id: d.id,
            deviceId: d.device_id,
            deviceName: d.device_name,
            osInfo: d.os_info,
            lastActiveAt: d.last_active_at
          }))
        });
      }

      if (existingThisDevice) {
        // Reactivate
        db.prepare("UPDATE device_activations SET is_active = 1, last_active_at = ?, device_name = ?, os_info = ? WHERE id = ?").run(
          now,
          deviceName || existingThisDevice.device_name,
          osInfo || existingThisDevice.os_info,
          existingThisDevice.id
        );
      } else {
        // Insert new activation
        db.prepare(`
          INSERT INTO device_activations (id, user_uid, studio_id, device_id, device_name, os_info, is_active, last_active_at, created_at)
          VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)
        `).run(
          `dev_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
          userUid,
          studio?.id || '',
          cleanDeviceId,
          deviceName || 'Windows PC',
          osInfo || 'Desktop',
          now,
          now
        );
      }
    }

    const currentCount = db.prepare("SELECT COUNT(*) as count FROM device_activations WHERE user_uid = ? AND is_active = 1").get(userUid).count;

    res.json({
      success: true,
      isLicensed: true,
      deviceId: cleanDeviceId,
      maxDevices: MAX_SIMULTANEOUS_DEVICES,
      activeDevicesCount: currentCount,
      subscription: {
        id: sub.id,
        planName: sub.plan_name,
        modules: JSON.parse(sub.modules_json || '[]'),
        storageQuotaGb: sub.storage_quota_gb,
        expiresAt: sub.current_period_end
      }
    });
  } catch (err) {
    console.error('Device activation error:', err);
    res.status(500).json({ error: 'Failed to activate device license.' });
  }
});

/**
 * 13.2 DEACTIVATE DEVICE
 */
app.post('/api/license/deactivate-device', requireAuth, (req, res) => {
  try {
    const userUid = req.user.uid;
    const { deviceId } = req.body || {};
    if (!deviceId) {
      return res.status(400).json({ error: 'deviceId is required.' });
    }

    db.prepare("UPDATE device_activations SET is_active = 0 WHERE user_uid = ? AND device_id = ?").run(
      userUid,
      deviceId.trim()
    );

    res.json({ success: true, message: 'Device successfully deactivated.' });
  } catch (err) {
    console.error('Device deactivation error:', err);
    res.status(500).json({ error: 'Failed to deactivate device.' });
  }
});

/**
 * 13.3 VERIFY DEVICE LICENSE & ENTITLEMENTS
 */
app.get('/api/license/verify', requireAuth, (req, res) => {
  try {
    const userUid = req.user.uid;
    const deviceId = req.query.deviceId || req.headers['x-device-id'];

    const sub = getActiveSubscription(userUid);
    if (!sub) {
      return res.json({
        success: true,
        isLicensed: false,
        reason: 'NO_ACTIVE_SUBSCRIPTION',
        message: 'No active subscription found.'
      });
    }

    // If deviceId provided, verify device is active
    if (deviceId) {
      const dev = db.prepare("SELECT * FROM device_activations WHERE user_uid = ? AND device_id = ? AND is_active = 1").get(userUid, String(deviceId).trim());
      if (!dev) {
        return res.json({
          success: true,
          isLicensed: false,
          reason: 'DEVICE_NOT_ACTIVATED',
          message: 'This device is not activated for this subscription.'
        });
      }
      // Update last active
      db.prepare("UPDATE device_activations SET last_active_at = ? WHERE id = ?").run(new Date().toISOString(), dev.id);
    }

    res.json({
      success: true,
      isLicensed: true,
      modules: JSON.parse(sub.modules_json || '[]'),
      storageQuotaGb: sub.storage_quota_gb,
      expiresAt: sub.current_period_end
    });
  } catch (err) {
    console.error('License verify error:', err);
    res.status(500).json({ error: 'Failed to verify license.' });
  }
});

/**
 * 13.4 LIST ALL REGISTERED DEVICES FOR CUSTOMER
 */
app.get('/api/license/devices', requireAuth, (req, res) => {
  try {
    const userUid = req.user.uid;
    const devices = db.prepare("SELECT * FROM device_activations WHERE user_uid = ? ORDER BY created_at DESC").all(userUid);
    res.json({
      success: true,
      devices: devices.map(d => ({
        id: d.id,
        deviceId: d.device_id,
        deviceName: d.device_name,
        osInfo: d.os_info,
        isActive: d.is_active === 1,
        lastActiveAt: d.last_active_at,
        createdAt: d.created_at
      }))
    });
  } catch (err) {
    console.error('List devices error:', err);
    res.status(500).json({ error: 'Failed to list devices.' });
  }
});

// Serve production built client if available
const clientDist = path.join(__dirname, '..', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/storage')) {
      return next();
    }
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// 404 Handler for unmatched /api routes (guarantee JSON, never HTML)
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: `API route ${req.method} ${req.path} not found.` });
});

// Global production-safe error handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err.message);
  const isProd = process.env.NODE_ENV === 'production';
  res.status(err.status || 500).json({
    error: isProd ? 'An unexpected error occurred. Please try again later.' : (err.message || 'Internal server error.')
  });
});

export { app };

const isDirectRun = process.argv[1] && (
  process.argv[1].endsWith('server\\index.js') || 
  process.argv[1].endsWith('server/index.js')
);

if (!isServerless && (isDirectRun || (process.env.NODE_ENV !== 'test' && !process.env.TEST_SUITE))) {
  app.listen(PORT, () => {
    console.log(`[STUDIO SELECT 1.0 Server] Running on http://localhost:${PORT}`);
  });
}
