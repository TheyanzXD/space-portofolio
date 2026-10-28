import test from 'node:test';
import assert from 'node:assert/strict';
import { portfolioData } from '../data/portfolio';
import {
  filterProjects,
  filterSkillCategories,
  computeSkillSummary,
  validateContactInput,
  checkRateLimit,
} from './portfolio-logic';

test('filterProjects memfilter kategori dan batas tampilan awal dengan benar untuk proyek GitHub TheyanzXD', () => {
  const allResult = filterProjects(portfolioData.projects, 'Semua', false, 6);
  assert.equal(allResult.visibleProjects.length, 6);
  assert.equal(allResult.totalFiltered, 8);
  assert.equal(allResult.hasMore, true);

  const expandedResult = filterProjects(portfolioData.projects, 'Semua', true, 6);
  assert.equal(expandedResult.visibleProjects.length, 8);

  const webOnly = filterProjects(portfolioData.projects, 'Web', false, 6);
  assert.equal(
    webOnly.visibleProjects.every((p) => p.kategori === 'Web'),
    true,
  );
  assert.equal(webOnly.hasMore, false);
});

test('filterSkillCategories dan computeSkillSummary menghitung metrik dengan akurat', () => {
  const allCategories = filterSkillCategories(portfolioData.skills, 'Semua');
  assert.equal(allCategories.length, 4);

  const frontendOnly = filterSkillCategories(portfolioData.skills, 'Frontend');
  assert.equal(frontendOnly.length, 1);
  assert.equal(frontendOnly[0].id, 'Frontend');

  const summary = computeSkillSummary(frontendOnly);
  assert.equal(summary.totalSkills, 4);
  assert.equal(summary.averageLevel > 85, true);
  assert.equal(summary.topSkill.length > 0, true);
});

test('validateContactInput menolak form kosong atau tidak valid dan mendeteksi honeypot', () => {
  const emptyCheck = validateContactInput({
    nama: '',
    email: 'bukan-email',
    subjek: 'Hi',
    pesan: 'Pendek',
  });
  assert.equal(emptyCheck.valid, false);
  assert.equal(Boolean(emptyCheck.errors.nama), true);
  assert.equal(Boolean(emptyCheck.errors.email), true);
  assert.equal(Boolean(emptyCheck.errors.subjek), true);
  assert.equal(Boolean(emptyCheck.errors.pesan), true);

  const spamCheck = validateContactInput({
    nama: 'Bot',
    email: 'bot@spam.com',
    subjek: 'Penawaran palsu',
    pesan: 'Pesan panjang dari bot otomatis untuk pengujian.',
    honeypot: 'http://spam-link.com',
  });
  assert.equal(spamCheck.isSpam, true);
  assert.equal(spamCheck.valid, false);

  const validCheck = validateContactInput({
    nama: 'Izyan Danish',
    email: 'theyanzxd2@gmail.com',
    subjek: 'Kolaborasi Proyek Web 3D & AI Gateway',
    pesan: 'Halo YanzXD, kami tertarik berdiskusi mengenai integrasi OpenCode Telegram Gateway.',
  });
  assert.equal(validCheck.valid, true);
  assert.equal(validCheck.isSpam, false);
  assert.deepEqual(validCheck.errors, {});
});

test('checkRateLimit membatasi permintaan berlebih dalam jendela waktu', () => {
  const store = new Map<string, number[]>();
  const now = 1_700_000_000_000;

  const r1 = checkRateLimit('127.0.0.1', store, now, 60_000, 2);
  assert.equal(r1.allowed, true);
  assert.equal(r1.remaining, 1);

  const r2 = checkRateLimit('127.0.0.1', store, now + 1000, 60_000, 2);
  assert.equal(r2.allowed, true);
  assert.equal(r2.remaining, 0);

  const r3 = checkRateLimit('127.0.0.1', store, now + 2000, 60_000, 2);
  assert.equal(r3.allowed, false);
  assert.equal(r3.retryAfterSeconds > 0, true);
});
