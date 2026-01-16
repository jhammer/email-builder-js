# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
# Install dependencies (required before building)
npm install

# Build all packages
npm run build --workspaces

# Run all tests
npm test

# Run a single test file
npm test -- packages/block-text/src/index.spec.tsx

# Run tests matching a pattern
npm test -- --testPathPattern="block-text"

# Lint
npx eslint .

# Format check
npx prettier . --check

# Type check
npx tsc --noEmit
```

Individual block packages use tsup for building: `tsup ./src/index.ts(x) --outDir dist --format cjs,esm --dts`

## Architecture

This is an **npm workspaces monorepo** for building email templates with a plugin-based block architecture.

### Core Packages

- **`document-core`** - Foundation library providing `buildBlockComponent`, `buildBlockConfigurationSchema`, and `buildBlockConfigurationDictionary` utilities. All blocks depend on this.

- **`email-builder`** - Main package that aggregates all blocks and exports the `Reader` component and `renderToStaticMarkup` function. Renders email templates to static HTML or React components.

### Block Packages

11 block packages (`block-avatar`, `block-button`, `block-columns-container`, `block-container`, `block-divider`, `block-heading`, `block-html`, `block-image`, `block-spacer`, `block-text`) each containing:
- A Zod schema defining the block's configuration
- A React component for rendering

### Dependency Flow

```
document-core (base)
       ↓
  all block-* packages
       ↓
email-builder (aggregates blocks)
       ↓
examples/vite-emailbuilder-mui (editor UI)
```

### Data Model

Email documents use `TReaderDocument` - a flat dictionary of block configurations validated by Zod schemas at parse time. This enables JSON-based configuration storage and serialization.

### Creating New Blocks

Follow the existing pattern in any `block-*` package:
1. Define a Zod schema for block configuration
2. Create a React component that renders the block
3. Export both using the `buildBlockComponent` utility from `document-core`

## Testing

Tests coexist with source files as `*.spec.tsx`. Uses Jest with ts-jest preset and jsdom environment. Block component tests primarily use snapshot testing with @testing-library/react.

## Code Style

- TypeScript strict mode with no implicit any
- ESLint with @typescript-eslint and simple-import-sort
- Prettier: 120 char width, single quotes, trailing commas
