# Voice Assistant API Documentation

## API Base URL

```
https://api.dev-e4d.workers.dev
```

## Authentication

- **Type**: API Key
- **Header**: `Authorization`
- **Value**: `8f8d7a1c-2c9a-4af1-8f1e-9bba0f4c7f01`
- **Format**: Bearer token for authenticated endpoints

## Endpoints Overview

### 1. Authentication Endpoints

#### Login

- **Method**: `POST`
- **URL**: `/login`
- **Content-Type**: `application/json`
- **Body**:

```json
{
  "email": "user1@example.com",
  "password": "passhash1"
}
```

- **Description**: Authenticates user and returns access token
- **Response**: JWT token for subsequent API calls

#### Profile

- **Method**: `GET`
- **URL**: `/profile`
- **Headers**:
  - `Authorization: {{token}}`
  - `Content-Type: application/json`
- **Description**: Retrieves current user profile information
- **Authentication**: Required (Bearer token)

### 2. Admin Management Endpoints

#### Get Admins Catalog

- **Method**: `GET`
- **URL**: `/admins/catalog`
- **Headers**: `Content-Type: application/json`
- **Query Parameters**:
  - `page` (number): Page number for pagination (e.g., 2)
  - `per_page` (number): Items per page (e.g., 10)
  - `search` (string): Search term for filtering admins
- **Example**: `https://api.dev-e4d.workers.dev/admins/catalog?page=2&per_page=10&search=`
- **Description**: Retrieves paginated list of admin users with search functionality

#### Create Admin

- **Method**: `POST`
- **URL**: `/admins/create`
- **Headers**: `Content-Type: application/json`
- **Body** (Form Data):
  - `full_name` (text): Admin's full name (e.g., "Test")
  - `email` (text): Admin's email address (e.g., "test@gmail.com")
  - `role` (text): Comma-separated roles (e.g., "admins,dashboard")
    - **Available Roles**: admins, dashboard, calls, managers, processes, settings
  - `password` (text): Admin's password (e.g., "test12345")
  - `photo` (file): Admin's profile photo (optional)
- **Description**: Creates a new admin user with specified roles and permissions

#### Edit Admin

- **Method**: `POST`
- **URL**: `/admins/edit/{id_admin}`
- **Headers**: `Content-Type: application/json`
- **Path Parameters**:
  - `id_admin` (number): Admin user ID (e.g., 1)
- **Body** (Form Data):
  - `full_name` (text): Updated full name (e.g., "Test1333")
  - `email` (text): Updated email address (e.g., "test2@gmail.com")
  - `role` (text): Updated comma-separated roles (e.g., "admins,dashboard")
  - `password` (text): Updated password (e.g., "test12345123123")
  - `photo` (file): Updated profile photo (optional)
- **Description**: Updates existing admin user information

#### Delete Admin

- **Method**: `DELETE`
- **URL**: `/admins/delete/{id_admin}`
- **Path Parameters**:
  - `id_admin` (number): Admin user ID to delete (e.g., 24)
- **Description**: Permanently removes an admin user from the system

#### Delete Admin Photo

- **Method**: `DELETE`
- **URL**: `/admins/delete_photo/{id_admin}`
- **Path Parameters**:
  - `id_admin` (number): Admin user ID (e.g., 1)
- **Description**: Removes profile photo for specific admin user

### 3. Calls Management Endpoints

#### Get Calls Catalog

- **Method**: `GET`
- **URL**: `/calls/catalog`
- **Headers**:
  - `Authorization: your_admin_token_here`
  - `Content-Type: application/json`
- **Query Parameters**:
  - `page` (number): Page number for pagination (e.g., 1)
  - `per_page` (number): Items per page (e.g., 10)
  - `search` (string): Phone number search (e.g., "380982149108")
  - `manager_id` (number): Filter by manager ID (e.g., 690)
  - `is_checked` (number): Filter by checked status (1/0)
  - `ai_score` (string): Filter by AI score range (e.g., "90-100")
  - `reject_reason` (string): Filter by rejection reason
    - Available values: `expensive`, `no_trust`, `thinking`, `no_budget`, `weak_followup`, `already_bought`
  - `status` (string): Filter by call status
    - Available values: `done`, `waiting`, `error`
