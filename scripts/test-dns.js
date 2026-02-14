const dns = require('dns');

console.log('Testing DNS resolution...');

// Standard domain
dns.lookup('google.com', (err, address, family) => {
    if (err) console.error('google.com failed:', err.code);
    else console.log('google.com resolved to:', address);
});

// Supabase domain
const supabaseHost = 'db.ecgrsffcndozeztdfjpi.supabase.co';
dns.lookup(supabaseHost, (err, address, family) => {
    if (err) console.error(`${supabaseHost} failed:`, err.code);
    else console.log(`${supabaseHost} resolved to:`, address);
});
