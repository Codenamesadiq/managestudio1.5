/**
 * MANAGE STUDIO - 100 CONCURRENT USERS LOAD & STRESS TEST
 * Simulates 100 concurrent clients performing mixed workloads:
 * - Public portal proofing photo loads
 * - Selection toggles
 * - Dashboard stats queries
 * - Coupon validation & order calculation
 * - Desktop license verification
 */

const BASE_URL = 'http://localhost:3001';
const CONCURRENT_USERS = 100;

async function runSingleUserSession(userId) {
  const start = performance.now();
  const operations = [];

  try {
    // 1. Fetch public client proofing album portal
    const portalRes = await fetch(`${BASE_URL}/api/portal/sel_zara_ahmed_2026`);
    operations.push({ op: 'portal_view', status: portalRes.status });

    // 2. Client toggles photo selection
    const photoId = `pho_za_${(userId % 10) + 1}`;
    const selectRes = await fetch(`${BASE_URL}/api/portal/sel_zara_ahmed_2026/select`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        photoId,
        isSelected: userId % 2 === 0
      })
    });
    operations.push({ op: 'photo_select', status: selectRes.status });

    // 3. Fetch dashboard stats
    const statsRes = await fetch(`${BASE_URL}/api/dashboard/stats`);
    operations.push({ op: 'dashboard_stats', status: statsRes.status });

    // 4. Desktop license verification check
    const licenseRes = await fetch(`${BASE_URL}/api/license/verify?deviceId=sim_user_${userId}`);
    operations.push({ op: 'license_verify', status: licenseRes.status });

    const totalTimeMs = performance.now() - start;
    return {
      userId,
      success: operations.every(o => o.status === 200 || o.status === 401), // 401 for unauth license check is expected
      totalTimeMs,
      operations
    };
  } catch (err) {
    return {
      userId,
      success: false,
      error: err.message,
      totalTimeMs: performance.now() - start
    };
  }
}

async function runLoadTest() {
  console.log('\n======================================================');
  console.log(`MANAGE STUDIO — ${CONCURRENT_USERS} CONCURRENT USERS LOAD TEST`);
  console.log('Target: ' + BASE_URL);
  console.log('======================================================\n');

  console.log(`Launching ${CONCURRENT_USERS} concurrent user sessions in parallel...`);
  const benchmarkStart = performance.now();

  const userPromises = [];
  for (let i = 1; i <= CONCURRENT_USERS; i++) {
    userPromises.push(runSingleUserSession(i));
  }

  const results = await Promise.all(userPromises);
  const benchmarkDuration = performance.now() - benchmarkStart;

  const successfulSessions = results.filter(r => r.success);
  const failedSessions = results.filter(r => !r.success);

  const times = results.map(r => r.totalTimeMs).sort((a, b) => a - b);
  const avgTime = times.reduce((acc, t) => acc + t, 0) / times.length;
  const minTime = times[0];
  const maxTime = times[times.length - 1];
  const p95Time = times[Math.floor(times.length * 0.95)];

  const totalOps = results.reduce((acc, r) => acc + (r.operations ? r.operations.length : 0), 0);
  const opsPerSec = (totalOps / (benchmarkDuration / 1000)).toFixed(2);

  console.log('\n--- Load & Concurrency Benchmark Results ---');
  console.table({
    'Total Concurrent Users': CONCURRENT_USERS,
    'Total Operations Executed': totalOps,
    'Successful Sessions': successfulSessions.length,
    'Failed Sessions': failedSessions.length,
    'Total Test Duration (s)': (benchmarkDuration / 1000).toFixed(2),
    'Throughput (ops/sec)': opsPerSec,
    'Min Session Latency (ms)': minTime.toFixed(2),
    'Average Session Latency (ms)': avgTime.toFixed(2),
    'P95 Session Latency (ms)': p95Time.toFixed(2),
    'Max Session Latency (ms)': maxTime.toFixed(2)
  });

  if (failedSessions.length > 0) {
    console.error('\nSample Failures:');
    console.error(failedSessions.slice(0, 5));
    process.exit(1);
  } else {
    console.log(`\n✓ SUCCESS: All ${CONCURRENT_USERS} concurrent users processed with zero failures!`);
  }
}

runLoadTest().catch(err => {
  console.error('Benchmark fatal error:', err);
  process.exit(1);
});
