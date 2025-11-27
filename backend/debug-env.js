// debug-env.js
// Debug script to check environment variables in Railway environment

console.log('=== ENVIRONMENT VARIABLES DEBUG ===');
console.log('All environment variables:');
Object.keys(process.env).sort().forEach(key => {
  if (!key.startsWith('npm_')) { // Skip npm internal variables
    console.log(`  ${key}: ${process.env[key]}`);
  }
});

console.log('\n=== PORT RELATED VARIABLES ===');
console.log('PORT:', process.env.PORT);
console.log('RAILWAY_PORT:', process.env.RAILWAY_PORT);
console.log('npm_config_port:', process.env.npm_config_port);

console.log('\n=== RAILWAY SPECIFIC VARIABLES ===');
Object.keys(process.env).filter(key => key.startsWith('RAILWAY_')).forEach(key => {
  console.log(`  ${key}: ${process.env[key]}`);
});

console.log('\n=== HEALTH CHECK VARIABLES ===');
console.log('HEALTHCHECK_PATH:', process.env.HEALTHCHECK_PATH);
console.log('HEALTHCHECK_TIMEOUT:', process.env.HEALTHCHECK_TIMEOUT);

console.log('\n=== DEBUG COMPLETE ===');