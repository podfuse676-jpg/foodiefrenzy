// Test file to verify nodemailer can be imported
try {
  import('nodemailer')
    .then(() => {
      console.log('✅ nodemailer imported successfully');
      process.exit(0);
    })
    .catch((err) => {
      console.error('❌ Error importing nodemailer:', err.message);
      process.exit(1);
    });
} catch (err) {
  console.error('❌ Unexpected error:', err.message);
  process.exit(1);
}