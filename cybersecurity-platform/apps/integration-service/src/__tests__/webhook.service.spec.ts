import { WebhookService } from '../services/webhook.service';

describe('WebhookService', () => {
  it('should create and list webhooks', async () => {
    const mockWebhookModel = {
      create: jest.fn(({ data }) => Promise.resolve({ id: 'w1', ...data })),
      findMany: jest.fn(() => Promise.resolve([{ id: 'w1', url: 'https://example.com' }])),
      findUnique: jest.fn(() =>
        Promise.resolve({ id: 'w1', url: 'https://example.com', events: ['REPORT_GENERATED'] }),
      ),
      delete: jest.fn(() => Promise.resolve({ id: 'w1' })),
      update: jest.fn(() => Promise.resolve({ id: 'w1', lastTriggeredAt: new Date() })),
    };

    const prisma = { webhook: mockWebhookModel } as any;
    const logger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() } as any;

    const service = new WebhookService(prisma, logger);

    const created = await service.create('tenant-1', {
      url: 'https://example.com',
      events: ['REPORT_GENERATED'],
    });
    expect(created).toHaveProperty('id');
    expect(mockWebhookModel.create).toHaveBeenCalled();

    const list = await service.list('tenant-1');
    expect(list).toHaveLength(1);
  });
});
