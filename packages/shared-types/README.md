# Shared Types

This package contains shared TypeScript interfaces and types used across the eBuddy application.

## Usage

```typescript
import { User, CreateUserDTO, UpdateUserDTO } from "@ebuddy/shared-types";

// Now you can use these types in your code
const user: User = {
  id: "123",
  totalAverageWeightRatings: 4.5,
  numberOfRents: 10,
  recentlyActive: 1648676642,
};
```

## Available Types

- `User`: The main user entity interface
- `CreateUserDTO`: Data transfer object for creating users
- `UpdateUserDTO`: Data transfer object for updating users

## Development

To build the package:

```bash
npm run build
```

To watch for changes during development:

```bash
npm run dev
```
