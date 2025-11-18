# Course Service API Documentation

## Overview

The Course Service provides comprehensive course management for the Cybersecurity Training Platform, including course CRUD operations, module and chapter management, publishing workflow, course duplication, and statistics tracking.

## Base URL

```
http://localhost:3004
```

## Authentication

All endpoints require a valid JWT token:

```
Authorization: Bearer <token>
```

## Data Models

### Course Structure

- **Course** → Contains multiple **Modules** → Each module contains multiple **Chapters**
- Hierarchical content organization for structured learning

### Course Status Flow

```
DRAFT → UNDER_REVIEW → PUBLISHED → ARCHIVED
```

## Enumerations

### CourseStatus

- `DRAFT` - Course is being created/edited
- `PUBLISHED` - Course is live and available
- `ARCHIVED` - Course is no longer active
- `UNDER_REVIEW` - Course pending approval

### Difficulty

- `BEGINNER` - Entry-level content
- `INTERMEDIATE` - Moderate difficulty
- `ADVANCED` - High-level content
- `EXPERT` - Specialized expert content

### CourseCategory

- `PHISHING`
- `PASSWORD_SECURITY`
- `DATA_PROTECTION`
- `SOCIAL_ENGINEERING`
- `MALWARE`
- `NETWORK_SECURITY`
- `COMPLIANCE`
- `INCIDENT_RESPONSE`
- `SECURITY_AWARENESS`
- `CLOUD_SECURITY`
- `APPLICATION_SECURITY`
- `CRYPTOGRAPHY`

## Endpoints

### 1. Create Course

Create a new course with optional modules.

