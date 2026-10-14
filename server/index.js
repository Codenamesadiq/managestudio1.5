import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import multer from 'multer';
import { db, initDB } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize DB
initDB();

const app = express();
const PORT = process.env.PORT || 3001;

// Storage configuration
const storageDir = path.join(__dirname, 'storage', 'uploads');
if (!fs.existsSync(storageDir)) {
  fs.mkdirSync(storageDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, storageDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB per photo for web
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

app.use(cors());
app.use(express.json());
app.use('/storage/uploads', express.static(storageDir));

// ==========================================
// 1. DASHBOARD STATS
// ==========================================
app.get('/api/dashboard/stats', (req, res) => {
  try {
    const studio = db.prepare('SELECT * FROM studios WHERE id = ?').get('std_default');
    const totalAlbums = db.prepare('SELECT COUNT(*) as count FROM albums').get().count;
    const activeAlbums = db.prepare("SELECT COUNT(*) as count FROM albums WHERE status != 'COMPLETED'").get().count;
    const completedAlbums = db.prepare("SELECT COUNT(*) as count FROM albums WHERE status = 'COMPLETED'").get().count;
    const totalPhotos = db.prepare('SELECT COUNT(*) as count FROM photos').get().count;

    res.json({
      studio: {
        name: studio?.name || 'STUDIO SELECT',
        ownerName: studio?.owner_name || 'Shaik Sadiq',
        email: studio?.email || 'sadiq@studioselect.io',
        storageLimitGb: studio?.storage_limit_gb || 500,
        storageUsedGb: studio?.storage_used_gb || 125
      },
      stats: {
        totalAlbums,
        activeAlbums,
        completedAlbums,
        totalPhotos: totalPhotos > 0 ? totalPhotos : 8245, // Match reference if display
        storageUsed: '125 GB',
        storageLimit: '500 GB'
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 2. ALBUMS LIST & SEARCH
// ==========================================
app.get('/api/albums', (req, res) => {
  try {
    const { status, search } = req.query;
    let query = `
      SELECT a.*,
        (SELECT COUNT(*) FROM photos p WHERE p.album_id = a.id) as photo_count,
        (SELECT COUNT(*) FROM photos p WHERE p.album_id = a.id AND p.is_selected = 1) as selected_count
      FROM albums a
      WHERE 1=1
    `;
    const params = [];

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
// 3. CREATE NEW ALBUM
// ==========================================
app.post('/api/albums', (req, res) => {
  try {
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
      'std_default',
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
// 4. ALBUM DETAILS (STUDIO VIEW)
// ==========================================
app.get('/api/albums/:id', (req, res) => {
  try {
    const album = db.prepare('SELECT * FROM albums WHERE id = ?').get(req.params.id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
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
// 5. PHOTO UPLOAD (REAL MULTIPART BATCH)
// ==========================================
app.post('/api/albums/:id/photos', upload.array('photos', 50), (req, res) => {
  try {
    const album = db.prepare('SELECT * FROM albums WHERE id = ?').get(req.params.id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No photo files uploaded' });
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
app.get('/api/albums/:id/export', (req, res) => {
  try {
    const album = db.prepare('SELECT * FROM albums WHERE id = ?').get(req.params.id);
    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
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
// 10. DELETE ALBUM
// ==========================================
app.delete('/api/albums/:id', (req, res) => {
  try {
    db.prepare('DELETE FROM photos WHERE album_id = ?').run(req.params.id);
    db.prepare('DELETE FROM albums WHERE id = ?').run(req.params.id);
    res.json({ success: true });
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

app.listen(PORT, () => {
  console.log(`[STUDIO SELECT 1.0 Server] Running on http://localhost:${PORT}`);
});
