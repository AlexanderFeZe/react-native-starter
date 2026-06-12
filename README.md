# react-native-starter

Production-ready React Native CLI starter with TypeScript, Zustand, React Query, MMKV v4, and feature-based architecture.

This starter acts as an agnostical, high-performance base for building scalable mobile applications connected to REST APIs (Laravel, NestJS, Node.js, etc.). Its primary purpose is to eliminate boilerplate setup, enforce native security standards, and establish strict architectural patterns for development teams.

---

## 🚀 Quick Start: How to use this starter for a new project

When starting a project for a new client, **DO NOT** initialize a fresh React Native project. Instead, clone this repository, strip the starter's Git history, and run the automated renaming tool.

### Step 1: Clone the repository
Clone the template into a new directory named after your new project:
```bash
git clone [https://github.com/YOUR_USERNAME/react-native-starter.git](https://github.com/YOUR_USERNAME/react-native-starter.git) NewClientApp
cd NewClientApp

```

### Step 2: Disconnect from the starter's Git history

Remove the origin repository tracking to prevent accidental commits to the boilerplate:

**On Windows (PowerShell):**

```powershell
Remove-Item -Recurse -Force .git

```

**On Mac/Linux:**

```bash
rm -rf .git

```

*(Optional: Run `git init` right after to start a fresh tracking history for the client).*

### Step 3: Install base dependencies

```bash
npm install

```

### Step 4: Rename the project natively

Update the application display name, native folder structures, and the unique Bundle ID/Package Name across iOS and Android automatically:

```bash
npx react-native-rename "NewAppName" -b com.company.app

```

### Step 5: Clean caches and compile

Ensure native cache artifacts from the old name are cleared before the first build.

**For Android:**

```bash
cd android && ./gradlew clean && cd ..
npm run android

```

**For iOS (Mac only):**

```bash
cd ios && rm -rf Pods Podfile.lock && pod install && cd ..
npm run ios

```

---

## 📦 What's included & Why it's here

* **React Native CLI + TypeScript:** Complete control over the native layer without Expo runtime overhead, crucial for integrating native payment frameworks or custom SDKs.
* **React Navigation v7:** Pre-configured stack and tab structures to handle application flows natively.
* **React Native MMKV (v4 / Nitro Modules):** Synchronous, C++ powered local storage replacing the slower, asynchronous `AsyncStorage`. Used for ultra-fast UI and state persistence.
* **React Native Keychain:** Hardware-encrypted storage (Keystore/Keychain) specifically dedicated to preserving sensitive access tokens safely.
* **React Query (TanStack Query):** Dedicated server-state manager. Handles caching, auto-refetching, and loading states out of the box, keeping client state clean.
* **Zustand:** Ultra-lightweight client-state manager, used strictly for non-server data (UI toggles, shopping carts, active sessions).

---

## 🗂️ Project Structure

We enforce a **feature-based architecture**. Code must be grouped by business domains (e.g., auth, products, orders) rather than technical file types.

```text
src/
├── app/                    ← Global routing, providers, and native Bootsplash control
├── config/                 ← Global constants, theme scales, and color palettes
├── features/               ← Business domains / feature modules
│   └── auth/               ← Example feature
│       ├── screens/        ← Feature UI components (LoginScreen.tsx, etc.)
│       ├── hooks/          ← Feature server state interactions (useLogin.ts)
│       └── store/          ← Feature local state slices (auth.store.ts)
├── shared/                 ← Global reusables across multiple features
│   ├── components/         ← Atomic UI kit (Button, Input, Card)
│   ├── hooks/              ← Generic utilities (useDebounce, useRefreshOnFocus)
│   └── services/           ← Network layer configuration (api.ts)
└── types/                  ← Environment and global declaration files

```

---

## 🛠️ Standard Patterns (Development Rules)

To maintain a clean and maintainable codebase, all developers must strictly follow these structural patterns.

### 1. Data Fetching Pattern (`features/[domain]/hooks/use[Entity].ts`)

**Rule:** Components must never perform raw network requests or manage loading states manually. All interactions with the REST API must live inside custom hooks leveraging React Query.

*Template Pattern (`features/products/hooks/useProducts.ts`):*

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@shared/services/api';

// Fetching template
export function useItems() {
  return useQuery({
    queryKey: ['items'],
    queryFn: () => api.get('/items').then(r => r.data),
  });
}

// Mutation template
export function useCreateItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: any) => api.post('/items', dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

```

### 2. Secure Authentication Layer

The network instance (`src/shared/services/api.ts`) automatically intercepts and embeds secure authorization headers using native Keychain access.

*To manipulate user sessions within screens:*

```typescript
import { useAuthStore } from '@features/auth/store/auth.store';

const { login, logout, isAuthenticated, user } = useAuthStore();

// Triggers native encryption storage internally
await login('secure_jwt_token', { name: 'John Doe', role: 'client' });

```

### 3. Environment Isolation

Environment properties must reside within a `.env` file at the root level. They are securely injected and strongly typed via `src/types/env.d.ts`.

```env
API_URL=[http://10.0.2.2:3000/api/v1](http://10.0.2.2:3000/api/v1)

```

*(Note: Use `10.0.2.2` to resolve local development hosts inside the Android emulator).*

---

*Maintained by Alexander - NextCode*
