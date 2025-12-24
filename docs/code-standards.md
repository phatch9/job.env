# Apply.come

## TypeScript Guidelines

### General Principles
- Use TypeScript strict mode
- Prefer interfaces over types for object shapes
- Use type inference when possible
- Avoid `any` - use `unknown` if type is truly unknown

### Naming Conventions

#### Files
- Components: PascalCase (e.g., `ApplicationCard.tsx`)
- Hooks: camelCase with `use` prefix (e.g., `useApplications.ts`)
- Utilities: camelCase (e.g., `formatDate.ts`)
- Types: camelCase (e.g., `types.ts`)

#### Code
- Components: PascalCase
- Functions/Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Types/Interfaces: PascalCase
- Private properties: prefix with underscore

### Component Structure

```typescript
// 1. Imports
import { useState } from 'react';
import { SomeType } from '@/lib/types';

// 2. Types/Interfaces
interface ComponentProps {
  // ...
}

// 3. Component
export default function Component({ prop }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState();
  
  // 5. Event handlers
  const handleClick = () => {
    // ...
  };
  
  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

## React Best Practices

### Hooks
- Always use hooks at the top level
- Custom hooks must start with `use`
- Use `useCallback` for event handlers passed to children
- Use `useMemo` for expensive computations

### Props
- Destructure props in function signature
- Use default parameters for optional props
- Define prop types with TypeScript interfaces

### State Management
- Keep state as local as possible
- Use Context for global state
- Prefer composition over prop drilling

## CSS Guidelines

### Class Naming
- Use kebab-case for class names
- Use BEM-like naming for component variants
- Prefer semantic names over presentational

### Organization
- Use CSS custom properties for theming
- Group related properties together
- Use mobile-first responsive design

### Performance
- Avoid deep nesting (max 3 levels)
- Use CSS transforms for animations
- Minimize use of expensive properties (box-shadow, filter)

## Code Quality

### Comments
- Use JSDoc for public APIs
- Explain "why" not "what"
- Keep comments up to date

### Error Handling
- Always handle promise rejections
- Provide user-friendly error messages
- Log errors for debugging

### Performance
- Lazy load routes and heavy components
- Optimize images and assets
- Use React.memo for expensive components
- Avoid inline functions in JSX when possible

## Git Workflow

### Commit Messages
Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

### Branch Naming
- `feature/description`
- `fix/description`
- `refactor/description`

## Testing

### Unit Tests
- Test one thing per test
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

### Component Tests
- Test user interactions
- Test edge cases
- Mock external dependencies

## Accessibility

- Use semantic HTML
- Provide alt text for images
- Ensure keyboard navigation
- Use ARIA labels when needed
- Maintain color contrast ratios
