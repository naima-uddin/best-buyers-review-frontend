# Products Management Routes

## Overview
A complete product management system with dedicated routes, clean shadcn design, and responsive UI.

## Routes Structure

```
/dashboard                          - Dashboard home with statistics
├── /products                       - Products listing page (main)
│   ├── /create                     - Create new product
│   └── /[id]/edit                  - Edit existing product
├── /categories                     - Categories management
└── /users                          - User management
```

## Features

### 1. Products Listing Page (`/dashboard/products`)
- **Clean Table View**: Shows all products with pagination
- **Product Information**:
  - Product image thumbnail
  - Title and ASIN
  - Brand
  - Price (with discount display)
  - Rating and review count
  - Status badges (Featured, Full Review, Coupon)
- **Actions**:
  - Edit button - Navigate to edit page
  - Delete button - Remove product
  - Add Product button - Navigate to create page
- **Search**: Search by title, brand, or ASIN
- **Pagination**: Navigate through pages of products
- **Responsive Design**: Mobile, tablet, and desktop friendly

### 2. Create Product Page (`/dashboard/products/create`)
- Full product creation form
- Category selection
- All product fields available
- Back to products navigation
- Form validation

### 3. Edit Product Page (`/dashboard/products/[id]/edit`)
- Load existing product data
- Update all product fields
- Category management
- Save changes and return to list
- Cancel option

### 4. Dashboard Layout
- **Sidebar Navigation**:
  - Dashboard (home)
  - Products
  - Categories
  - Users
- **Mobile Responsive**: Hamburger menu on mobile
- **Role-based Access**: Shows menu items based on user role
- **Logout**: Easy logout option
- **Active Route Highlighting**: Current page highlighted in nav

## UI Components (Shadcn)

### New Components Created
- `Table.jsx` - Data table with header, body, rows, cells
- `Card.jsx` - Card container with header, title, description, content
- `Badge.jsx` - Status badges with variants (default, success, warning, outline)
- `Button.jsx` - Updated with named export

## Design Features

✅ **Clean & Modern**: Minimalist design with proper spacing
✅ **Responsive**: Works on all screen sizes
✅ **User-Friendly**: Intuitive navigation and actions
✅ **Consistent**: Uses shadcn design system throughout
✅ **Accessible**: Proper labels, ARIA attributes, and keyboard navigation
✅ **Performance**: Optimized with proper Next.js patterns

## Navigation Flow

```
Dashboard Home
  ↓
Products Page (Table View)
  ├→ Add Product → Create Page → Back to Products
  └→ Edit Product → Edit Page → Back to Products
```

## Technical Details

- **Framework**: Next.js 15.5.5 with App Router
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Authentication**: Token-based with localStorage
- **API Integration**: REST API with Authorization headers
- **State Management**: React hooks (useState, useEffect)
- **Routing**: Next.js navigation (useRouter, usePathname)

## API Endpoints Used

- `GET /products?page={page}&limit={limit}` - Fetch products
- `GET /products/{asin}` - Get single product
- `PATCH /products/{asin}` - Update product
- `DELETE /products/{asin}` - Delete product
- `GET /categories` - Fetch categories

## Mobile Responsiveness

- **Sidebar**: Converts to hamburger menu on mobile
- **Table**: Horizontal scroll on small screens
- **Cards**: Stack vertically on mobile
- **Buttons**: Touch-friendly sizing
- **Forms**: Full-width inputs on mobile

## Build Status

✅ Build successful
✅ All routes working
✅ Components properly exported
✅ TypeScript validation passing
✅ Linting successful

## Usage

### Access the Products Page
```
Navigate to: /dashboard/products
```

### Create a New Product
```
1. Click "Add Product" button
2. Fill in product details
3. Click "Create Product"
```

### Edit a Product
```
1. Click edit icon on product row
2. Modify product details
3. Click "Update Product"
```

### Delete a Product
```
1. Click delete icon on product row
2. Confirm deletion
```

## Future Enhancements

- Bulk actions (select multiple products)
- Export to CSV
- Advanced filters (by category, price range, rating)
- Product duplication
- Image upload functionality
- Drag-and-drop for image reordering
- Real-time search with debouncing
- Product preview modal
