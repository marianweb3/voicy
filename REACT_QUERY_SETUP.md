# React Query & Axios Integration Guide

## Overview

This project now uses **React Query (TanStack Query)** for server state management and **Axios** for HTTP requests. This setup provides powerful caching, background updates, and optimistic updates out of the box.

## 🚀 Quick Start

### 1. Dependencies Installed

```bash
npm install @tanstack/react-query @tanstack/react-query-devtools axios
```

### 2. Project Structure

```
src/
├── lib/
│   ├── axios.ts          # Axios configuration with interceptors
│   └── react-query.ts    # Query client configuration
├── services/
│   └── api.ts            # API service functions
├── hooks/
│   └── useAdmins.ts      # Admin management hook
└── main.tsx              # App entry with QueryClientProvider
```

## 🔧 Configuration

### Axios Setup (`src/lib/axios.ts`)

```typescript
import axios from "axios";

const api = axios.create({
  baseURL: "https://api.dev-e4d.workers.dev",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Skip redirect for login endpoint errors
    if (error.config?.url === "/login") {
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("token");
      window.location.href = "/auth";
    }
    return Promise.reject(error);
  }
);
```

### React Query Setup (`src/main.tsx`)

```typescript
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        if (error?.response?.status >= 400 && error?.response?.status < 500) {
          return false; // Don't retry 4xx errors
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// Wrap your app
<QueryClientProvider client={queryClient}>
  <AppRouter />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>;
```

## 📡 API Services

### Service Structure (`src/services/api.ts`)

```typescript
import api from "../lib/axios";

// Type definitions
export interface LoginRequest {
  email: string;
  password: string;
}

export interface Admin {
  id: number;
  full_name: string;
  email: string;
  role: string;
  photo?: string;
}

// API functions
export const authAPI = {
  login: async (credentials: LoginRequest) => {
    const response = await api.post("/login", credentials);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/profile");
    return response.data;
  },
};

export const adminsAPI = {
  getCatalog: async (page: number = 1, search: string = "") => {
    const response = await api.get("/admins/catalog", {
      params: { page, search },
    });
    return response.data;
  },

  create: async (adminData: AdminCreateRequest) => {
    const formData = new FormData();
    // ... form data setup
    const response = await api.post("/admins/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
```

## 🎣 Custom Hooks

### Admin Management Hook (`src/hooks/useAdmins.ts`)

```typescript
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminsAPI } from "../services/api";

export const useAdmins = (page: number = 1, search: string = "") => {
  const queryClient = useQueryClient();

  // Get admins list
  const { data: adminsData, isLoading: isLoadingAdmins } = useQuery({
    queryKey: ["admins", page, search],
    queryFn: () => adminsAPI.getCatalog(page, search),
    keepPreviousData: true,
  });

  // Create admin mutation
  const createAdminMutation = useMutation({
    mutationFn: adminsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });

  return {
    admins: adminsData?.data || [],
    pagination: adminsData?.pagination,
    isLoadingAdmins,
    isCreatingAdmin: createAdminMutation.isPending,
    createAdmin: createAdminMutation.mutate,
    createAdminError: createAdminMutation.error,
  };
};
```

## 🎯 Usage Examples

### In Components

#### Authentication (Direct Implementation)

```typescript
import { useMutation } from "@tanstack/react-query";
import { authAPI } from "../services/api";

const AuthPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: authAPI.login,
    onSuccess: (data) => {
      console.log(data, 'data)
      localStorage.setItem("token", data.data.token);
      localStorage.setItem("isLoggedIn", "true");
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      try {
        await loginMutation.mutateAsync({ email, password });
      } catch (error) {
        // Error handled by mutation
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button disabled={loginMutation.isPending}>
        {loginMutation.isPending ? "Вхід..." : "Увійти"}
      </button>
      {loginMutation.error && <div>Error: {loginMutation.error.message}</div>}
    </form>
  );
};
```

#### User Profile (Direct Implementation)

```typescript
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../services/api";

const Header = () => {
  const queryClient = useQueryClient();

  // // Get user profile
  // const { data: user } = useQuery({
  //   queryKey: ["profile"],
  //   queryFn: authAPI.getProfile,
  //   enabled: false,
  //   retry: false,
  // });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    queryClient.clear();
    window.location.href = "/auth";
  };

  return (
    <header>
      <div>{user?.full_name}</div>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
};
```

#### Data Fetching

```typescript
import { useAdmins } from "../hooks/useAdmins";

const AdminsPage = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { admins, pagination, isLoadingAdmins, createAdmin, isCreatingAdmin } =
    useAdmins(page, search);

  if (isLoadingAdmins) return <div>Loading...</div>;

  return (
    <div>
      {admins.map((admin) => (
        <div key={admin.id}>{admin.full_name}</div>
      ))}
      <Pagination
        currentPage={pagination?.current_page}
        totalPages={pagination?.total_pages}
        onPageChange={setPage}
      />
    </div>
  );
};
```

