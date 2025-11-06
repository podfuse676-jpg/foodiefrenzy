# Cloudinary Setup Instructions

## Step 1: Find Your Exact Cloudinary Credentials

Based on our testing, it appears that your cloud name is not "lakeshore" or "Lakeshore". To find your exact Cloudinary credentials:

1. Log in to your Cloudinary account at [https://cloudinary.com/](https://cloudinary.com/)
2. Go to your Cloudinary Dashboard
3. Look at the URL in your browser - it should look like:
   `https://console.cloudinary.com/console/c-<your-cloud-name>`
4. The part after `c-` is your exact cloud name
5. Alternatively, look for the "Cloud name" field in your Account Details section

## Step 2: Update Your Environment Variables

Open the `.env` file in your backend directory and replace the placeholder values:

```env
# Replace 'your_exact_cloudinary_cloud_name' with your actual cloud name from the dashboard
CLOUDINARY_CLOUD_NAME=your_exact_cloudinary_cloud_name
CLOUDINARY_API_KEY=645785246981482
CLOUDINARY_API_SECRET=A9rs3IOJK9TEcVNUOm7Dwrg2nlI
```

## Step 3: Verify Your Credentials

After updating your credentials, test the connection:

```bash
cd backend
node testCloudinary.js
```

You should see a "Cloudinary Connection Success" message.

## Step 4: Run the Migration Script

Once your credentials are verified, run the migration script to move existing local images to Cloudinary:

```bash
cd backend
node migrateToCloudinary.js
```

## Step 5: Test the Setup

Start your server and test image uploads:

```bash
npm start
```

Then try uploading an image through the admin panel or API.

## Troubleshooting

If you encounter issues:

1. **"cloud_name mismatch" error**: Your cloud name is incorrect. Double-check the exact cloud name from your Cloudinary dashboard.
2. **401 Unauthorized error**: Your API key or secret is incorrect.
3. Check that you have internet connectivity
4. Verify that the Cloudinary package is installed: `npm list cloudinary`
5. Check the server logs for any error messages

## Benefits of Using Cloudinary

- **Persistent Storage**: Images won't be lost when the server restarts
- **Automatic Optimization**: Cloudinary automatically optimizes images for faster loading
- **Responsive Images**: Automatic generation of different image sizes
- **Global CDN**: Images are served from the closest server to the user
- **Transformations**: Easy image manipulation (cropping, resizing, filters, etc.)
