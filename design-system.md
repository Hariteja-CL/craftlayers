# CraftLayers Design System (Truth Source)

## 1. Primitive Collections
Based on `CraftLayers DS.json` (Local Source).

### Colors (HSL / Hex)

**Grey Scale (Neutral)**
- `Gray0`: #FFFFFF (Page Bg)
- `Gray10`: #FCFCFD (Surface Bg)
- `Gray20`: #F8FAFB (Subtle Bg)
- `Gray100`: #F0F4F5
- `Gray200`: #D5DBDE (Border Default)
- `Gray300`: #A1A6A8
- `Gray400`: #73787A (Text Secondary)
- `Gray500`: #505355
- `Gray600`: #383B3C
- `Gray700`: #2B2D2E (Text Primary)
- `Gray800`: #18191A
- `Gray1000`: #000000

**Primary (Brand - Orange/Amber)**
- `Primary-50`: #FFF3E0
- `Primary-100`: #FFE0B2
- `Primary-200`: #FFCC80
- `Primary-300`: #FFB74D
- `Primary-400`: #FFA726
- `Primary-500`: #FFA500 (Main Brand)
- `Primary-600`: #E69500
- `Primary-700`: #CC8400

**Pastel Support**
- `Pastel-Blue-500`: #50A9EE
- `Pastel-Teal-500`: #3DD1C2
- `Pastel-Purple-500`: #A682D7
- `Pastel-Pink-500`: #F06292

### Spacing (Global Scale)
- `Global-0`: 0px
- `Global-2`: 2px
- `Global-4`: 4px
- `Global-8`: 8px
- `Global-12`: 12px
- `Global-16`: 16px
- `Global-20`: 20px
- `Global-24`: 24px
- `Global-32`: 32px
- `Global-40`: 40px
- `Global-48`: 48px
- `Global-64`: 64px
- `Global-96`: 96px

### Radius
- `Radius-None`: 0px
- `Radius-Sm`: 4px (`Global-4`)
- `Radius-Md`: 8px (`Global-8`)
- `Radius-Lg`: 16px (`Global-16`)
- `Radius-Xl`: 24px (`Global-24`)
- `Radius-Full`: 9999px

### Typography (Inter)
*Note: Font sizes inferred from standard scales if not explicit in JSON snippet, adhering to 4px grid.*
- **Weights**: Medium (500), Semibold (600), Bold (700).
- **Line Heights**: Tight (110%), Normal (140%), Relaxed (160%).

---

## 2. Semantic Aliases

### Surfaces
- `Surface-Page`: `Gray0` (#FFFFFF)
- `Surface-Card`: `Gray10` (#FCFCFD)
- `Surface-Subtle`: `Gray20` (#F8FAFB)
- `Surface-Inverse`: `Gray1000` (#000000)

### Text
- `Text-Primary`: `Gray700` (#2B2D2E)
- `Text-Secondary`: `Gray400` (#73787A)
- `Text-Link`: `Primary-700` (#CC8400)
- `Text-Interactive`: `Gray0` (#FFFFFF)

### Interactive (Buttons/Actions)
- `Action-Primary-Bg`: `Primary-500` (#FFA500)
- `Action-Primary-Hover`: `Primary-700` (#CC8400)
- `Action-Disabled`: `Gray400`

### Borders
- `Border-Default`: `Gray200` (#D5DBDE)
- `Border-Muted`: `Gray100` (#F0F4F5)
- `Border-Focus`: `Gray600` (#383B3C)

---

## 3. Interaction & Motion
- **Durations**: Fast (100ms), Base (200ms), Slow (400ms).
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` (Standard).

---

## 4. Tailwind Config Updates
Update `tailwind.config.ts` with these values:

```ts
{
  colors: {
    gray: {
      0: '#FFFFFF',
      10: '#FCFCFD',
      20: '#F8FAFB',
      100: '#F0F4F5',
      200: '#D5DBDE',
      300: '#A1A6A8',
      400: '#73787A',
      500: '#505355',
      600: '#383B3C',
      700: '#2B2D2E',
      800: '#18191A',
      1000: '#000000',
    },
    primary: {
      50: '#FFF3E0',
      100: '#FFE0B2',
      200: '#FFCC80',
      300: '#FFB74D',
      400: '#FFA726',
      500: '#FFA500',
      600: '#E69500',
      700: '#CC8400',
    },
    pastel: {
      blue: '#50A9EE',
      teal: '#3DD1C2',
      purple: '#A682D7',
      pink: '#F06292',
    }
  },
  borderRadius: {
    'sm': '4px',
    'md': '8px',
    'lg': '16px', // Note: JSON defines Lg as 16px, different from standard tailwind
    'xl': '24px',
  },
  spacing: {
    '18': '4.5rem', // 72px
    '24': '6rem',   // 96px
    '32': '8rem',   // 128px
  }
}
```
