# Content Service API Documentation

**Version:** 1.0
**Base URL:** `http://localhost:3004`
**Swagger Docs:** `http://localhost:3004/api/docs`

## Overview

The Content Service manages file uploads, media storage, SCORM package processing, video transcoding, and CDN integration for the cybersecurity training platform.

## Features

- ✅ Single & multipart file uploads
- ✅ Media storage (S3/MinIO or local filesystem)
- ✅ SCORM 1.2/2004 package parsing
- ✅ Video transcoding (multiple qualities)
- ✅ Streaming support (HLS/DASH)
- ✅ CDN integration with signed URLs
- ✅ File type detection and validation
- ✅ Metadata management

## Authentication

All endpoints require a valid JWT token:

```
Authorization: Bearer <token>
```

## Endpoints

### 1. File Upload

#### 1.1 Upload Single File

Upload a single file (images, videos, documents, etc.)

**Endpoint:** `POST /content/upload`

**Request:**

```http
POST /content/upload
Content-Type: multipart/form-data

file: <binary>
tenantId: "tenant-uuid"
type: "IMAGE" | "VIDEO" | "DOCUMENT" | "SCORM" | "OTHER"
uploadedBy: "user-uuid" (optional)
```

**Response:**

```json
{
  "id": "media-uuid",
  "tenantId": "tenant-uuid",
  "filename": "tenant-uuid/uuid-example.jpg",
  "originalName": "example.jpg",
  "mimeType": "image/jpeg",
  "size": 1024567,
  "url": "https://bucket.s3.amazonaws.com/...",
  "cdnUrl": "https://cdn.example.com/...",
  "type": "IMAGE",
  "metadata": {},
  "uploadedBy": "user-uuid",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

**Example:**

```bash
curl -X POST http://localhost:3004/content/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@./image.jpg" \
  -F "tenantId=tenant-123" \
  -F "type=IMAGE" \
  -F "uploadedBy=user-456"
```

---

#### 1.2 Initialize Multipart Upload

Initialize multipart upload for large files (> 5GB)

**Endpoint:** `POST /content/upload/multipart/init`

**Request:**

```json
{
  "filename": "large-video.mp4",
  "tenantId": "tenant-uuid",
  "mimeType": "video/mp4",
  "totalSize": 5368709120,
  "type": "VIDEO"
}
```

**Response:**

```json
{
  "uploadId": "upload-uuid",
  "mediaId": "media-uuid",
  "key": "tenant-uuid/large-video.mp4"
}
```

---

#### 1.3 Upload Part

Upload a single part of a multipart upload

**Endpoint:** `POST /content/upload/multipart/part`

**Request:**

```http
POST /content/upload/multipart/part
Content-Type: multipart/form-data

file: <binary part>
uploadId: "upload-uuid"
partNumber: 1
```

**Response:**

```json
{
  "partNumber": 1,
  "etag": "etag-string",
  "uploadUrl": "pending/upload-uuid/1"
}
```

---

#### 1.4 Complete Multipart Upload

Complete multipart upload after all parts are uploaded

**Endpoint:** `POST /content/upload/multipart/complete`

**Request:**

```json
{
  "uploadId": "upload-uuid",
  "parts": ["etag1", "etag2", "etag3"]
}
```

**Response:**

```json
{
  "id": "media-uuid",
  "tenantId": "tenant-uuid",
  "filename": "uploads/upload-uuid",
  "originalName": "large-video.mp4",
  "url": "https://bucket.s3.amazonaws.com/...",
  "cdnUrl": "https://cdn.example.com/...",
  ...
}
```

---

#### 1.5 Abort Multipart Upload

Cancel an in-progress multipart upload

**Endpoint:** `POST /content/upload/multipart/abort`

**Request:**

```json
{
  "uploadId": "upload-uuid"
}
```

**Response:**

```
204 No Content
```

---

### 2. SCORM Package Management

#### 2.1 Upload SCORM Package

Upload and extract SCORM package (ZIP file)

**Endpoint:** `POST /content/scorm/upload`

**Request:**

```http
POST /content/scorm/upload
Content-Type: multipart/form-data

