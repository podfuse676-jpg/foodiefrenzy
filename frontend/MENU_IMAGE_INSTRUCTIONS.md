# Menu Image Customization Guide

## Easiest Way to Add Photos to Menu Items

### Method 1: Direct Image URLs (Easiest)

1. **Upload your images to any image hosting service** (Google Drive, Imgur, Dropbox, etc.)
2. **Get the direct image URL** (should end with .jpg, .png, etc.)
3. **Open the MenuItem.jsx file** at:
   `frontend/src/components/OurMenu/MenuItem.jsx`
4. **Find the customImageMap section** (around line 8)
5. **Add your images like this**:

```javascript
// Custom image mapping - you can add specific images for specific items here
// Format: 'Item Name': 'Direct Image URL'
const customImageMap = {
  // Examples - replace with your actual item names and image URLs:
  'Coffee': 'https://example.com/your-coffee-photo.jpg',
  'Green Tea': 'https://example.com/your-green-tea-photo.jpg',
  'Sandwich': 'https://example.com/your-sandwich-photo.jpg'
  // Add more items as needed
};
```

6. **Save the file and refresh your browser**

### Method 2: Using Google Drive Images

If you're using Google Drive images:

1. **Upload images to Google Drive**
2. **Right-click on each image** and select "Get link"
3. **Change sharing settings** to "Anyone with the link can view"
4. **Copy the sharing link** which looks like:
   `https://drive.google.com/file/d/FILE_ID/view?usp=sharing`
5. **Convert it to a direct image URL** by changing it to:
   `https://drive.google.com/uc?id=FILE_ID`
6. **Add to customImageMap** as shown in Method 1

### Method 3: Add Images Directly to Database (Advanced)

For a more permanent solution, you can add images directly to the database:

1. **Go to your admin panel** (http://localhost:5173/admin)
2. **Find the menu items section**
3. **Edit each item** and upload an image
4. **Save changes**

## Quick Examples

### Adding a Single Item Photo:
```javascript
const customImageMap = {
  'Cappuccino': 'https://images.unsplash.com/photo-1551883147-78a65394b65d?w=200'
};
```

### Adding Multiple Item Photos:
```javascript
const customImageMap = {
  'Cappuccino': 'https://images.unsplash.com/photo-1551883147-78a65394b65d?w=200',
  'Espresso': 'https://images.unsplash.com/photo-1514432324607-7c1c5098f441?w=200',
  'Croissant': 'https://images.unsplash.com/photo-1551883147-78a65394b65d?w=200'
};
```

## Troubleshooting

- **Images not showing?** Make sure:
  - Item names match exactly (case-sensitive)
  - Image URLs are direct links (ending in .jpg, .png, etc.)
  - Images are publicly accessible
- **Wrong image?** Check that the item name in quotes exactly matches what appears in the menu

## Need Help?

1. **Check browser console** (F12) for error messages
2. **Verify image URLs** by pasting them directly in your browser
3. **Make sure item names match** exactly as they appear in the menu

The system will automatically use your custom images first, then fall back to database images, and finally to Unsplash images if neither is available.