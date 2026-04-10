# Order Page - Implementation & Integration Guide

## 📋 Overview

The Order Page has been redesigned with modular components, responsive layout, and clear separation of concerns. All components are frontend-ready and fully typed with TypeScript.

## 🏗️ Component Architecture

### **OrderPage** (`src/app/order/page.tsx`)
Main page component that orchestrates the layout and state management.

**Features:**
- Two-column layout (menu grid left, order summary right)
- Responsive: Single column on mobile, stacked layout on tablet, 2-col on desktop
- Category filtering with active state
- Modal-based customization flow
- Integration with `useOrder()` hook for global order state

**State:**
- `activeCategory`: Currently selected menu category
- `selectedItem`: Menu item selected for customization
- `isModalOpen`: Customization modal visibility
- `qrInput`: QR token/order ID input value
- `orderSummaryCollapsed`: Mobile collapse state of order summary
- `isCheckingOut`: Loading state during checkout

**Key Callbacks:**
- `handleOrderClick()`: Opens customization modal for selected item
- `handleCheckout()`: Triggers checkout process (TODO: integrate payment)
- `handleModifyOrder()`: Allows reordering/modifications (TODO: implement flow)

---

### **OrderSummary** (`src/components/OrderSummary.tsx`)
Comprehensive order summary panel with collapsible mobile support.

**Props:**
```typescript
interface OrderSummaryProps {
  isCollapsed?: boolean;
  onCollapseChange?: (collapsed: boolean) => void;
  onCheckout?: () => void;
  onModify?: () => void;
  qrValue?: string;
  onQrChange?: (value: string) => void;
  isLoading?: boolean;
}
```

**Features:**
- Sticky positioning on desktop (lg:sticky)
- Collapsible header on mobile with chevron indicator
- Real-time item list from `useOrder()` hook
- Automatic price calculation including customization add-ons
- QR token input integration
- Action buttons: Checkout (primary), Modify Order (secondary)
- Empty state with helpful messaging
- Responsive scrolling for items list

**Styling Notes:**
- Uses design system colors: `bg-dark`, `primary-brown`, `secondary-gold`
- Gradient button backgrounds for visual hierarchy
- Smooth transitions and hover effects
- Scrollbar customization for clean appearance

---

### **OrderItemRow** (`src/components/OrderItemRow.tsx`)
Individual order item display component used in OrderSummary list.

**Props:**
```typescript
interface OrderItemRowProps {
  orderItemId: string;
  menuItemName: string;
  menuItemPrice: string;
  quantity: number;
  customizations: OrderItemCustomization[];
  notes?: string;
  onRemove: (id: string) => void;
}
```

**Features:**
- Compact layout with clear information hierarchy
- Item name, quantity, price in header
- Customizations list with price adjustments
- Special notes/instructions display
- Remove button with hover feedback
- Responsive text sizing (smaller on mobile)
- Accessible aria-labels and tooltips

---

### **QRTokenInput** (`src/components/QRTokenInput.tsx`)
Dedicated component for QR code token input with future scanning support.

**Props:**
```typescript
interface QRTokenInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  onScan?: () => void;
}
```

**Features:**
- Clean input field with QR icon and label
- Optional scan button placeholder (for future camera integration)
- Focus state styling with gold accent
- Helper text for user guidance
- Disabled state support for processing
- Fully accessible with proper labels

**Future Enhancement:**
- Integrate Web Camera API for QR scanning
- Support for multiple input methods (camera, manual entry)
- QR validation and error handling

---

### **MenuItemCard** (`src/components/MenuItemCard.tsx`)
Reusable card component for displaying individual menu items.

**Props:**
```typescript
interface MenuItemCardProps {
  item: MenuItem;
  onOrderClick: (item: MenuItem) => void;
  isLoading?: boolean;
}
```

**Features:**
- Image with hover scale-up effect
- Item name, description, price display
- Order button with shopping cart icon
- Loading and disabled states
- Responsive text sizing (lg md:text-xl)
- Consistent styling with ProductGrid component
- Dark theme suitable for any background

---

### **CustomizationModal** (`src/components/CustomizationModal.tsx`)
Modal for customizing menu items before adding to order.

**Features:**
- Quantity selector (Plus/Minus buttons)
- Multiple customization categories
- Price extraction from option labels (+5K format)
- Special notes textarea
- Real-time total price calculation
- Responsive modal sizing
- Smooth animations and backdrop

---

## 🎨 Design System Consistency