## 🔄 React Query Features

### 1. Automatic Caching

- Data is cached automatically
- Stale data is refetched in background
- Cache invalidation on mutations

### 2. Background Updates

- Data stays fresh automatically
- Optimistic updates for better UX
- Background refetching

### 3. Error Handling

- Automatic retries
- Error boundaries
- Loading states

### 4. DevTools

- Query explorer
- Cache inspection
- Performance monitoring

## 🎨 Best Practices

### 1. Query Keys

```typescript
// Use arrays for query keys
["admins", page, search]["profile"][("calls", { status: "active" })];
```

### 2. Optimistic Updates

```typescript
const updateAdminMutation = useMutation({
  mutationFn: updateAdmin,
  onMutate: async (newAdmin) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ["admins"] });

    // Snapshot previous value
    const previousAdmins = queryClient.getQueryData(["admins"]);

    // Optimistically update
    queryClient.setQueryData(["admins"], (old) =>
      old.map((admin) => (admin.id === newAdmin.id ? newAdmin : admin))
    );

    return { previousAdmins };
  },
  onError: (err, newAdmin, context) => {
    // Rollback on error
    queryClient.setQueryData(["admins"], context.previousAdmins);
  },
  onSettled: () => {
    // Always refetch after error or success
    queryClient.invalidateQueries({ queryKey: ["admins"] });
  },
});
```

### 3. Infinite Queries

```typescript
const useInfiniteAdmins = () => {
  return useInfiniteQuery({
    queryKey: ["admins", "infinite"],
    queryFn: ({ pageParam = 1 }) => adminsAPI.getCatalog(pageParam),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.current_page < lastPage.pagination.total_pages
        ? lastPage.pagination.current_page + 1
        : undefined,
  });
};
```

### 4. Prefetching

```typescript
// Prefetch data for better UX
const prefetchAdmin = async (id: number) => {
  await queryClient.prefetchQuery({
    queryKey: ["admin", id],
    queryFn: () => adminsAPI.getById(id),
  });
};
```

## 🛠 Development Tools

### React Query DevTools

- **Installation**: Included in main.tsx
- **Usage**: Press `Ctrl+H` (or `Cmd+H`) to open
- **Features**:
  - Query cache inspection
  - Mutation history
  - Performance metrics
  - Cache manipulation

### Debugging

```typescript
// Enable debug mode
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
  logger: {
    log: console.log,
    warn: console.warn,
    error: () => {},
  },
});
```

## 🔒 Security Considerations

### 1. Token Management

- Tokens stored in localStorage
- Automatic token injection via interceptors
- Token cleanup on logout

### 2. Error Handling

- 401 errors trigger automatic logout
- Sensitive data not logged
- Graceful error recovery

### 3. Request Validation

- TypeScript interfaces for all requests
- Runtime validation for API responses
- Proper error boundaries

## 📊 Performance Optimizations

### 1. Query Configuration

```typescript
{
  staleTime: 5 * 60 * 1000,    // Data fresh for 5 minutes
  gcTime: 10 * 60 * 1000,      // Cache for 10 minutes
  refetchOnWindowFocus: false,  // Don't refetch on focus
  refetchOnReconnect: true,     // Refetch on reconnect
}
```

### 2. Selective Invalidation

```typescript
// Invalidate specific queries
queryClient.invalidateQueries({ queryKey: ["admins"] });

// Invalidate with filters
queryClient.invalidateQueries({
  queryKey: ["admins"],
  predicate: (query) =>
    query.state.data?.some((admin) => admin.role === "admin"),
});
```

### 3. Optimistic Updates

- Update UI immediately
- Rollback on error
- Better perceived performance

## 🚀 Migration Guide

### From useState + useEffect

```typescript
// Before
const [admins, setAdmins] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  setLoading(true);
  fetchAdmins()
    .then(setAdmins)
    .finally(() => setLoading(false));
}, []);

// After
const { admins, isLoadingAdmins } = useAdmins();
```

### From Custom API Calls

```typescript
// Before
const handleCreateAdmin = async (data) => {
  try {
    await createAdmin(data);
    // Manual refetch
    await refetchAdmins();
  } catch (error) {
    // Manual error handling
  }
};

// After
const { createAdmin } = useAdmins();
const handleCreateAdmin = (data) => {
  createAdmin(data); // Automatic cache invalidation
};
```

## 📚 Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [Axios Documentation](https://axios-http.com/)
- [React Query DevTools](https://tanstack.com/query/latest/docs/react/devtools)
- [Best Practices Guide](https://tanstack.com/query/latest/docs/react/guides/best-practices)
