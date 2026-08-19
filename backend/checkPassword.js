require('dotenv').config();

const pass = process.env.EMAIL_PASS;

console.log('\n🔍 PASSWORD ANALYSIS:\n');
console.log('Raw value:', pass);
console.log('Length:', pass?.length);
console.log('Char codes:', pass ? [...pass].map(c => c.charCodeAt(0)).join(',') : 'N/A');
console.log('Has spaces:', pass ? pass.includes(' ') : false);
console.log('Has tabs:', pass ? pass.includes('\t') : false);
console.log('Has newlines:', pass ? pass.includes('\n') : false);
console.log('Trimmed:', pass ? pass.trim() : 'N/A');
console.log('Trimmed length:', pass ? pass.trim().length : 0);
console.log('\n');

// Show exactly what will be sent
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS (first 4):', pass ? pass.substring(0, 4) : 'N/A');
console.log('EMAIL_PASS (last 4):', pass ? pass.substring(pass.length - 4) : 'N/A');