file: <scorm.zip>
courseId: "course-uuid"
tenantId: "tenant-uuid"
version: "1.2" (optional, default: "1.2")
```

**Response:**

```json
{
  "id": "scorm-uuid",
  "courseId": "course-uuid",
  "version": "1.2",
  "manifest": {
    "identifier": "manifest-id",
    "version": "1.2",
    "metadata": {
      "schema": "ADL SCORM",
      "schemaversion": "1.2"
    },
    "organizations": [...],
    "resources": [...]
  },
  "extractPath": "tenant-uuid/scorm/uuid",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

**Example:**

```bash
curl -X POST http://localhost:3004/content/scorm/upload \
  -H "Authorization: Bearer <token>" \
  -F "file=@./course-package.zip" \
  -F "courseId=course-123" \
  -F "tenantId=tenant-123" \
  -F "version=1.2"
```

---

#### 2.2 Parse SCORM Manifest

Parse SCORM manifest from previously uploaded package

**Endpoint:** `POST /content/scorm/parse`

**Request:**

```json
{
  "mediaId": "media-uuid"
}
```

**Response:**

```json
{
  "id": "scorm-uuid",
  "courseId": "course-uuid",
  "version": "1.2",
  "manifest": { ... },
  "extractPath": "tenant-uuid/scorm/uuid",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

---

### 3. Video Transcoding

#### 3.1 Transcode Video

Transcode video to multiple qualities and formats

**Endpoint:** `POST /content/video/transcode`

**Request:**

```json
{
  "mediaId": "media-uuid",
  "qualities": ["720p", "1080p"],
  "generateHls": true,
  "generateDash": false
}
```

**Available Qualities:**

- `360p` - SD 360p
- `480p` - SD 480p
- `720p` - HD 720p
- `1080p` - HD 1080p
- `1440p` - HD 1440p
- `4k` - UHD 4K

**Response:**

```json
{
  "jobId": "job-uuid",
  "mediaId": "media-uuid",
  "status": "PROCESSING",
  "qualities": ["720p", "1080p"],
  "progress": 0
}
```

**Example:**

```bash
curl -X POST http://localhost:3004/content/video/transcode \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "mediaId": "media-123",
    "qualities": ["720p", "1080p"],
    "generateHls": true,
    "generateDash": false
  }'
```

---

#### 3.2 Get Transcoding Status

Check status of transcoding job

**Endpoint:** `GET /content/video/transcode/:jobId`

**Response:**

```json
{
  "jobId": "job-uuid",
  "mediaId": "media-uuid",
  "status": "COMPLETED",
  "qualities": ["720p", "1080p"],
  "progress": 100
}
```

**Status Values:**

- `PENDING` - Job queued
- `PROCESSING` - Transcoding in progress
- `COMPLETED` - Transcoding finished
- `FAILED` - Transcoding failed

---

#### 3.3 Get Streaming URL

Get streaming URL for HLS or DASH playback

**Endpoint:** `POST /content/video/streaming-url`

**Request:**

```json
{
  "mediaId": "media-uuid",
  "protocol": "HLS",
  "quality": "1080p"
}
```

**Response:**

```json
{
  "url": "https://cdn.example.com/path/1080p/playlist.m3u8",
  "expiresAt": "2025-01-15T11:30:00Z"
}
```

**Example:**

```bash
curl -X POST http://localhost:3004/content/video/streaming-url \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "mediaId": "media-123",
    "protocol": "HLS",
    "quality": "720p"
  }'
