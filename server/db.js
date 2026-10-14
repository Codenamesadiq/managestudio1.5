import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data', 'studio_select.db');

export const db = new DatabaseSync(dbPath);

// Initialize schema
export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS studios (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      owner_name TEXT NOT NULL,
      email TEXT NOT NULL,
      storage_limit_gb REAL DEFAULT 500.0,
      storage_used_gb REAL DEFAULT 125.0,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      full_name TEXT NOT NULL,
      studio_name TEXT NOT NULL,
      email TEXT NOT NULL,
      enquiry_type TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS albums (
      id TEXT PRIMARY KEY,
      studio_id TEXT NOT NULL,
      name TEXT NOT NULL,
      client_name TEXT NOT NULL,
      wedding_date TEXT,
      description TEXT,
      cover_photo_url TEXT,
      client_token TEXT UNIQUE NOT NULL,
      status TEXT DEFAULT 'IN_PROGRESS', -- 'WAITING', 'IN_PROGRESS', 'COMPLETED'
      max_selections INTEGER DEFAULT 100,
      submitted_at TEXT,
      client_notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS photos (
      id TEXT PRIMARY KEY,
      album_id TEXT NOT NULL,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      url TEXT NOT NULL,
      thumbnail_url TEXT,
      size_bytes INTEGER DEFAULT 2500000,
      width INTEGER DEFAULT 2400,
      height INTEGER DEFAULT 1600,
      is_selected INTEGER DEFAULT 0,
      selected_at TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id TEXT PRIMARY KEY,
      album_id TEXT NOT NULL,
      action TEXT NOT NULL,
      details TEXT,
      created_at TEXT NOT NULL
    );
  `);

  // Check if we need to seed demo data
  const check = db.prepare('SELECT COUNT(*) as count FROM studios').get();
  if (check.count === 0) {
    seedInitialData();
  }
}

function seedInitialData() {
  const now = new Date().toISOString();
  const studioId = 'std_default';

  db.prepare(`
    INSERT INTO studios (id, name, owner_name, email, storage_limit_gb, storage_used_gb, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    studioId,
    'STUDIO SELECT',
    'Shaik Sadiq',
    'sadiq@studioselect.io',
    500.0,
    125.0,
    now
  );

  // Wedding Photos Set with high quality royalty-free photography
  const photoStock = [
    {
      url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      title: 'Zara & Ahmed - Regal Portrait',
      name: 'IMG_9823.jpg',
      size: 3450000
    },
    {
      url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
      title: 'Bridal Henna & Ornate Jewels',
      name: 'IMG_9824.jpg',
      size: 2900000
    },
    {
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      title: 'Floral Mandap Pavilion',
      name: 'IMG_9825.jpg',
      size: 4200000
    },
    {
      url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      title: 'Ceremonial Exchange of Vows',
      name: 'IMG_9826.jpg',
      size: 3100000
    },
    {
      url: 'https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1200&q=80',
      title: 'Golden Hour Couple Elegance',
      name: 'IMG_9827.jpg',
      size: 3800000
    },
    {
      url: 'https://images.unsplash.com/photo-1544077960-604201fe74bc?auto=format&fit=crop&w=1200&q=80',
      title: 'Bride Close Portrait Veil',
      name: 'IMG_9828.jpg',
      size: 2750000
    },
    {
      url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
      title: 'Reception Royal Walkway',
      name: 'IMG_9829.jpg',
      size: 4500000
    },
    {
      url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80',
      title: 'Traditional Gold Maang Tikka',
      name: 'IMG_9830.jpg',
      size: 2600000
    },
    {
      url: 'https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?auto=format&fit=crop&w=1200&q=80',
      title: 'Floral Grand Stage Décor',
      name: 'IMG_9831.jpg',
      size: 4100000
    },
    {
      url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
      title: 'Warm Candlelight Ambiance',
      name: 'IMG_9832.jpg',
      size: 3300000
    },
    {
      url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
      title: 'Floral Centerpiece Details',
      name: 'IMG_9833.jpg',
      size: 2950000
    },
    {
      url: 'https://images.unsplash.com/photo-1529636798458-92182e662485?auto=format&fit=crop&w=1200&q=80',
      title: 'Bride and Groom Hand in Hand',
      name: 'IMG_9834.jpg',
      size: 3200000
    }
  ];

  // Album 1: Zara & Ahmed (Active / In Progress)
  const album1Id = 'alb_zara_ahmed';
  const token1 = 'sel_zara_ahmed_2026';
  db.prepare(`
    INSERT INTO albums (id, studio_id, name, client_name, wedding_date, description, cover_photo_url, client_token, status, max_selections, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    album1Id,
    studioId,
    'Zara & Ahmed',
    'Zara & Ahmed',
    '12 Jan 2026',
    'Grand Royal Palace Wedding celebration in Udaipur. Full ceremony and reception set.',
    photoStock[0].url,
    token1,
    'IN_PROGRESS',
    100,
    now,
    now
  );

  // Insert photos for Zara & Ahmed, with some pre-selected to showcase selection state
  photoStock.forEach((p, idx) => {
    const photoId = `pho_za_${idx + 1}`;
    const isSelected = idx < 4 ? 1 : 0; // First 4 selected
    db.prepare(`
      INSERT INTO photos (id, album_id, filename, original_name, url, size_bytes, is_selected, selected_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      photoId,
      album1Id,
      p.name,
      p.name,
      p.url,
      p.size,
      isSelected,
      isSelected ? now : null,
      now
    );
  });

  // Album 2: Ayesha & Faizan (Waiting for Selection)
  const album2Id = 'alb_ayesha_faizan';
  const token2 = 'sel_ayesha_faizan_2026';
  db.prepare(`
    INSERT INTO albums (id, studio_id, name, client_name, wedding_date, description, cover_photo_url, client_token, status, max_selections, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    album2Id,
    studioId,
    'Ayesha & Faizan',
    'Ayesha & Faizan',
    '08 Jan 2026',
    'Intimate Nikkah and Evening Qawwali Night celebration.',
    photoStock[1].url,
    token2,
    'WAITING',
    80,
    now,
    now
  );

  photoStock.slice(1, 9).forEach((p, idx) => {
    const photoId = `pho_af_${idx + 1}`;
    db.prepare(`
      INSERT INTO photos (id, album_id, filename, original_name, url, size_bytes, is_selected, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      photoId,
      album2Id,
      `AF_${p.name}`,
      `AF_${p.name}`,
      p.url,
      p.size,
      0,
      now
    );
  });

  // Album 3: Sana & Rehan (Selection Completed)
  const album3Id = 'alb_sana_rehan';
  const token3 = 'sel_sana_rehan_2026';
  db.prepare(`
    INSERT INTO albums (id, studio_id, name, client_name, wedding_date, description, cover_photo_url, client_token, status, max_selections, submitted_at, client_notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    album3Id,
    studioId,
    'Sana & Rehan',
    'Sana & Rehan',
    '05 Jan 2026',
    'Destination Wedding at Heritage Fort. High-resolution album selections submitted.',
    photoStock[2].url,
    token3,
    'COMPLETED',
    120,
    now,
    'Hi Sadiq, we have selected our final 35 favorites! Please ensure the stage portraits receive subtle warm toning. Thank you!',
    now,
    now
  );

  photoStock.forEach((p, idx) => {
    const photoId = `pho_sr_${idx + 1}`;
    const isSelected = idx % 2 === 0 ? 1 : 0;
    db.prepare(`
      INSERT INTO photos (id, album_id, filename, original_name, url, size_bytes, is_selected, selected_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      photoId,
      album3Id,
      `SR_${p.name}`,
      `SR_${p.name}`,
      p.url,
      p.size,
      isSelected,
      isSelected ? now : null,
      now
    );
  });
}
