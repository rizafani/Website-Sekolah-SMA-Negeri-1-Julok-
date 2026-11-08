import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import fs from 'fs';
import path from 'path';
import firebaseConfig from '../firebase-applet-config.json';

const app = getApps().length === 0
  ? initializeApp({
      projectId: firebaseConfig.projectId,
    })
  : getApps()[0];

const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function seedFirestore() {
  console.log('Seeding Firestore database:', firebaseConfig.firestoreDatabaseId);
  const dbJsonPath = path.resolve('data/db.json');
  if (!fs.existsSync(dbJsonPath)) {
    console.error('data/db.json not found!');
    return;
  }

  const localDb = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));

  // 1. Settings
  await db.collection('settings').doc('main').set(localDb.settings);
  console.log('✓ Seeded settings/main');

  // 2. Users
  for (const u of localDb.users) {
    const { password, ...safeUser } = u;
    await db.collection('users').doc(u.id).set(safeUser);
  }
  console.log(`✓ Seeded ${localDb.users.length} users`);

  // 3. Articles
  for (const art of localDb.articles) {
    await db.collection('articles').doc(art.id).set(art);
  }
  console.log(`✓ Seeded ${localDb.articles.length} articles`);

  // 4. Announcements
  for (const ann of localDb.announcements) {
    await db.collection('announcements').doc(ann.id).set(ann);
  }
  console.log(`✓ Seeded ${localDb.announcements.length} announcements`);

  // 5. Agenda
  for (const ag of localDb.agenda) {
    await db.collection('agenda').doc(ag.id).set(ag);
  }
  console.log(`✓ Seeded ${localDb.agenda.length} agenda items`);

  // 6. Gallery
  for (const gal of localDb.gallery) {
    await db.collection('gallery').doc(gal.id).set(gal);
  }
  console.log(`✓ Seeded ${localDb.gallery.length} gallery items`);

  // 7. PPDB
  for (const reg of localDb.ppdb) {
    await db.collection('ppdb').doc(reg.id).set(reg);
  }
  console.log(`✓ Seeded ${localDb.ppdb.length} PPDB registrations`);

  console.log('Firestore seed completed successfully!');
}

seedFirestore().catch(console.error);