- **Description**: Retrieves paginated list of calls with comprehensive filtering options
- **Authentication**: Required

#### View Call Details

- **Method**: `GET`
- **URL**: `/calls/view/{id_call}`
- **Headers**:
  - `Authorization: your_admin_token_here`
  - `Content-Type: application/json`
- **Path Parameters**:
  - `id_call` (number): Call ID (e.g., 21501)
- **Description**: Retrieves detailed information about a specific call
- **Authentication**: Required

#### Check Call

- **Method**: `POST`
- **URL**: `/calls/check/{id_call}`
- **Headers**:
  - `Authorization: your_admin_token_here`
  - `Content-Type: application/json`
- **Path Parameters**:
  - `id_call` (number): Call ID (e.g., 21501)
- **Description**: Marks a call as checked/reviewed
- **Authentication**: Required

#### Get Call Comments

- **Method**: `GET`
- **URL**: `/calls/comments/{id_call}`
- **Headers**:
  - `Authorization: your_admin_token_here`
  - `Content-Type: application/json`
- **Path Parameters**:
  - `id_call` (number): Call ID
- **Description**: Retrieves comments for a specific call
- **Authentication**: Required

### 4. Managers Management Endpoints

#### Get Managers Catalog

- **Method**: `GET`
- **URL**: `/managers/catalog`
- **Headers**:
  - `Authorization: your_admin_token_here`
  - `Content-Type: application/json`
- **Description**: Retrieves list of all managers
- **Authentication**: Required

#### Get Manager Calls

- **Method**: `GET`
- **URL**: `/managers/calls/{id_manager}`
- **Headers**:
  - `Authorization: your_admin_token_here`
  - `Content-Type: application/json`
- **Path Parameters**:
  - `id_manager` (number): Manager ID (e.g., 3)
- **Description**: Retrieves calls associated with a specific manager
- **Authentication**: Required

#### Get Manager Dynamics

- **Method**: `GET`
- **URL**: `/managers/dynamics/{id_manager}`
- **Headers**:
  - `Authorization: your_admin_token_here`
  - `Content-Type: application/json`
- **Path Parameters**:
  - `id_manager` (number): Manager ID (e.g., 3)
- **Query Parameters**:
  - `range` (string): Time range for data
    - Available values: `week`, `month`, `year`
  - `type` (string): Data type to retrieve
    - Available values: `calls`, `ai_avg`
- **Example**: `https://api.dev-e4d.workers.dev/managers/dynamics/3?range=year&type=calls`
- **Description**: Retrieves performance dynamics for a specific manager
- **Authentication**: Required

### 5. Dashboard Endpoints

#### Get Dashboard Main Data

- **Method**: `GET`
- **URL**: `/dashboard/main`
- **Headers**:
  - `Authorization: your_admin_token_here`
  - `Content-Type: application/json`
- **Description**: Retrieves main dashboard statistics and metrics
- **Authentication**: Required

#### Get Dashboard Dynamics

- **Method**: `GET`
- **URL**: `/dashboard/dynamics`
- **Headers**:
  - `Authorization: your_admin_token_here`
  - `Content-Type: application/json`
- **Query Parameters**:
  - `range` (string): Time range for data
    - Available values: `week`, `month`, `year`
  - `type` (string): Data type to retrieve
    - Available values: `calls`, `ai_avg`
- **Example**: `https://api.dev-e4d.workers.dev/dashboard/dynamics?range=year&type=ai_avg`
- **Description**: Retrieves dynamics data for dashboard charts
- **Authentication**: Required

#### Get Dashboard Rejects Data

- **Method**: `GET`
- **URL**: `/dashboard/rejects`
- **Headers**:
  - `Authorization: your_admin_token_here`
  - `Content-Type: application/json`
