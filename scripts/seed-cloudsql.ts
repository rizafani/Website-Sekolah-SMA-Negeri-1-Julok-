import { db } from '../src/db/index.ts';
import {
  users,
  articles,
  categories,
  announcements,
  agenda,
  gallery,
  schoolSettings,
  visitorStats,
  mediaFiles,
  ppdbRegistrations,
  comments,
  contactMessages,
} from '../src/db/schema.ts';
import { getDb } from '../server/db.ts';

async function seed() {
  console.log('Seeding Cloud SQL from initial dataset...');
  const initial = getDb();

  // 1. Users
  console.log(`Inserting ${initial.users.length} users...`);
  for (const u of initial.users) {
    await db.insert(users).values({
      uid: u.id,
      username: u.username,
      name: u.name,
      role: u.role,
      email: u.email,
      avatar: u.avatar,
      nip: u.nip,
      bio: u.bio,
      password: u.password,
    }).onConflictDoNothing();
  }

  // 2. Categories
  console.log(`Inserting ${initial.categories.length} categories...`);
  for (const c of initial.categories) {
    await db.insert(categories).values({
      name: c.name,
      slug: c.slug,
      description: c.description,
    }).onConflictDoNothing();
  }

  // 3. Articles
  console.log(`Inserting ${initial.articles.length} articles...`);
  for (const a of initial.articles) {
    await db.insert(articles).values({
      slug: a.slug,
      title: a.title,
      content: a.content,
      excerpt: a.excerpt,
      featuredImage: a.featuredImage,
      category: a.category,
      tags: a.tags,
      authorId: a.authorId,
      authorName: a.authorName,
      authorRole: a.authorRole,
      status: a.status,
      views: a.views,
      seoTitle: a.seoTitle,
      metaDescription: a.metaDescription,
      canonicalUrl: a.canonicalUrl,
      ogImage: a.ogImage,
      altImage: a.altImage,
      focusKeyword: a.focusKeyword,
    }).onConflictDoNothing();
  }

  // 4. Announcements
  console.log(`Inserting ${initial.announcements.length} announcements...`);
  for (const ann of initial.announcements) {
    await db.insert(announcements).values({
      title: ann.title,
      content: ann.content,
      date: ann.date,
      fileUrl: ann.fileUrl,
      fileName: ann.fileName,
      authorName: ann.authorName,
      isUrgent: ann.isUrgent,
    });
  }

  // 5. Agenda
  console.log(`Inserting ${initial.agenda.length} agenda items...`);
  for (const agd of initial.agenda) {
    await db.insert(agenda).values({
      title: agd.title,
      date: agd.date,
      endDate: agd.endDate,
      time: agd.time,
      location: agd.location,
      description: agd.description,
      organizer: agd.organizer,
    });
  }

  // 6. Gallery
  console.log(`Inserting ${initial.gallery.length} gallery items...`);
  for (const gal of initial.gallery) {
    await db.insert(gallery).values({
      type: gal.type,
      title: gal.title,
      url: gal.url,
      thumbnail: gal.thumbnail,
      category: gal.category,
      date: gal.date,
      description: gal.description,
    });
  }

  // 7. PPDB
  console.log(`Inserting ${initial.ppdb.length} PPDB registrations...`);
  for (const p of initial.ppdb) {
    await db.insert(ppdbRegistrations).values({
      regNumber: p.regNumber,
      fullName: p.fullName,
      nisn: p.nisn,
      birthPlace: p.birthPlace,
      birthDate: p.birthDate,
      gender: p.gender,
      previousSchool: p.previousSchool,
      phone: p.phone,
      email: p.email,
      parentName: p.parentName,
      parentPhone: p.parentPhone,
      address: p.address,
      chosenTrack: p.chosenTrack,
      status: p.status,
    }).onConflictDoNothing();
  }

  // 8. Comments
  console.log(`Inserting ${initial.comments.length} comments...`);
  for (const com of initial.comments) {
    await db.insert(comments).values({
      articleId: com.articleId,
      articleTitle: com.articleTitle,
      name: com.name,
      email: com.email,
      content: com.content,
      date: com.date,
      status: com.status,
    });
  }

  // 9. School Settings
  console.log('Inserting school settings...');
  await db.insert(schoolSettings).values({
    key: 'main',
    data: initial.settings,
  }).onConflictDoUpdate({
    target: schoolSettings.key,
    set: { data: initial.settings },
  });

  // 10. Visitor Stats
  console.log('Inserting visitor stats...');
  await db.insert(visitorStats).values({
    key: 'main',
    totalVisits: initial.stats.totalVisits,
    todayVisits: initial.stats.todayVisits,
    lastVisitDate: initial.stats.lastVisitDate,
    dailyHistory: initial.stats.dailyHistory,
    deviceBreakdown: initial.stats.deviceBreakdown,
  }).onConflictDoNothing();

  // 11. Media Files
  console.log(`Inserting ${initial.media.length} media files...`);
  for (const m of initial.media) {
    await db.insert(mediaFiles).values({
      name: m.name,
      url: m.url,
      size: m.size,
      type: m.type,
      altText: m.altText,
    });
  }

  console.log('✅ Cloud SQL seeding completed successfully!');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error seeding Cloud SQL:', err);
  process.exit(1);
});