| Element | Value | Usage |
|---------|-------|-------|
| **Primary Brown** | #8B4513 | Buttons, active states, accents |
| **Secondary Gold** | #D2B48C | Prices, highlights, secondary accents |
| **Dark BG** | #121212 | Card backgrounds, modals |
| **Light Gray** | #1A1A1A | Secondary backgrounds |
| **Font: Sans** | Montserrat | Body text, labels |
| **Font: Script** | Playball | Headings, branding |
| **Border Radius** | 3xl/2xl/lg | Cards, buttons, inputs |
| **Shadow** | shadow-lg/shadow-xl | Cards, modals, buttons on hover |
| **Spacing** | 4px/6px/8px units | Consistent padding and gaps |

---

## 📱 Responsive Breakpoints

### **Mobile (< 640px)**
```
┌─────────────────────┐
│     NAVBAR          │
├─────────────────────┤
│   Page Header       │
├─────────────────────┤
│  Category Tabs      │ (horizontal scroll)
│  (overflow-x auto)  │
├─────────────────────┤
│  Menu Grid (1 col)  │
│  [Item1]            │
│  [Item2]            │
│  ...                │
├═════════════════════┤ (collapse header)
│ Order Summary       │
│ (collapsible)       │
│ - Items List        │
│ - Total Price       │
│ - QR Input          │
│ - Buttons           │
├─────────────────────┤
│     FOOTER          │
└─────────────────────┘
```

### **Tablet (640px - 1024px)**
```
┌──────────────────────────────┐
│        NAVBAR                │
├──────────────────────────────┤
│     Page Header              │
├──────────────────────────────┤
│ Category Tabs (wrap)         │
├────────────────┬─────────────┤
│ Menu Grid 2col │             │
│ [Item1] [Item2]│             │
│ [Item3] [Item4]│  ORDER SUM. │
│ ...            │   (Below)   │
│                │             │
├────────────────┴─────────────┤
│     Order Summary            │
│     (Full Width)             │
├──────────────────────────────┤
│        FOOTER                │
└──────────────────────────────┘
```

### **Desktop (> 1024px)**
```
┌─────────────────────────────────────────┐
│              NAVBAR                     │
├─────────────────────────────────────────┤
│          Page Header                    │
├───────────────────────────┬─────────────┤
│                           │             │
│ Category Tabs             │             │
│ (flex wrap)               │             │
│                           │             │
│ Menu Grid 3-4 cols        │   ORDER     │
│ ┌──┐ ┌──┐ ┌──┐           │  SUMMARY    │
│ │  │ │  │ │  │           │  (Sticky    │
│ └──┘ └──┘ └──┘           │   top-28)   │
│ ┌──┐ ┌──┐ ┌──┐           │             │
│ │  │ │  │ │  │           │             │
│ └──┘ └──┘ └──┘           │             │
│ ...                       │             │
├───────────────────────────┴─────────────┤
│           FOOTER                        │
└─────────────────────────────────────────┘
```

### **CSS Classes Used:**
- `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` - Menu grid responsiveness
- `overflow-x-auto` - Category tabs scroll on mobile
- `lg:col-span-3` / `lg:col-span-1` - Column spanning for desktop grid
- `lg:sticky lg:top-28` - Sticky sidebar on desktop only
- `lg:max-h-80` - Max height responsive to screen size

---

## 🔄 State Management Flow

```
OrderPage (Local State)
├── activeCategory ──────> displayCategory (computed)
├── selectedItem ────────> CustomizationModal
├── isModalOpen ─────────> CustomizationModal visibility
├── qrInput ─────────────> QRTokenInput
├── orderSummaryCollapsed ──> OrderSummary collapse state
└── isCheckingOut ──────> Checkout loading state

                          ↓

                  useOrder() Hook (Global)
                  ├── orderItems (from OrderContext)
                  ├── addOrderItem() ───────> CustomizationModal confirmation
                  ├── removeOrderItem() ────> OrderItemRow remove button
                  ├── getTotalPrice()
                  ├── getTotalItems()
                  └── qrToken (future)

                          ↓

                    Render Components
                    ├── MenuItemCard Grid
                    ├── OrderSummary (with nested components)
                    │   ├── OrderItemRow (mapped)
                    │   ├── QRTokenInput
                    │   └── Action Buttons
                    └── CustomizationModal
```

---

## 🚀 Future Integration Checklist

### **Backend Integration**
- [ ] Replace `/data/menuData.ts` static data with API call
- [ ] Fetch menu categories and items from backend on page load
- [ ] Add loading/error states during menu fetch
- [ ] Validate QR token against backend during input
- [ ] Send order to backend on checkout

