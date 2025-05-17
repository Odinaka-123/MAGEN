# MAGEN Project: Technical Reference


## 1. API Contracts

### Authentication

#### POST `/api/auth/register`
- **Request Body:**
  - `email` (string, required)
  - `password` (string, required)
  - `name` (string, optional)
- **Response:**
  - `user` (object)
  - `token` (string)

#### POST `/api/auth/login`
- **Request Body:**
  - `email` (string, required)
  - `password` (string, required)
- **Response:**
  - `user` (object)
  - `token` (string)

### Breaches

#### GET `/api/breaches`
- **Query Params:**
  - `userId` (string, optional)
- **Response:**
  - `breaches` (array of breach objects)

#### POST `/api/breaches`
- **Request Body:**
  - `title` (string, required)
  - `description` (string, required)
  - `date` (string, required)
  - `affectedUsers` (array, optional)
- **Response:**
  - `breach` (object)

### Alerts

#### GET `/api/alerts`
- **Query Params:**
  - `userId` (string, optional)
- **Response:**
  - `alerts` (array of alert objects)

#### POST `/api/alerts`
- **Request Body:**
  - `userId` (string, required)
  - `message` (string, required)
  - `type` (string, required)
- **Response:**
  - `alert` (object)

### Users

#### GET `/api/users/:id`
- **Response:**
  - `user` (object)

#### PATCH `/api/users/:id`
- **Request Body:**
  - `name`, `email`, `password`, etc. (fields to update)
- **Response:**
  - `user` (object)

---

## 2. Component Props Reference

### DashboardStats
- **Props:**
  - `breachCount` (number)
  - `alertCount` (number)
  - `userName` (string)

### BreachesTable
- **Props:**
  - `breaches` (array of breach objects)
  - `onSelectBreach` (function)

### RecentAlerts
- **Props:**
  - `alerts` (array of alert objects)

### PrivacyRecommendations
- **Props:**
  - `recommendations` (array of strings)

### LoginForm
- **Props:**
  - `onSubmit` (function)
  - `loading` (boolean)
  - `error` (string | null)

### RegisterForm
- **Props:**
  - `onSubmit` (function)
  - `loading` (boolean)
  - `error` (string | null)

### SettingsForm
- **Props:**
  - `user` (user object)
  - `onSave` (function)
  - `loading` (boolean)
  - `error` (string | null)

---

## 3. Service Logic

### Backend Services

#### breachDetectionService.js
- Scans for new breaches, matches user data, and triggers alerts.
- Exposes functions:
  - `scanForBreaches(userId)`
  - `addBreach(breachData)`

#### emailService.js
- Sends notification emails to users.
- Exposes functions:
  - `sendAlertEmail(userEmail, message)`

#### darkWebScanner.js
- Checks for user credentials on dark web sources.
- Exposes functions:
  - `scanUserCredentials(userId)`

### Frontend Services

#### services/api.ts
- Handles HTTP requests to backend endpoints.
- Example functions:
  - `login(email, password)`
  - `register(userData)`
  - `getBreaches(userId)`
  - `getAlerts(userId)`
  - `updateUser(userId, data)`

#### services/database.ts
- (If used) Handles local storage or client-side caching.
- Example functions:
  - `saveUserSession(sessionData)`
  - `getUserSession()`

---

## 4. Data Models (Simplified)

### User
```ts
{
  _id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
  updatedAt: string;
}
```

### Breach
```ts
{
  _id: string;
  title: string;
  description: string;
  date: string;
  affectedUsers: string[];
}
```

### Alert
```ts
{
  _id: string;
  userId: string;
  message: string;
  type: string;
  createdAt: string;
}
```

---

## 5. Example Usage

### Fetching Breaches (Frontend)
```ts
import { getBreaches } from '../services/api';
const breaches = await getBreaches(userId);
```

### Using BreachesTable Component
```tsx
<BreachesTable breaches={breaches} onSelectBreach={handleSelectBreach} />
```

---

For further details, see the code in the `routes/`, `controllers/`, `models/`, and `magen-frontend/components/` directories.