**Endpoint:** `POST /courses`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`, `INSTRUCTOR`

**Request Body:**

```json
{
  "title": "Advanced Phishing Prevention",
  "description": "Learn advanced techniques to identify and prevent phishing attacks",
  "tenantId": "tenant-uuid",
  "category": "PHISHING",
  "difficulty": "ADVANCED",
  "duration": 120,
  "thumbnail": "https://example.com/thumbnail.jpg",
  "scormPackage": "path/to/scorm.zip",
  "prerequisites": ["prerequisite-course-id"],
  "certificateTemplate": "template-id",
  "createdBy": "creator-user-id",
  "tags": ["security", "phishing", "email"],
  "passingScore": 80,
  "modules": [
    {
      "title": "Introduction to Phishing",
      "description": "Learn the basics",
      "order": 1
    }
  ]
}
```

**Response:** `201 Created`

```json
{
  "id": "course-uuid",
  "title": "Advanced Phishing Prevention",
  "description": "Learn advanced techniques...",
  "tenantId": "tenant-uuid",
  "category": "PHISHING",
  "difficulty": "ADVANCED",
  "duration": 120,
  "status": "DRAFT",
  "version": 1,
  "tags": ["security", "phishing", "email"],
  "passingScore": 80,
  "createdAt": "2025-11-18T10:00:00.000Z",
  "modules": [
    {
      "id": "module-uuid",
      "title": "Introduction to Phishing",
      "order": 1
    }
  ]
}
```

---

### 2. List Courses

Get all courses with pagination and filtering.

**Endpoint:** `GET /courses`

**Required Roles:** All authenticated users

**Query Parameters:**

| Parameter  | Type           | Description                  |
| ---------- | -------------- | ---------------------------- |
| page       | number         | Page number (default: 1)     |
| limit      | number         | Items per page (default: 20) |
| search     | string         | Search in title/description  |
| category   | CourseCategory | Filter by category           |
| difficulty | Difficulty     | Filter by difficulty level   |
| status     | CourseStatus   | Filter by status             |
| tag        | string         | Filter by tag                |
| tenantId   | string         | Tenant ID (SUPER_ADMIN only) |

**Example Request:**

```bash
GET /courses?page=1&limit=20&category=PHISHING&difficulty=ADVANCED&status=PUBLISHED
```

**Response:** `200 OK`

```json
{
  "data": [
    {
      "id": "course-uuid",
      "title": "Advanced Phishing Prevention",
      "description": "Learn advanced techniques...",
      "category": "PHISHING",
      "difficulty": "ADVANCED",
      "duration": 120,
      "status": "PUBLISHED",
      "thumbnail": "https://example.com/thumbnail.jpg",
      "tags": ["security", "phishing"],
      "passingScore": 80,
      "_count": {
        "modules": 5,
        "enrollments": 42
      },
      "createdAt": "2025-11-18T10:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### 3. Get Course by ID

Retrieve complete course details with modules and chapters.

**Endpoint:** `GET /courses/:id`

**Required Roles:** All authenticated users

**Response:** `200 OK`

```json
{
  "id": "course-uuid",
  "title": "Advanced Phishing Prevention",
  "description": "Learn advanced techniques...",
  "category": "PHISHING",
  "difficulty": "ADVANCED",
  "duration": 120,
  "status": "PUBLISHED",
  "modules": [
    {
      "id": "module-uuid-1",
      "title": "Introduction",
      "description": "Getting started",
      "order": 1,
      "chapters": [
        {
          "id": "chapter-uuid-1",
          "title": "What is Phishing?",
          "content": "<h1>Content here</h1>",
          "order": 1,
          "duration": 15,
          "videoUrl": "https://example.com/video.mp4",
          "isRequired": true
        }
      ]
    }
  ],
  "_count": {
    "enrollments": 42
  }
}
```

---

### 4. Update Course

Update course information.

**Endpoint:** `PATCH /courses/:id`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`, `INSTRUCTOR`

**Request Body:**

```json
{
  "title": "Updated Course Title",
  "description": "Updated description",
  "difficulty": "EXPERT",
  "duration": 150,
  "tags": ["security", "advanced"],
  "passingScore": 85
}
```

**Response:** `200 OK` (updated course object)

---

### 5. Delete Course

Delete a course (only if no enrollments exist).

**Endpoint:** `DELETE /courses/:id`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`

**Response:** `200 OK`

```json
{
  "message": "Course deleted successfully"
}
```

**Business Rules:**

- Cannot delete courses with active enrollments
- Use archive instead for courses with enrollments

---

### 6. Publish Course

Publish a draft course to make it available to learners.

**Endpoint:** `POST /courses/:id/publish`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`, `INSTRUCTOR`

**Request Body:**

```json
{
  "publishNotes": "Ready for production release"
}
```

**Response:** `200 OK`

```json
{
  "id": "course-uuid",
  "title": "Advanced Phishing Prevention",
  "status": "PUBLISHED",
  "publishedAt": "2025-11-18T14:30:00.000Z"
}
```

**Validation:**

- Course must have at least one module
- Course must be in DRAFT or UNDER_REVIEW status

---

### 7. Archive Course

Archive a published course.

**Endpoint:** `POST /courses/:id/archive`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`

**Response:** `200 OK`

```json
{
  "id": "course-uuid",
  "status": "ARCHIVED"
}
```

---

### 8. Duplicate Course

Create a copy of an existing course.

**Endpoint:** `POST /courses/:id/duplicate`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`, `INSTRUCTOR`

**Request Body:**

```json
{
  "newTitle": "Copy of Advanced Phishing Prevention",
  "includeModules": true,
  "includeChapters": true
}
```

**Response:** `201 Created`

```json
{
  "id": "new-course-uuid",
  "title": "Copy of Advanced Phishing Prevention",
  "status": "DRAFT",
  "version": 1
}
```

**Options:**

- `includeModules`: Copy all modules
- `includeChapters`: Copy all chapters within modules

---

### 9. Get Course Statistics

Retrieve enrollment and completion statistics.

**Endpoint:** `GET /courses/:id/stats`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`, `INSTRUCTOR`, `MANAGER`

**Response:** `200 OK`

```json
{
  "enrollments": 150,
  "completions": 120,
  "completionRate": 80.0,
  "averageProgress": 85.5
}
```

---

### 10. Assign Instructor

Assign an instructor to a course.

**Endpoint:** `POST /courses/:id/instructors`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`

**Request Body:**

```json
{
  "instructorId": "instructor-user-uuid",
  "role": "Primary instructor"
}
```

**Response:** `200 OK`

```json
{
  "message": "Instructor assigned successfully"
}
```

**Validation:**

- User must have INSTRUCTOR or TENANT_ADMIN role
- User must exist in the same tenant

---

## Module Management

### 11. Create Module

Add a module to a course.

**Endpoint:** `POST /courses/:id/modules`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`, `INSTRUCTOR`

**Request Body:**

```json
{
  "title": "Advanced Techniques",
  "description": "Deep dive into advanced concepts",
  "order": 2
}
```

**Response:** `201 Created`

```json
{
  "id": "module-uuid",
  "courseId": "course-uuid",
  "title": "Advanced Techniques",
  "description": "Deep dive into advanced concepts",
  "order": 2,
  "createdAt": "2025-11-18T10:00:00.000Z"
}
```

---

### 12. Update Module

Update module information.

**Endpoint:** `PATCH /courses/:courseId/modules/:moduleId`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`, `INSTRUCTOR`

**Request Body:**

```json
{
  "title": "Updated Module Title",
  "description": "Updated description",
  "order": 3
}
```

**Response:** `200 OK` (updated module object)

---

### 13. Delete Module

Delete a module from a course.

**Endpoint:** `DELETE /courses/:courseId/modules/:moduleId`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`, `INSTRUCTOR`

**Response:** `200 OK`

```json
{
  "message": "Module deleted successfully"
}
```

**Note:** Cascades to delete all chapters within the module

---

## Chapter Management

### 14. Create Chapter

Add a chapter to a module.

**Endpoint:** `POST /courses/:courseId/modules/:moduleId/chapters`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`, `INSTRUCTOR`

**Request Body:**

```json
{
  "title": "Identifying Phishing Emails",
  "content": "<h1>Chapter Content</h1><p>Detailed content here...</p>",
  "order": 1,
  "duration": 15,
  "videoUrl": "https://example.com/video.mp4",
  "isRequired": true
}
```

**Response:** `201 Created`

```json
{
  "id": "chapter-uuid",
  "moduleId": "module-uuid",
  "title": "Identifying Phishing Emails",
  "content": "<h1>Chapter Content</h1>...",
  "order": 1,
  "duration": 15,
  "videoUrl": "https://example.com/video.mp4",
  "isRequired": true,
  "createdAt": "2025-11-18T10:00:00.000Z"
}
```

---

### 15. Update Chapter

Update chapter content.

**Endpoint:** `PATCH /courses/:courseId/modules/:moduleId/chapters/:chapterId`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`, `INSTRUCTOR`

**Request Body:**

```json
{
  "title": "Updated Chapter Title",
  "content": "<h1>Updated Content</h1>",
  "order": 2,
  "duration": 20,
  "isRequired": false
}
```

**Response:** `200 OK` (updated chapter object)

---

### 16. Delete Chapter

Delete a chapter from a module.

**Endpoint:** `DELETE /courses/:courseId/modules/:moduleId/chapters/:chapterId`

**Required Roles:** `SUPER_ADMIN`, `TENANT_ADMIN`, `INSTRUCTOR`

**Response:** `200 OK`

```json
{
  "message": "Chapter deleted successfully"
}
```

---

## Event Emissions

| Event              | Trigger            | Payload                                              |
| ------------------ | ------------------ | ---------------------------------------------------- |
| `COURSE_CREATED`   | Course creation    | courseId, title, tenantId, category, createdBy       |
| `COURSE_UPDATED`   | Course update      | courseId, tenantId, changes, updatedBy               |
| `COURSE_PUBLISHED` | Course publication | courseId, title, tenantId, publishedBy, publishNotes |
| `COURSE_ARCHIVED`  | Course archival    | courseId, tenantId, archivedBy                       |

---

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Cannot publish course without modules",
  "error": "Bad Request"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Course with ID 'course-uuid' not found",
  "error": "Not Found"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "User is not an instructor",
  "error": "Forbidden"
}
```

---

## Rate Limiting

- **100 requests per minute** per IP address
- Exceeded limits return `429 Too Many Requests`

---

## cURL Examples

### Create Course

```bash
curl -X POST http://localhost:3004/courses \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Security Awareness Training",
    "description": "Complete security awareness program",
    "tenantId": "tenant-uuid",
    "category": "SECURITY_AWARENESS",
    "difficulty": "BEGINNER",
    "duration": 60,
    "createdBy": "user-uuid",
    "passingScore": 70
  }'
```

### Publish Course

```bash
curl -X POST http://localhost:3004/courses/{courseId}/publish \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "publishNotes": "Ready for launch"
  }'