### **Payment Integration**
- [ ] Integrate Stripe/payment aggregator in `handleCheckout()`
- [ ] Add payment method selection (card, e-wallet, QR code)
- [ ] Handle payment success/failure responses
- [ ] Show order confirmation with order ID/tracking link
- [ ] Implement refund/cancellation flow

### **QR Scanning**
- [ ] Integrate Web Camera API in `QRTokenInput` onScan callback
- [ ] Add barcode/QR code parsing library (e.g., jsQR)
- [ ] Handle camera permission requests
- [ ] Add scan success/error feedback
- [ ] Validate scanned QR against backend

### **Order Management**
- [ ] Create order history page
- [ ] Add real-time order status tracking with QR token
- [ ] Implement order modification flow (handleModifyOrder)
- [ ] Add order cancellation with policies
- [ ] Send order notifications via email/SMS

### **User Authentication**
- [ ] Link orders to user accounts (if logged in)
- [ ] Save favorite orders/quick reorder
- [ ] Implement guest checkout option
- [ ] Add order history for logged-in users

### **Performance & UX**
- [ ] Lazy-load menu images for faster initial load
- [ ] Add pagination/infinite scroll for large menus
- [ ] Implement search/filter functionality
- [ ] Cache menu data with stale-while-revalidate
- [ ] Add skeleton loaders during data fetch
- [ ] Implement PWA with offline order capability

---

## 🧪 Testing Checklist

### **Responsive Layout**
- [x] Mobile (xs): Single column, collapsible summary
- [x] Tablet (md): 2-column grid, responsive spacing
- [x] Desktop (lg): 3-column grid, sticky sidebar
- [x] Orientation change handled correctly
- [x] No horizontal scroll except category tabs

### **Component Functionality**
- [x] Category tabs filter menu items correctly
- [x] MenuItemCard click opens customization modal
- [x] CustomizationModal shows/hides smoothly
- [x] OrderSummary updates in real-time
- [x] OrderItemRow remove button deletes item
- [x] Price calculation includes customization add-ons
- [x] Mobile collapse/expand works with smooth animation

### **Design & Styling**
- [x] Colors match design system (brown, gold, dark)
- [x] Fonts consistent (Montserrat, Playball)
- [x] Border radius and shadows consistent
- [x] Hover effects work on interactive elements
- [x] Disabled states clearly indicated
- [x] Focus states visible for accessibility

### **Edge Cases**
- [ ] Empty order state (empty summary)
- [ ] Very long item names (text clamp)
- [ ] Multiple customizations (scroll in modal)
- [ ] Large menu (pagination/scroll performance)
- [ ] QR input validation edge cases

---

## 📝 Code Documentation

### **Comments in Code**
Each component includes:
- JSDoc describing props and features
- Inline comments for complex logic
- TODO markers for future integrations
- Design notes for styling decisions

### **Example: CustomizationModal Comments**
```typescript
/**
 * CustomizationModal - Modal for customizing menu items before adding to order
 * 
 * Features:
 * - Select quantity
 * - Add customizations (placeholder options...)
 * - Add special notes/instructions
 * - Real-time price calculation
 * 
 * Future Enhancement:
 * - Replace hardcoded customizations with API call
 * - Add payment integration
 * - Save customizations as templates
 */
```

---

## 🛠️ Development Workflow

### **Adding New Menu Item Features**
1. Update `MenuItem` interface in `menuData.ts`
2. Add display logic in `MenuItemCard` if needed
3. Add customization options in `CustomizationModal` DEFAULT_CUSTOMIZATIONS
4. Update OrderContext if new fields are needed

### **Styling Changes**
1. Maintain design system colors and fonts
2. Use consistent spacing (4px/6px/8px units)
3. Test responsive breakpoints (640px, 1024px)
4. Update component if affecting other pages (check Navbar, ProductGrid)

### **State Management Updates**
1. Modify OrderContext.tsx for new state fields
2. Update useOrder() hook consumers
3. Ensure TypeScript types are updated
4. Test with multiple items and customizations

---

## 📞 Support & Questions

For backend integration details:
- Coordinate with API team on menu data structure
- Define order payload format
- Plan QR code generation/validation
- Discuss payment gateway requirements

---

**Last Updated:** April 10, 2026  
**Version:** 1.0 (Frontend Ready)  
**Status:** ✅ Fully functional, responsive, type-safe
