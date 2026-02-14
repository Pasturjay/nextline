const dns = require('dns').promises;
const https = require('https');

const projectRef = 'ecgrsffcndozeztdfjpi';
const apiHost = `${projectRef}.supabase.co`;
const dbHost = `db.${projectRef}.supabase.co`;

async function probe() {
    console.log('--- Network Probe Start ---');

    try {
        console.log(`Checking API Host: ${apiHost}`);
        const apiAddress = await dns.lookup(apiHost);
        console.log(`[API DNS] Success: ${apiAddress.address}`);
    } catch (e) {
        console.log(`[API DNS] Failed: ${e.code}`);
    }

    try {
        console.log(`Checking DB Host: ${dbHost}`);
        const dbAddress = await dns.lookup(dbHost);
        console.log(`[DB DNS] Success: ${dbAddress.address}`);
    } catch (e) {
        console.log(`[DB DNS] Failed: ${e.code}`);
    }

    console.log('--- Network Probe End ---');
}

probe();
