# Manual MongoDB Update Instructions

If you prefer to update the database manually, you can use these MongoDB commands:

## Method 1: Using MongoDB Shell

Connect to your MongoDB database and run these commands:

```javascript
// Update Dashboard Polish
db.items.updateOne(
  { name: "Dashboard Polish" },
  {
    $set: {
      imageUrl:
        "https://res.cloudinary.com/dfjypp016/image/upload/v1761670243/foodiefrenzy_items/foodiefrenzy_items/Dashboard_Polish_1761670242267.webp",
    },
  }
);

// Update Car Perfume
db.items.updateOne(
  { name: "Car Perfume" },
  {
    $set: {
      imageUrl:
        "https://res.cloudinary.com/dfjypp016/image/upload/v1761670308/foodiefrenzy_items/foodiefrenzy_items/Car_Perfume_1761670306659.webp",
    },
  }
);
```

## Method 2: Using MongoDB Compass

1. Open MongoDB Compass and connect to your database
2. Navigate to the "items" collection
3. Find the "Dashboard Polish" document and update its `imageUrl` field to:
   ```
   https://res.cloudinary.com/dfjypp016/image/upload/v1761670243/foodiefrenzy_items/foodiefrenzy_items/Dashboard_Polish_1761670242267.webp
   ```
4. Find the "Car Perfume" document and update its `imageUrl` field to:
   ```
   https://res.cloudinary.com/dfjypp016/image/upload/v1761670308/foodiefrenzy_items/foodiefrenzy_items/Car_Perfume_1761670306659.webp
   ```

## Verification

After updating, you can verify the changes by running:

```javascript
// Check Dashboard Polish
db.items.findOne({ name: "Dashboard Polish" }, { name: 1, imageUrl: 1 });

// Check Car Perfume
db.items.findOne({ name: "Car Perfume" }, { name: 1, imageUrl: 1 });
```

These commands should return documents with the correct image URLs.
