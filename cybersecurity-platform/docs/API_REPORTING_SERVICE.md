# Reporting Service API Documentation

## Overview

The Reporting Service provides comprehensive reporting capabilities including executive dashboards, compliance reports (POPIA, GDPR, SOC2, ISO 27001), custom report builder, scheduled reports, and multi-format exports.

**Base URL**: `http://localhost:3006`
**Authentication**: Bearer Token (JWT)

## Endpoints

### Executive Dashboard

#### Get Executive Dashboard Metrics

```http
GET /reports/dashboard/executive
```

**Request Body** (DashboardMetricsDto):

```json
{
  "dateRange": {
    "startDate": "2025-01-01T00:00:00Z",
    "endDate": "2025-11-18T23:59:59Z"
  },
  "departmentIds": ["uuid-1", "uuid-2"],
  "includeSubDepartments": true
}
```

**Response** (200 OK):

```json
{
  "totalUsers": 500,
  "activeUsers": 425,
  "totalCourses": 45,
  "completedEnrollments": 2340,
  "averageCompletionRate": 87.5,
  "averageRiskScore": 35.2,
  "highRiskUsers": 23,
  "phishingSimulationsSent": 1500,
  "phishingClickRate": 12.3,
  "complianceRate": 87.7,
  "trainingHours": 4567.5,
  "certificatesIssued": 1876,
  "departmentMetrics": [
    {
      "departmentId": "uuid",
      "departmentName": "IT Security",
      "userCount": 50,
      "completedEnrollments": 245,
      "totalEnrollments": 280,
      "completionRate": 87.5
    }
  ],
  "trendData": {
    "months": [
      {
        "month": "2025-01",
        "enrollments": 123,
        "completions": 98,
        "riskScore": 38.5
      }
    ]
  },
  "topPerformers": [
    {
      "userId": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "completedCourses": 25,
      "certificates": 15,
      "score": 325
    }
  ],
  "bottomPerformers": []
}
```

### Compliance

#### Get Compliance Metrics

```http
GET /reports/compliance/:framework
```

**Path Parameters**:

- `framework`: POPIA | GDPR | SOC2 | ISO27001 | NIST | HIPAA | PCI_DSS

**Response** (200 OK):

```json
{
  "framework": "POPIA",
  "overallCompliance": 85,
  "compliantUsers": 425,
  "nonCompliantUsers": 75,
  "requiredTrainings": 2500,
  "completedTrainings": 2125,
  "pendingTrainings": 325,
  "overdueTrainings": 50,
  "controlsAssessed": 5,
  "controlsPassed": 4,
  "controlsFailed": 1,
  "lastAuditDate": "2025-08-18T00:00:00Z",
  "nextAuditDate": "2026-02-18T00:00:00Z",
  "findings": [
    {
      "id": "1",
      "severity": "HIGH",
      "title": "Incomplete Security Awareness Training",
      "description": "15% of users have not completed mandatory security awareness training",
      "affectedUsers": 45
    }
  ],
  "recommendations": [
    "Schedule mandatory training sessions for non-compliant users",
    "Implement automated reminders for training renewals"
  ],
  "evidence": [
    {
      "type": "TRAINING_RECORDS",
      "count": 1250,
      "lastUpdated": "2025-11-18T00:00:00Z"
    }
  ]
}
```

### Report Generation

#### Generate Standard Report

```http
POST /reports/generate
```

**Request Body** (GenerateReportDto):

```json
{
  "type": "EXECUTIVE_DASHBOARD",
  "title": "Q4 2025 Executive Dashboard",
  "description": "Comprehensive overview of Q4 training metrics",
  "format": "PDF",
  "filters": {
    "departmentIds": ["uuid-1", "uuid-2"],
    "dateRange": {
      "startDate": "2025-10-01T00:00:00Z",
      "endDate": "2025-12-31T23:59:59Z"
    }
  },
  "includeCharts": true,
  "includeRawData": false
}
```

**Report Types**:

