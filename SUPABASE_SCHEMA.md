# Supabase Database Schema - Tables

### 1. `users`
Stores user account information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique user identifier |
| `username` | Text | Not Null | User's display name |
| `ccnumber` | Text | | Cinema City Unlimited card number |

**Relationships:**
- One-to-Many with `users_availability` (user can have multiple availability records)
- Many-to-Many with `meetings` (through `meeting_users`)

---

### 2. `users_availability`
Stores user availability for specific dates and time slots.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `user_id` | UUID | Foreign Key (users.id), Primary Key | Reference to user |
| `date` | Text | Primary Key | Date in YYYY-MM-DD format |
| `availability` | JSONB | | Availability payload (time slots available for this date) |

**Primary Key:** Composite (`user_id`, `date`)

**Relationships:**
- Many-to-One with `users` (user_id)

**Indexes:**
- Index on `(user_id, date)` for efficient queries

---

### 3. `meetings`
Stores planner/meeting information for cinema screening events.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | Primary Key | Unique meeting identifier |
| `name` | Text | Not Null | Meeting/planner name |
| `cinema_id` | Integer | Not Null | Reference to cinema location |
| `start_hour` | Integer | Not Null | Meeting start time (hour) |
| `end_hour` | Integer | Not Null | Meeting end time (hour) |
| `host_id` | UUID | Foreign Key (users.id) | User ID of the planner creator |
| `created_at` | Timestamp | | Timestamp when meeting was created |

**Relationships:**
- Many-to-One with `users` (host_id)
- One-to-Many with `meeting_users` (meeting can have multiple participants)
- One-to-Many with `movies_added` (meeting can have multiple movies)

---

### 4. `meeting_users`
Junction table for Many-to-Many relationship between meetings and users (participants).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `meeting_id` | UUID | Foreign Key (meetings.id), Primary Key | Reference to meeting |
| `user_id` | UUID | Foreign Key (users.id), Primary Key | Reference to participant user |

**Primary Key:** Composite (`meeting_id`, `user_id`)

**Relationships:**
- Many-to-One with `meetings` (meeting_id)
- Many-to-One with `users` (user_id)

---

### 5. `movies_added`
Stores movies associated with a meeting and tracks user bans/votes.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `meeting_id` | UUID | Foreign Key (meetings.id), Primary Key | Reference to meeting |
| `external_movie_id` | Text | Primary Key | External movie identifier (from cinema API) |
| `bans` | Text[] | | Array of user IDs who banned this movie |

**Primary Key:** Composite (`meeting_id`, `external_movie_id`)

**Relationships:**
- Many-to-One with `meetings` (meeting_id)