```

---

### 4. Media Management

#### 4.1 List Media

List all media files with optional filters

**Endpoint:** `GET /content/media`

**Query Parameters:**

- `tenantId` (optional) - Filter by tenant
- `type` (optional) - Filter by file type (IMAGE, VIDEO, DOCUMENT, SCORM, OTHER)
- `transcodingStatus` (optional) - Filter by transcoding status
- `search` (optional) - Search by filename
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 20, max: 100)

**Response:**

```json
{
  "data": [
    {
      "id": "media-uuid",
      "tenantId": "tenant-uuid",
      "filename": "path/to/file.jpg",
      "originalName": "file.jpg",
      "mimeType": "image/jpeg",
      "size": 1024567,
      "url": "https://...",
      "cdnUrl": "https://...",
      "type": "IMAGE",
      "uploadedBy": "user-uuid",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20
}
```

**Examples:**

```bash
# List all media for a tenant
curl "http://localhost:3004/content/media?tenantId=tenant-123" \
  -H "Authorization: Bearer <token>"

# Filter by video type
curl "http://localhost:3004/content/media?type=VIDEO&page=2&limit=50" \
  -H "Authorization: Bearer <token>"

# Search by filename
curl "http://localhost:3004/content/media?search=training-video" \
  -H "Authorization: Bearer <token>"

# Filter by transcoding status
curl "http://localhost:3004/content/media?transcodingStatus=COMPLETED" \
  -H "Authorization: Bearer <token>"
```

---

#### 4.2 Get Media by ID

Get detailed information about a specific media file

**Endpoint:** `GET /content/media/:id`

**Response:**

```json
{
  "id": "media-uuid",
  "tenantId": "tenant-uuid",
  "filename": "path/to/file.mp4",
  "originalName": "training-video.mp4",
  "mimeType": "video/mp4",
  "size": 52428800,
  "url": "https://bucket.s3.amazonaws.com/...",
  "cdnUrl": "https://cdn.example.com/...",
  "type": "VIDEO",
  "metadata": {
    "duration": 300,
    "resolution": "1920x1080"
  },
  "uploadedBy": "user-uuid",
  "transcodingStatus": "COMPLETED",
  "createdAt": "2025-01-15T10:30:00Z"
}
```

---

#### 4.3 Update Media Metadata

Update media metadata and information

**Endpoint:** `PUT /content/media/:id`

**Request:**

```json
{
  "originalName": "updated-filename.mp4",
  "metadata": {
    "description": "Updated description",
    "tags": ["security", "training"]
  }
}
```

**Response:**

```json
{
  "id": "media-uuid",
  "originalName": "updated-filename.mp4",
  "metadata": { ... },
  ...
}
```

---

#### 4.4 Delete Media

Delete media file from database and storage

**Endpoint:** `DELETE /content/media/:id`

**Query Parameters:**

- `deleteFromStorage` (optional) - Also delete from storage (default: true)

**Response:**

```
204 No Content
```

**Examples:**

```bash
# Delete from both database and storage
curl -X DELETE "http://localhost:3004/content/media/media-123" \
  -H "Authorization: Bearer <token>"

# Delete from database only (keep file in storage)
curl -X DELETE "http://localhost:3004/content/media/media-123?deleteFromStorage=false" \
  -H "Authorization: Bearer <token>"
```

---

#### 4.5 Generate CDN URL

Generate signed CDN URL with expiration

**Endpoint:** `POST /content/media/cdn-url`

**Request:**

```json
{
  "mediaId": "media-uuid",
  "expiresIn": 3600
}
```

**Response:**

```json
{
  "url": "https://cdn.example.com/signed-url?signature=...",
  "expiresAt": "2025-01-15T11:30:00Z"
}
```

**Example:**

```bash
curl -X POST http://localhost:3004/content/media/cdn-url \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "mediaId": "media-123",
    "expiresIn": 7200
  }'
```

---

## File Types

| Type       | Description      | Extensions                |
| ---------- | ---------------- | ------------------------- |
| `IMAGE`    | Images           | jpg, jpeg, png, gif, svg  |
| `VIDEO`    | Videos           | mp4, mov, avi, wmv, webm  |
| `DOCUMENT` | Documents        | pdf, doc, docx, ppt, pptx |
| `SCORM`    | SCORM packages   | zip (containing SCORM)    |
| `OTHER`    | Other file types | any                       |

## Storage Configuration

### Environment Variables

```env
# Storage Mode
USE_LOCAL_STORAGE=false          # true for local, false for S3
LOCAL_STORAGE_PATH=./storage     # Path for local storage

# S3/MinIO Configuration
S3_BUCKET=cybersec-content
S3_ENDPOINT=http://localhost:9000
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin

# CDN
CDN_URL=https://cdn.example.com

# Service
CONTENT_SERVICE_PORT=3004
```

### Local Storage

Files stored in filesystem:

```
./storage/
  tenant-uuid/
    uuid-filename.jpg
    uuid-video.mp4
    scorm/
      uuid/
        imsmanifest.xml
        ...
```

### S3/MinIO Storage

Files stored in S3-compatible storage with structure:

```
bucket/
  tenant-uuid/
    uuid-filename.jpg
    uuid-video.mp4
```

## SCORM Support

### Supported Versions

- SCORM 1.2
- SCORM 2004 (limited support)

### SCORM Package Structure

```
scorm-package.zip
├── imsmanifest.xml    (required)
├── adlcp_rootv1p2.xsd
├── ims_xml.xsd
└── content/
    ├── index.html
    └── resources/
```

### Manifest Parsing

The service extracts and parses `imsmanifest.xml` to extract:

- Course metadata
- Organization structure
- Resource definitions
- SCO (Sharable Content Objects)
- Asset references

## Video Transcoding

### Transcoding Pipeline

1. Upload original video
2. Submit transcoding job with desired qualities
3. Service transcodes video to multiple formats
4. Generates HLS/DASH manifests
5. Updates transcoding status to COMPLETED
6. Video ready for streaming

### HLS (HTTP Live Streaming)

Generates adaptive bitrate streaming:

```
video/
  720p/
    segment001.ts
    segment002.ts
    playlist.m3u8
  1080p/
    segment001.ts
    segment002.ts
    playlist.m3u8
  master.m3u8
```

### DASH (Dynamic Adaptive Streaming)

Generates MPEG-DASH manifest:

```
video/
  720p/
    segment001.m4s
    segment002.m4s
  1080p/
    segment001.m4s
    segment002.m4s
  manifest.mpd
```

## CDN Integration

### Signed URLs

Generate time-limited signed URLs for secure content delivery:

**Benefits:**

- Prevent unauthorized access
- Control content expiration
- Integrate with CDN caching
- Support private content

**Use Cases:**

- Premium course videos
- Protected documents
- SCORM packages
- Private images

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "File upload failed",
  "error": "Bad Request"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Media not found",
  "error": "Not Found"
}
```

### 413 Payload Too Large

```json
{
  "statusCode": 413,
  "message": "File too large. Use multipart upload for files > 5GB",
  "error": "Payload Too Large"
}
```

## Rate Limiting

Default limits:

- 100 requests per minute per user
- 10 concurrent uploads per tenant
- Max file size: 5GB (single upload)
- Max file size: Unlimited (multipart upload)

## Best Practices

### File Uploads

1. **Use multipart for large files** (> 5GB)
2. **Set correct file type** for proper handling
3. **Include metadata** for searchability
4. **Use CDN URLs** for public content

### Video Management

1. **Transcode after upload** for optimal playback
2. **Generate HLS** for adaptive streaming
3. **Use signed URLs** for protected content
4. **Monitor transcoding status** before playback

### SCORM Packages

1. **Validate package structure** before upload
2. **Test manifest parsing** after upload
3. **Store courseId in metadata** for linking
4. **Version packages** for updates

### Performance

1. **Use pagination** for large media lists
2. **Filter by tenant** to reduce query size
3. **Cache CDN URLs** client-side
4. **Leverage CDN caching** for static content

## Integration Examples

### Upload and Transcode Video

```javascript
// 1. Upload video
const formData = new FormData();
formData.append('file', videoFile);
formData.append('tenantId', 'tenant-123');
formData.append('type', 'VIDEO');

const uploadResponse = await fetch('http://localhost:3004/content/upload', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

const media = await uploadResponse.json();

// 2. Start transcoding
const transcodeResponse = await fetch('http://localhost:3004/content/video/transcode', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    mediaId: media.id,
    qualities: ['720p', '1080p'],
    generateHls: true,
    generateDash: false,
  }),
});

const job = await transcodeResponse.json();

// 3. Poll for completion
const checkStatus = async () => {
  const statusResponse = await fetch(`http://localhost:3004/content/video/transcode/${job.jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const status = await statusResponse.json();

  if (status.status === 'COMPLETED') {
    console.log('Transcoding complete!');
  } else if (status.status === 'FAILED') {
    console.error('Transcoding failed');
  } else {
    setTimeout(checkStatus, 5000); // Check again in 5 seconds
  }
};