```

### Create Module

```bash
curl -X POST http://localhost:3004/courses/{courseId}/modules \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Introduction Module",
    "description": "Getting started",
    "order": 1
  }'
```

### Create Chapter

```bash
curl -X POST http://localhost:3004/courses/{courseId}/modules/{moduleId}/chapters \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "First Chapter",
    "content": "<h1>Welcome</h1>",
    "order": 1,
    "duration": 10,
    "isRequired": true
  }'
```

---

## TypeScript Client Example

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:3004',
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

// Create a course
const createCourse = async () => {
  const response = await apiClient.post('/courses', {
    title: 'Security Awareness Training',
    description: 'Complete program',
    tenantId: 'tenant-uuid',
    category: 'SECURITY_AWARENESS',
    difficulty: 'BEGINNER',
    duration: 60,
    createdBy: 'user-uuid',
    passingScore: 70,
  });
  return response.data;
};

// Publish course
const publishCourse = async (courseId: string) => {
  const response = await apiClient.post(`/courses/${courseId}/publish`, {
    publishNotes: 'Ready for launch',
  });
  return response.data;
};

// Create module
const createModule = async (courseId: string) => {
  const response = await apiClient.post(`/courses/${courseId}/modules`, {
    title: 'Introduction Module',
    description: 'Getting started',
    order: 1,
  });
  return response.data;
};

// Get course statistics
const getCourseStats = async (courseId: string) => {
  const response = await apiClient.get(`/courses/${courseId}/stats`);
  return response.data;
};
```

---

## Business Rules

### Course Creation

- Must belong to a valid tenant
- Status defaults to DRAFT
- Version starts at 1
- Duration in minutes (required)

### Publishing

- Must have at least one module
- Only DRAFT or UNDER_REVIEW courses can be published
- Sets publishedAt timestamp

### Deletion

- Cannot delete courses with enrollments
- Use archive instead
- Cascades to modules and chapters

### Duplication

- Always creates DRAFT status
- Resets version to 1
- Can optionally include modules and chapters
- Assigns new creator

### Content Hierarchy

- Course → Modules → Chapters
- Order field determines sequence
- Cascading deletes maintain integrity

---

## Swagger Documentation

Interactive API documentation available at:

```
http://localhost:3004/api/docs
```

Features:

- Interactive endpoint testing
- Request/response schemas
- Authentication testing
- Example values
- Model definitions