- `EXECUTIVE_DASHBOARD`
- `COMPLIANCE_REPORT`
- `USER_PROGRESS`
- `PHISHING_SIMULATION`
- `RISK_ASSESSMENT`
- `TRAINING_EFFECTIVENESS`
- `DEPARTMENT_PERFORMANCE`
- `CUSTOM`

**Formats**: `PDF` | `EXCEL` | `CSV` | `JSON` | `HTML`

**Response** (201 Created):

```json
{
  "id": "uuid",
  "tenantId": "uuid",
  "type": "EXECUTIVE_DASHBOARD",
  "title": "Q4 2025 Executive Dashboard",
  "description": "Comprehensive overview of Q4 training metrics",
  "format": "PDF",
  "status": "PENDING",
  "fileUrl": "",
  "fileSize": 0,
  "generatedBy": "uuid",
  "generatedAt": null,
  "filters": {},
  "metadata": {}
}
```

#### Generate Compliance Report

```http
POST /reports/generate/compliance
```

**Request Body** (ComplianceReportDto):

```json
{
  "framework": "POPIA",
  "title": "POPIA Compliance Report - Nov 2025",
  "description": "Quarterly compliance assessment",
  "format": "PDF",
  "dateRange": {
    "startDate": "2025-08-01T00:00:00Z",
    "endDate": "2025-10-31T23:59:59Z"
  },
  "includeEvidence": true,
  "includeRecommendations": true
}
```

**Response** (201 Created): Same as Generate Standard Report

#### Generate Custom Report

```http
POST /reports/generate/custom
```

**Request Body** (CustomReportDto):

```json
{
  "title": "Department Training Analysis",
  "description": "Custom analysis of department training metrics",
  "columns": [
    {
      "field": "departmentName",
      "label": "Department",
      "sortable": true
    },
    {
      "field": "completedCourses",
      "label": "Completed Courses",
      "aggregation": "sum",
      "sortable": true
    },
    {
      "field": "averageScore",
      "label": "Average Score",
      "aggregation": "avg",
      "sortable": true
    }
  ],
  "dataSource": "enrollments",
  "format": "EXCEL",
  "filters": {
    "dateRange": {
      "startDate": "2025-01-01T00:00:00Z",
      "endDate": "2025-11-18T23:59:59Z"
    }
  },
  "groupBy": {
    "field": "departmentId"
  },
  "orderBy": {
    "averageScore": "desc"
  }
}
```

**Response** (201 Created): Same as Generate Standard Report

### Report Management

#### Get All Reports

```http
GET /reports
```

**Response** (200 OK):

```json
[
  {
    "id": "uuid",
    "tenantId": "uuid",
    "type": "EXECUTIVE_DASHBOARD",
    "title": "Q4 2025 Executive Dashboard",
    "description": "",
    "format": "PDF",
    "status": "COMPLETED",
    "fileUrl": "/reports/executive-dashboard-2025-11-18.pdf",
    "fileSize": 2457600,
    "generatedBy": "uuid",
    "generatedAt": "2025-11-18T10:30:00Z",
    "filters": {},
    "metadata": {}
  }
]
```

#### Get Report by ID

```http
GET /reports/:reportId
```

**Response** (200 OK): Single report object

#### Delete Report

```http
DELETE /reports/:reportId
```

**Response** (204 No Content)

### Report Schedules

#### Create Report Schedule

```http
POST /reports/schedules
```

**Request Body** (ReportScheduleDto):

```json
{
  "name": "Weekly Executive Summary",
  "description": "Automated weekly executive dashboard report",
  "reportType": "EXECUTIVE_DASHBOARD",
  "format": "PDF",
  "frequency": "WEEKLY",
  "dayOfWeek": "MONDAY",
  "time": "08:00",
  "recipients": ["ceo@example.com", "cfo@example.com"],
  "filters": {
    "dateRange": {
      "startDate": "2025-01-01T00:00:00Z",
      "endDate": "2025-12-31T23:59:59Z"
    }
  },
  "enabled": true
}
```