checkStatus();
```

### Upload SCORM Package

```javascript
const formData = new FormData();
formData.append('file', scormZipFile);
formData.append('courseId', 'course-123');
formData.append('tenantId', 'tenant-123');
formData.append('version', '1.2');

const response = await fetch('http://localhost:3004/content/scorm/upload', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
  },
  body: formData,
});

const scormPackage = await response.json();
console.log('SCORM manifest:', scormPackage.manifest);
```

### Multipart Upload

```javascript
// 1. Initialize
const initResponse = await fetch('http://localhost:3004/content/upload/multipart/init', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    filename: 'large-video.mp4',
    tenantId: 'tenant-123',
    mimeType: 'video/mp4',
    totalSize: file.size,
    type: 'VIDEO',
  }),
});

const { uploadId, mediaId } = await initResponse.json();

// 2. Upload parts
const chunkSize = 5 * 1024 * 1024; // 5MB chunks
const parts = [];

for (let i = 0; i < file.size; i += chunkSize) {
  const chunk = file.slice(i, i + chunkSize);
  const partNumber = Math.floor(i / chunkSize) + 1;

  const formData = new FormData();
  formData.append('file', chunk);
  formData.append('uploadId', uploadId);
  formData.append('partNumber', partNumber);

  const partResponse = await fetch('http://localhost:3004/content/upload/multipart/part', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });

  const partData = await partResponse.json();
  parts.push(partData.etag);
}

// 3. Complete
const completeResponse = await fetch('http://localhost:3004/content/upload/multipart/complete', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    uploadId,
    parts,
  }),
});

const media = await completeResponse.json();
console.log('Upload complete:', media);
```

## Testing

### Start Service

```bash
npm run start:dev content-service
```

### Run Tests

```bash
npm run test content-service
npm run test:e2e content-service
```

### Access Swagger

```
http://localhost:3004/api/docs
```

## Monitoring

### Health Check

```bash
curl http://localhost:3004/health
```

### Metrics

- Total files uploaded
- Storage usage by tenant
- Transcoding job status
- CDN cache hit rate
- Upload success/failure rate

## Support

For issues or questions:

- Check Swagger documentation
- Review logs: `docker logs cybersec-content-service`
- Contact development team
