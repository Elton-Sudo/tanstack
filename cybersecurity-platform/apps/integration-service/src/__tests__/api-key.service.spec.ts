import { ApiKeyService } from '../services/api-key.service';

describe('ApiKeyService', () => {
  it('should create and list API keys', async () => {
    // Minimal in-memory mock of DatabaseService
    const mockApiKeyModel = {
      create: jest.fn(({ data }) => Promise.resolve({ id: '1', ...data })),
      findMany: jest.fn(() => Promise.resolve([{ id: '1', name: 'test-key' }])),
      update: jest.fn(({ where }) => Promise.resolve({ id: where.id, isActive: false })),
    };

    const prisma = { apiKey: mockApiKeyModel } as any;
    const logger = { log: jest.fn(), warn: jest.fn(), error: jest.fn() } as any;

    const service = new ApiKeyService(prisma, logger);

    const created = await service.create('user-1', 'tenant-1', { name: 'test' });
    expect(created).toHaveProperty('id');
    expect(mockApiKeyModel.create).toHaveBeenCalled();

    const list = await service.list('tenant-1');
    expect(list).toHaveLength(1);
  });
});