- **Query Parameters**:
  - `range` (string): Time range for data
    - Available values: `all`, `year`, `month`, `week`, `day`
- **Example**: `https://api.dev-e4d.workers.dev/dashboard/rejects?range=day`
- **Description**: Retrieves rejection statistics for dashboard
- **Authentication**: Required

#### Get Best Performers

- **Method**: `GET`
- **URL**: `/dashboard/best`
- **Headers**:
  - `Authorization: your_admin_token_here`
  - `Content-Type: application/json`
- **Query Parameters**:
  - `range` (string): Time range for data
    - Available values: `week`, `month`, `year`
- **Example**: `https://api.dev-e4d.workers.dev/dashboard/best?range=week`
- **Description**: Retrieves best performing managers data
- **Authentication**: Required

#### Get Worst Performers

- **Method**: `GET`
- **URL**: `/dashboard/worst`
- **Headers**:
  - `Authorization: your_admin_token_here`
  - `Content-Type: application/json`
- **Query Parameters**:
  - `range` (string): Time range for data
    - Available values: `week`, `month`, `year`
- **Example**: `https://api.dev-e4d.workers.dev/dashboard/worst?range=year`
- **Description**: Retrieves worst performing managers data
- **Authentication**: Required

### 6. Processes Management Endpoints

#### Get Process Statistics

- **Method**: `GET`
- **URL**: `/processes/statistic`
- **Headers**:
  - `Authorization: your_admin_token_here`
  - `Content-Type: application/json`
- **Description**: Retrieves process statistics and monitoring data
- **Authentication**: Required

### 7. Settings Management Endpoints

_Note: Settings endpoints are available but specific details not provided in the Postman collection_

## Role-Based Access Control

### Available Roles

1. **admins** - Full administrative access
2. **dashboard** - Dashboard viewing permissions
3. **calls** - Call management access
4. **managers** - Manager management access
5. **processes** - Process monitoring access
6. **settings** - System settings access

### Role Assignment

- Multiple roles can be assigned to a single admin
- Roles are comma-separated in the API request
- Example: `"admins,dashboard"` grants both admin and dashboard access

## Data Models

### Admin User Model

```typescript
interface Admin {
  id: number;
  full_name: string;
  email: string;
  role: string[]; // Array of roles
  photo?: string; // Profile photo URL
  is_blocked: number; // 0 or 1
  created_at: string;
  last_login_at: string;
}
```

### API Response Model

```typescript
interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}
```

### Login Request Model

```typescript
interface LoginRequest {
  email: string;
  password: string;
}
```

### Login Response Model

```typescript
interface LoginResponse {
  token: string;
  user: {
    id: number;
    full_name: string;
    email: string;
    role: string;
    photo?: string;
  };
}
```

### Call Model

```typescript
interface Call {
  id: number;
  phone_number: string;
  manager_id: number;
  is_checked: number; // 0 or 1
  ai_score: number; // 0-100
  reject_reason?:
    | "expensive"
    | "no_trust"
    | "thinking"
    | "no_budget"
    | "weak_followup"
    | "already_bought";
  status: "done" | "waiting" | "error";
  created_at: string;
  updated_at: string;
}
```

### Manager Model

```typescript
interface Manager {
  id: number;
  full_name: string;
  email: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}
```

### Dashboard Statistics Model

```typescript
interface DashboardStats {
  total_calls: number;
  checked_calls: number;
  average_ai_score: number;
  best_managers: Manager[];
  worst_managers: Manager[];
  rejection_stats: {
    [key: string]: number;
  };
}
```

### Pagination Model

```typescript
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
}
```

### Admin Create/Edit Request Model

```typescript
interface AdminRequest {
  full_name: string;
  email: string;
  role: string; // Comma-separated roles
  password: string;
  photo?: File;
}
```

## Error Handling

### Common HTTP Status Codes

- **200**: Success
- **201**: Created (for POST requests)
- **400**: Bad Request (invalid data)
- **401**: Unauthorized (invalid/missing token)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Internal Server Error

### Error Response Format

```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": {}
}
```

## Pagination

