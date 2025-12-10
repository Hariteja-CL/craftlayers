# Design Tokens Structure - Craft Layers Figma File

## Overview
This document summarizes the design token structure from the Craft Layers Figma design system. The tokens are organized into collections that reference each other, creating a hierarchical and maintainable design system.

**Figma File**: [Craft Layers Design System](https://www.figma.com/design/4mieLYGbAA5iOS28SLBd32/Craft-Layers?node-id=1-2&m=dev)

---

## 1. Color Tokens

### 1.1 Grey Scale Collection
The grey scale provides a comprehensive neutral color palette used throughout the design system.

#### EnGrey Scale (Primary Collection)
- **EnGrey Scale/Gray0**: `#ffffff` - Pure white
- **EnGrey Scale/Gray 100**: `#f0f4f5` - Light grey background
- **EnGrey Scale/Gray200**: `#d5dbde` - Border/divider color
- **EnGrey Scale/Gray 300 (S)**: `#a1a6a8` - Secondary text/subtle elements
- **EnGrey Scale/Gray 400**: `#73787a` - Medium grey text
- **EnGrey Scale/Gray 500**: `#505355` - Default text color
- **EnGrey Scale/Gray 600**: `#383b3c` - Darker text
- **EnGrey Scale/Gray 700**: `#2b2d2e` - Dark text/headings
- **EnGrey Scale/Gray 800 (Text)**: `#18191a` - Primary text color
- **EnGrey Scale/Gray1000**: `#000000` - Pure black

#### Grey Scale (Alternative Collection)
- **Grey Scale/White**: `#FFFFFF`
- **Grey Scale/Gray0**: `#ffffff`
- **Grey Scale/Gray 10**: `#fcfcfd`
- **Grey Scale/Gray 20(Bg)**: `#f8fafb` - Background color
- **Grey Scale/Gray 100**: `#f0f4f5`
- **Grey Scale/Gray200**: `#d5dbde`
- **Grey Scale/Gray 300 (S)**: `#a1a6a8`
- **Grey Scale/Gray 400**: `#73787a`
- **Grey Scale/Gray 500**: `#505355`
- **Grey Scale/Gray 600**: `#383b3c`
- **Grey Scale/Gray 700**: `#2B2D2E`
- **Grey Scale/Gray 800 (Text)**: `#18191a`

**Connection Point**: Both collections share similar values but are organized under different namespaces, allowing for flexibility in usage contexts.

### 1.2 Primary Colors
- **EnPrimary/Teal/500 (p)**: `#308282` - Primary teal
- **EnPrimary/Teal/700**: `#1a5050` - Darker teal variant
- **Teal/Dark**: `#308282` - Alias for primary teal
- **Primary/Teal/500 (p)**: `#ffa500` - Alternative primary (orange variant)
- **Primary/Main/200**: `#ffcc80` - Light primary variant

### 1.3 Semantic Colors

#### Success Colors
- **EnSuccess/500 (p)**: `#0fa251` - Success green

#### Warning Colors
- **EnWarning/500 (p)**: `#f5a623` - Warning orange

#### Secondary Colors
- **EnSecondry/Purple/500(p)**: `#a246f0` - Secondary purple

#### Info Colors
- **Info/100**: `#e5f2ff` - Light info blue

### 1.4 Pastel Colors
Used for backgrounds and subtle UI elements.

#### Pastel/Green
- **EnPastel/Green/100**: `#e7f8f0` - Light green background
- **EnPastel/Green/600**: `#38b784` - Medium green

#### Pastel/Yellow
- **EnPastel/Yellow/700**: `#e6a900` - Yellow accent

#### Pastel/Coral
- **EnPastel/Coral/600**: `#f2785c` - Coral accent

#### Pastel/Blue
- **Pastel/Blue/50**: `#f3f8fe` - Very light blue
- **Pastel/Blue/100**: `#eaf6fd` - Light blue
- **Pastel/Blue/300**: `#bee6f9` - Medium blue
- **EnPastel/Blue/100**: `#eaf6fd` - Light blue (alternative)
- **EnPastel/Blue/400**: `#76c1fa` - Medium-light blue

### 1.5 Accent Colors
- **EnColorAccent1**: `#a7b6f7` - Accent 1 (purple-blue)
- **EnColorAccent2**: `#81d7ae` - Accent 2 (green)
- **EnColorAccent3**: `#ffdd6c` - Accent 3 (yellow)
- **EnColorAccent4**: `#ffb4a2` - Accent 4 (coral)

---

## 2. Typography Tokens

### 2.1 Font Size Variables
These are referenced by font style tokens, creating a connection point between sizes and styles.

- **En-font-size-caption**: `12`
- **En-font-size-footnote**: `12`
- **En-font-size-body-sm**: `14`
- **En-font-size-body**: `16`
- **En-font-size-headline**: `18`
- **En-font-size-h4**: `24`
- **En-font-size-h3**: `24`
- **En-font-size-h2**: `32`
- **En-font-size-h1**: `48`

### 2.2 Font Style Tokens
Font styles reference font size variables, creating a connection between typography scales.

#### Headline Styles
- **Font style/Headline/Medium**: 
  - Family: `Poppins`
  - Style: Medium
  - Size: `En-font-size-headline` (18)
  - Weight: 500
  - Line Height: 26
  - Letter Spacing: 0

- **Font style/Headline/Regular**: 
  - Family: `Poppins`
  - Style: Regular
  - Size: `En-font-size-headline` (18)
  - Weight: 400
  - Line Height: 26
  - Letter Spacing: 0

- **Large/Headline/Regular**: 
  - Family: `Poppins`
  - Style: Regular
  - Size: `En-font-size-headline` (18)
  - Weight: 400
  - Line Height: 32
  - Letter Spacing: 0

- **Large/Headline/Semi Bold**: 
  - Family: `Poppins`
  - Style: SemiBold
  - Size: `En-font-size-headline` (18)
  - Weight: 600
  - Line Height: 32
  - Letter Spacing: 0

#### Heading Styles (H1-H4)
- **Large/H1/Bold**: 
  - Family: `Poppins`
  - Style: Medium
  - Size: `En-font-size-h1` (48)
  - Weight: 500
  - Line Height: 58
  - Letter Spacing: 0

- **Large/H2/Regular**: 
  - Family: `Poppins`
  - Style: Regular
  - Size: `En-font-size-h2` (32)
  - Weight: 400
  - Line Height: 48
  - Letter Spacing: 0

- **Large/H4/Regular**: 
  - Family: `Poppins`
  - Style: Regular
  - Size: `En-font-size-h4` (24)
  - Weight: 400
  - Line Height: 28
  - Letter Spacing: 0

- **Large/H4/Bold**: 
  - Family: `Poppins`
  - Style: Medium
  - Size: `En-font-size-h4` (24)
  - Weight: 500
  - Line Height: 28
  - Letter Spacing: 0

#### Body Styles
- **Font style/Body/Regular**: 
  - Family: `Poppins`
  - Style: Regular
  - Size: `En-font-size-body` (16)
  - Weight: 400
  - Line Height: 24
  - Letter Spacing: 0

- **Font style/Body small/Regular**: 
  - Family: `Poppins`
  - Style: Regular
  - Size: `En-font-size-body-sm` (14)
  - Weight: 400
  - Line Height: 20
  - Letter Spacing: 0

- **Large/Body/Regular**: 
  - Family: `Poppins`
  - Style: Regular
  - Size: `En-font-size-body` (16)
  - Weight: 400
  - Line Height: 24
  - Letter Spacing: 0

- **Large/Body_Small/Regular**: 
  - Family: `Poppins`
  - Style: Regular
  - Size: `En-font-size-body-sm` (14)
  - Weight: 400
  - Line Height: 20
  - Letter Spacing: 0

#### Caption & Footnote Styles
- **Font style/Caption/Regular**: 
  - Family: `Poppins`
  - Style: Regular
  - Size: `En-font-size-caption` (12)
  - Weight: 400
  - Line Height: 16
  - Letter Spacing: 0

- **Large/Caption/Medium**: 
  - Family: `Poppins`
  - Style: Medium
  - Size: `En-font-size-caption` (12)
  - Weight: 500
  - Line Height: 16
  - Letter Spacing: 0

- **Large/Footnote/Regular**: 
  - Family: `Poppins`
  - Style: Regular
  - Size: `En-font-size-footnote` (12)
  - Weight: 400
  - Line Height: 16
  - Letter Spacing: 0

#### Subtitle Style
- **Fonts/Subtitle/Regular**: 
  - Family: `Poppins`
  - Style: Regular
  - Size: 14
  - Weight: 400
  - Line Height: 20
  - Letter Spacing: 0

#### Alternative Font Style
- **Semibold 14 (0.2 px)**: 
  - Family: `Mulish`
  - Style: SemiBold
  - Size: 14
  - Weight: 600
  - Line Height: 20
  - Letter Spacing: 0.2px

**Connection Point**: Font style tokens reference font size variables (e.g., `En-font-size-headline`, `En-font-size-body`), creating a maintainable system where changing a size variable updates all related styles.

---

## 3. Spacing Tokens

### 3.1 En Space Collection (Primary)
- **EnSpace2Xs**: `2` - Extra extra small spacing
- **EnSpaceXs**: `4` - Extra small spacing
- **EnSpaceSm**: `8` - Small spacing
- **EnSpaceMd**: `16` - Medium spacing
- **EnSpaceLg**: `24` - Large spacing
- **EnSpaceXl**: `32` - Extra large spacing

### 3.2 Space Collection (Alternative)
- **Space2Xs**: `2`
- **SpaceXs**: `4`
- **SpaceSm**: `8`
- **SpaceMd**: `16`
- **SpaceLg**: `24`
- **SpaceXl**: `32`
- **Space2Xl**: `48` - Extra extra large spacing

### 3.3 Grid Spacing
- **GridGutterSm**: `16` - Small grid gutter
- **GridGutterLg**: `32` - Large grid gutter

### 3.4 Scale Collection
- **Scale/Scale_2s/3XS**: `2` - Scale system token

**Connection Point**: Both `EnSpace` and `Space` collections use the same values, providing consistency across different naming conventions.

---

## 4. Border Radius Tokens

- **EnRadiusMd**: `8` - Medium border radius
- **EnRadiusLg**: `16` - Large border radius
- **RadiusMd**: `8` - Alternative medium border radius

**Connection Point**: Border radius tokens follow a similar pattern to spacing tokens with both `En` prefixed and non-prefixed variants.

---

## 5. Effect Tokens (Shadows)

### 5.1 Button Shadow
**Button Shadow**: 
- Shadow 1: `rgba(50, 50, 71, 0.06)` at offset (0, 4), radius 4, spread 0
- Shadow 2: `rgba(50, 50, 71, 0.08)` at offset (0, 4), radius 8, spread 0

### 5.2 Dropdown Shadows
**drop down for buttomn**: 
- Shadow: `rgba(0, 0, 0, 0.26)` at offset (0, 2), radius 12, spread 0

**Dropdown1**: 
- Shadow 1: `rgba(0, 0, 0, 0.11)` at offset (0, 7), radius 3.63, spread 0
- Shadow 2: `rgba(0, 0, 0, 0.13)` at offset (0, -6.46), radius 14.53, spread 0

---

## 6. Variable Collection Connections

### 6.1 Hierarchical Structure

```
Font Size Variables (Base Layer)
    ↓
Font Style Tokens (Reference Layer)
    ↓
Component Usage (Application Layer)
```

**Example Connection**:
- `En-font-size-headline` (18) is referenced by:
  - `Font style/Headline/Medium`
  - `Font style/Headline/Regular`
  - `Large/Headline/Regular`
  - `Large/Headline/Semi Bold`

### 6.2 Color Collection Patterns

1. **Namespace Variations**: 
   - `EnGrey Scale/*` vs `Grey Scale/*` - Same values, different namespaces
   - Allows for context-specific usage while maintaining consistency

2. **Semantic Grouping**:
   - Primary colors (Teal)
   - Semantic colors (Success, Warning, Info)
   - Pastel colors (backgrounds)
   - Accent colors (UI highlights)

### 6.3 Spacing Collection Patterns

1. **Consistent Scale**: Both `EnSpace` and `Space` collections follow the same scale (2, 4, 8, 16, 24, 32)
2. **Extended Scale**: `Space2Xl` (48) extends beyond the base scale
3. **Grid System**: Separate grid gutter tokens for layout-specific spacing

### 6.4 Typography Connection Points

**Key Connections**:
- Font sizes are defined as separate variables
- Font styles reference these size variables
- This creates a single source of truth for typography scales
- Changing a font size variable automatically updates all related font styles

**Example Flow**:
```
En-font-size-body (16)
    ↓
Font style/Body/Regular (references size: En-font-size-body)
    ↓
Used in components with weight: 400, line-height: 24
```

---

## 7. Design System Architecture

### 7.1 Token Organization Principles

1. **Separation of Concerns**:
   - Base values (colors, sizes, spacing) are defined separately
   - Composite tokens (font styles, effects) reference base values
   - This allows for systematic updates across the design system

2. **Naming Conventions**:
   - `En*` prefix for primary collection
   - Alternative collections without prefix for flexibility
   - Semantic naming (e.g., `Gray 800 (Text)`) indicates usage context

3. **Scalability**:
   - Font size variables enable easy typography scale adjustments
   - Spacing tokens follow a consistent mathematical progression
   - Color tokens are organized by purpose and intensity

### 7.2 Maintenance Benefits

- **Single Source of Truth**: Changing `En-font-size-body` updates all body text styles
- **Consistency**: Shared spacing and color values ensure visual harmony
- **Flexibility**: Multiple collections allow for context-specific usage
- **Scalability**: Easy to add new tokens following established patterns

---

## 8. Recommendations for Implementation

### 8.1 Token Mapping Strategy

When implementing this design system in code:

1. **Create Base Token Layer**: Map all base values (colors, sizes, spacing)
2. **Create Composite Token Layer**: Map font styles and effects that reference base tokens
3. **Maintain Connections**: Ensure references between tokens are preserved

### 8.2 Suggested Token Structure

```typescript
// Base tokens
const colors = {
  grey: { /* ... */ },
  primary: { /* ... */ },
  semantic: { /* ... */ }
}

// Referenced tokens
const typography = {
  fontSizes: { /* ... */ },
  fontStyles: {
    headline: {
      medium: {
        size: 'fontSizes.headline', // Reference
        weight: 500,
        // ...
      }
    }
  }
}
```

### 8.3 Variable Collection Priority

1. **Primary Collection** (`En*`): Use as default
2. **Alternative Collections**: Use when context requires different naming
3. **Semantic Tokens**: Use for component-specific needs

---

## Summary

The Craft Layers design system demonstrates a well-structured token architecture with clear connection points between collections. The hierarchical structure (base values → referenced tokens → component usage) enables maintainability and scalability while preserving design consistency across the system.

**Key Strengths**:
- Clear separation between base and composite tokens
- Consistent naming conventions
- Flexible namespace system
- Strong connection points between related tokens
- Comprehensive coverage of design properties

**Total Token Count**: ~100+ design tokens organized across 6 main categories (Colors, Typography, Spacing, Border Radius, Effects, and Scale).