**Frequencies**: `DAILY` | `WEEKLY` | `MONTHLY` | `QUARTERLY` | `YEARLY`

**Days of Week**: `MONDAY` | `TUESDAY` | `WEDNESDAY` | `THURSDAY` | `FRIDAY` | `SATURDAY` | `SUNDAY`

**Response** (201 Created):

```json
{
  "id": "uuid",
  "tenantId": "uuid",
  "name": "Weekly Executive Summary",
  "description": "Automated weekly executive dashboard report",
  "reportType": "EXECUTIVE_DASHBOARD",
  "format": "PDF",
  "frequency": "WEEKLY",
  "dayOfWeek": "MONDAY",
  "dayOfMonth": null,
  "time": "08:00",
  "recipients": ["ceo@example.com", "cfo@example.com"],
  "enabled": true,
  "lastRunAt": null,
  "nextRunAt": "2025-11-25T08:00:00Z",
  "createdAt": "2025-11-18T12:00:00Z",
  "updatedAt": "2025-11-18T12:00:00Z"
}
```

#### Get All Report Schedules

```http
GET /reports/schedules
```

**Response** (200 OK): Array of report schedules

#### Get Report Schedule by ID

```http
GET /reports/schedules/:scheduleId
```

**Response** (200 OK): Single report schedule object

#### Update Report Schedule

```http
PUT /reports/schedules/:scheduleId
```

**Request Body** (UpdateReportScheduleDto):

```json
{
  "frequency": "MONTHLY",
  "dayOfMonth": 1,
  "enabled": true
}
```

**Response** (200 OK): Updated report schedule object

#### Delete Report Schedule

```http
DELETE /reports/schedules/:scheduleId
```

**Response** (204 No Content)

### Report Templates

#### Create Report Template

```http
POST /reports/templates
```

**Request Body** (ReportTemplateDto):

```json
{
  "name": "Security Awareness Template",
  "description": "Standard template for security awareness reporting",
  "type": "USER_PROGRESS",
  "configuration": {
    "includeCharts": true,
    "includeRawData": false,
    "groupBy": "department",
    "metrics": ["completionRate", "averageScore", "timeSpent"]
  }
}
```

**Response** (201 Created):

```json
{
  "id": "uuid",
  "tenantId": "uuid",
  "name": "Security Awareness Template",
  "description": "Standard template for security awareness reporting",
  "type": "USER_PROGRESS",
  "configuration": {},
  "isDefault": false,
  "createdBy": "uuid",
  "createdAt": "2025-11-18T12:00:00Z",
  "updatedAt": "2025-11-18T12:00:00Z"
}
```

#### Get All Report Templates

```http
GET /reports/templates
```

**Response** (200 OK): Array of report templates

#### Get Report Template by ID

```http
GET /reports/templates/:templateId
```

**Response** (200 OK): Single report template object

#### Delete Report Template

```http
DELETE /reports/templates/:templateId
```

**Response** (204 No Content)

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

**401 Unauthorized**:

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

**403 Forbidden**:

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

**404 Not Found**:

```json
{
  "statusCode": 404,
  "message": "Report not found",
  "error": "Not Found"
}
```

**500 Internal Server Error**:

```json
{
  "statusCode": 500,
  "message": "Internal server error"
}
```

## Report Status

Reports are generated asynchronously. Status values:

- `PENDING`: Report generation queued
- `GENERATING`: Report is being generated
- `COMPLETED`: Report is ready for download
- `FAILED`: Report generation failed
- `SCHEDULED`: Report is scheduled for future generation

## Notes

1. **Date Formats**: All dates use ISO 8601 format (UTC)
2. **File Storage**: Generated reports are stored and accessible via `fileUrl`
3. **Scheduled Reports**: Automatically generated and sent to recipients via email
4. **Custom Reports**: Support flexible column configuration and data aggregation
5. **Compliance Frameworks**: Automatically map training requirements to framework standards
6. **Multi-Format Export**: PDF, Excel, CSV, JSON, and HTML formats supported
7. **Tenant Isolation**: All reports are tenant-scoped automatically