### Query Parameters

- **page**: Page number (starts from 1)
- **per_page**: Items per page (default: 10)
- **search**: Search term for filtering

### Pagination Response Format

```json
{
  "status": true,
  "message": "Success",
  "data": {
    "data": [...],
    "pagination": {
      "current_page": 2,
      "total_pages": 5,
      "total_items": 50,
      "items_per_page": 10
    }
  }
}
```

## File Upload

### Supported File Types

- **Profile Photos**: PNG, JPG, JPEG
- **Maximum Size**: 5MB (estimated)

### File Upload Process

1. Use `multipart/form-data` for file uploads
2. Include file in form data with key `photo`
3. Server returns file URL in response

## Security Considerations

### Authentication Flow

1. User submits login credentials
2. Server validates credentials
3. Server returns JWT token
4. Client includes token in `Authorization` header for subsequent requests

### Token Management

- Tokens should be stored securely (localStorage/sessionStorage)
- Tokens expire after a certain period
- Implement token refresh mechanism for long sessions

### Role-Based Security

- Each endpoint validates user permissions
- Admin operations require appropriate role assignments
- Sensitive operations require admin role

## Integration with Frontend

### API Service Structure

```typescript
// Example API service structure
class ApiService {
  private baseUrl = "https://api.dev-e4d.workers.dev";
  private token: string | null = null;

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders() {
    return {
      "Content-Type": "application/json",
      Authorization: this.token ? `Bearer ${this.token}` : "",
    };
  }

  async login(email: string, password: string) {
    // Implementation
  }

  async getProfile() {
    // Implementation
  }

  async getAdmins(page: number, search?: string) {
    // Implementation
  }

  // ... other methods
}
```

### State Management Integration

```typescript
// Zustand store example
interface AuthStore {
  user: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
}
```

## Development Notes

### Environment Configuration

- **Development**: `https://api.dev-e4d.workers.dev`
- **Production**: Update base URL for production environment
- **Local Development**: Consider using environment variables

### Testing

- Use Postman collection for API testing
- Implement unit tests for API service methods
- Test error handling and edge cases

### Monitoring

- Log API requests and responses
- Monitor authentication failures
- Track API performance metrics

## Additional Notes

### Rejection Reasons Mapping

The API uses the following rejection reason codes with their Ukrainian translations:

```json
{
  "expensive": "Дорого",
  "no_trust": "Немає довіри",
  "thinking": "Думає",
  "no_budget": "Немає бюджету",
  "weak_followup": "Менеджер не дотиснув",
  "already_bought": "Вже купив"
}
```

### Call Status Mapping

```json
{
  "done": "Виконано",
  "waiting": "Очікування",
  "error": "Помилка"
}
```

### AI Score Ranges

- **Score Range**: 0-100
- **High Performance**: 90-100
- **Good Performance**: 70-89
- **Average Performance**: 50-69
- **Low Performance**: 0-49

### Time Range Options

Most analytics endpoints support the following time ranges:

- `day` - Last 24 hours
- `week` - Last 7 days
- `month` - Last 30 days
- `year` - Last 12 months
- `all` - All time (where supported)

### API Integration Examples

#### Fetching Dashboard Data

```javascript
// Get main dashboard statistics
const dashboardMain = await fetch("/dashboard/main", {
  headers: { Authorization: "your_token_here" },
});

// Get call dynamics for the year
const callDynamics = await fetch("/dashboard/dynamics?range=year&type=calls", {
  headers: { Authorization: "your_token_here" },
});
```

#### Filtering Calls

```javascript
// Get calls with specific filters
const filteredCalls = await fetch(
  "/calls/catalog?page=1&per_page=20&ai_score=80-100&status=done&is_checked=1",
  {
    headers: { Authorization: "your_token_here" },
  }
);
```

#### Manager Performance Analysis

```javascript
// Get manager dynamics
const managerPerformance = await fetch(
  "/managers/dynamics/3?range=month&type=ai_avg",
  {
    headers: { Authorization: "your_token_here" },
  }
);
```
