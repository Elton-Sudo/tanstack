# Integration Service

This microservice manages integrations (API keys, webhooks, connectors). It provides a central place to integrate with HRIS, SSO, webhook consumers, and external BI tools.

Start the service in development:

```bash
npm run start:integration:dev
```

Swagger docs: `http://localhost:<INTEGRATION_PORT>/api/docs` (if service is started and Swagger enabled in `main.ts`).
