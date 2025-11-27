import { ConnectorService } from '../services/connector.service';

describe('ConnectorService', () => {
  it('should create and list connectors', async () => {
    const mockModel = {
      create: jest.fn(({ data }) => Promise.resolve({ id: 'c1', ...data })),
      findMany: jest.fn(() => Promise.resolve([{ id: 'c1', name: 'Workday' }])),
      findUnique: jest.fn(() => Promise.resolve({ id: 'c1', name: 'Workday' })),
      update: jest.fn(() => Promise.resolve({ id: 'c1', name: 'Workday Updated' })),
      delete: jest.fn(() => Promise.resolve({ id: 'c1' })),
    };

    const prisma = { integration: mockModel } as any;
    const logger = { log: jest.fn() } as any;
    const service = new ConnectorService(prisma, logger);

    const created = await service.create('tenant-1', { name: 'Workday', type: 'HRIS' } as any);
    expect(created).toHaveProperty('id');
    expect(mockModel.create).toHaveBeenCalled();
    const list = await service.list('tenant-1');
    expect(list).toHaveLength(1);
  });
});
