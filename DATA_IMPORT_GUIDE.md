# Data Import Guide

This guide explains how to import grocery items from Excel files into the Lakeshore Convenience database.

## Prerequisites

1. Python 3.x installed
2. Virtual environment set up in the project root directory
3. Required Python packages installed:
   ```bash
   pip install pandas openpyxl
   ```

## Setting up the Virtual Environment

If you haven't already set up the virtual environment:

```bash
cd /path/to/FOODIEFRENZY
python3 -m venv venv
source venv/bin/activate
pip install pandas openpyxl
```

## Excel File Format

The import script expects two Excel files in the project root directory:

1. `lakeshore convenience item.xlsx` - Contains convenience store items
2. `lakeshore food menu.xlsx` - Contains food menu items

### Convenience Items Format

The convenience items Excel file should have columns:

- Name (required)
- Price (required)
- Cost (optional)
- Alternate Name (optional)
- Product Code (optional)
- SKU (optional)

### Food Menu Format

The food menu Excel file should have columns:

- ITEM (required)
- PRICE (required)
- Description (optional)
- Flavour Options (optional)
- GST (5%) (optional)

## Running the Import

To import data from the Excel files:

1. Ensure the Excel files are in the project root directory
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Run the import script:
   ```bash
   node importFromExcel.js
   ```

## What the Script Does

1. Reads both Excel files using Python pandas
2. Processes and cleans the data
3. Converts items to the proper format for the database
4. Connects to MongoDB using the existing connection configuration
5. Imports items, updating existing ones and adding new ones
6. Provides a summary of the import process

## Troubleshooting

### File Not Found Errors

Ensure the Excel files are in the project root directory and have the exact names:

- `lakeshore convenience item.xlsx`
- `lakeshore food menu.xlsx`

### Python Module Errors

Make sure you've installed the required Python packages in your virtual environment:

```bash
source venv/bin/activate
pip install pandas openpyxl
```

### Database Connection Issues

Check that your MongoDB connection is properly configured in the `.env` file in the backend directory.

## Verifying the Import

To verify that items were imported correctly, you can run:

```bash
cd backend
node checkItems.js
```

This will show the total number of items and sample items from each category.
