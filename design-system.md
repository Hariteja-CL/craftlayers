# CraftLayers Design System

## 1. Primitive Collections
The foundation of our visual language, based on HSL values for programmatic manipulation.

### Colors
**Neutral (Slate-based for technical feel)**
- `Neutral-000`: #FFFFFF
- `Neutral-050`: #F8FAFC
- `Neutral-100`: #F1F5F9
- `Neutral-200`: #E2E8F0
- `Neutral-300`: #CBD5E1
- `Neutral-400`: #94A3B8
- `Neutral-500`: #64748B
- `Neutral-600`: #475569
- `Neutral-700`: #334155
- `Neutral-800`: #1E293B
- `Neutral-900`: #0F172A
- `Neutral-950`: #020617

**Brand (Electric Blue - "Craft")**
- `Brand-050`: #EFF6FF
- `Brand-100`: #DBEAFE
- `Brand-200`: #BFDBFE
- `Brand-300`: #93C5FD
- `Brand-400`: #60A5FA
- `Brand-500`: #3B82F6
- `Brand-600`: #2563EB
- `Brand-700`: #1D4ED8
- `Brand-800`: #1E40AF
- `Brand-900`: #1E3A8A

**Accent (Vibrant Violet - "Layers")**
- `Accent-500`: #8B5CF6

### Typography (Font: Inter)
- `Display-2XL`: 72px / 1.1 (Bold)
- `Display-XL`: 60px / 1.1 (Bold)
- `Display-L`: 48px / 1.1 (Bold)
- `Heading-M`: 30px / 1.2 (SemiBold)
- `Heading-S`: 24px / 1.2 (SemiBold)
- `Body-L`: 18px / 1.5 (Regular)
- `Body-M`: 16px / 1.5 (Regular)
- `Body-S`: 14px / 1.5 (Regular)
- `Caption`: 12px / 1.4 (Medium)

### Spacing (4px Grid)
- `Space-0`: 0px
- `Space-1`: 4px
- `Space-2`: 8px
- `Space-3`: 12px
- `Space-4`: 16px
- `Space-6`: 24px
- `Space-8`: 32px
- `Space-12`: 48px
- `Space-16`: 64px
- `Space-24`: 96px
- `Space-32`: 128px

### Radius
- `Radius-None`: 0px
- `Radius-S`: 4px
- `Radius-M`: 8px
- `Radius-L`: 12px
- `Radius-XL`: 16px
- `Radius-2XL`: 24px
- `Radius-Full`: 9999px

---

## 2. Semantic Aliases
Mapping primitives to intent.

### Surfaces
- `Surface-Primary`: `Neutral-000` (Light Mode) / `Neutral-950` (Dark Mode)
- `Surface-Secondary`: `Neutral-050` / `Neutral-900`
- `Surface-Tertiary`: `Neutral-100` / `Neutral-800`
- `Surface-Brand`: `Brand-600`
- `Surface-Brand-Subtle`: `Brand-050` / `Brand-900`

### Borders
- `Border-Subtle`: `Neutral-200` / `Neutral-800`
- `Border-Strong`: `Neutral-300` / `Neutral-700`
- `Border-Interactive`: `Brand-500`

### Text
- `Text-Primary`: `Neutral-900` / `Neutral-050`
- `Text-Secondary`: `Neutral-500` / `Neutral-400`
- `Text-Brand`: `Brand-600` / `Brand-400`
- `Text-Inverted`: `Neutral-000`

---

## 3. Token Logic & Rules
Governing how tokens are applied to components.

- **Cards**:
  - Always use `Radius-L` (12px).
  - Padding must be at least `Space-6` (24px).
  - Border: `Border-Subtle`.
  - Hover: Lift effect + `Border-Interactive`.

- **Buttons**:
  - Primary: `Surface-Brand`, `Text-Inverted`, `Radius-M` (8px).
  - Secondary: `Surface-Secondary`, `Text-Primary`, `Radius-M`.
  - Height: Fixed to `Space-10` (40px) or `Space-12` (48px).

- **Inputs**:
  - `Radius-M` (8px).
  - `Border-Strong` default, `Border-Interactive` focus.

- **Layout**:
  - Section spacing: `Space-24` (96px) or `Space-32` (128px).
  - Component gap: `Space-4` (16px) or `Space-6` (24px).

---

## 4. Tailwind Config (theme.extend)
Copy this object into `tailwind.config.ts`.

```ts
{
  colors: {
    neutral: {
      0: '#FFFFFF',
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      300: '#CBD5E1',
      400: '#94A3B8',
      500: '#64748B',
      600: '#475569',
      700: '#334155',
      800: '#1E293B',
      900: '#0F172A',
      950: '#020617',
    },
    brand: {
      50: '#EFF6FF',
      100: '#DBEAFE',
      200: '#BFDBFE',
      300: '#93C5FD',
      400: '#60A5FA',
      500: '#3B82F6',
      600: '#2563EB',
      700: '#1D4ED8',
      800: '#1E40AF',
      900: '#1E3A8A',
    },
    accent: {
      500: '#8B5CF6',
    },
    // Semantic Aliases (CSS Variables recommended for Dark Mode, but mapped here for reference)
    surface: {
      primary: 'var(--surface-primary)',
      secondary: 'var(--surface-secondary)',
      brand: 'var(--surface-brand)',
    },
    text: {
      primary: 'var(--text-primary)',
      secondary: 'var(--text-secondary)',
      brand: 'var(--text-brand)',
    }
  },
  fontFamily: {
    sans: ['Inter', 'sans-serif'],
  },
  borderRadius: {
    's': '4px',
    'm': '8px',
    'l': '12px',
    'xl': '16px',
    '2xl': '24px',
  },
  spacing: {
    '18': '4.5rem', // 72px
    '24': '6rem',   // 96px
    '32': '8rem',   // 128px
  }
}
```
