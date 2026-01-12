import { describe, it, expect, vi, beforeEach } from 'vitest';
import { applicationsApi } from '../../lib/api/applications';
import { supabase } from '../../lib/supabase';

// Mock Supabase client
vi.mock('../../lib/supabase', () => ({
    supabase: {
        from: vi.fn(() => ({
            select: vi.fn(),
            insert: vi.fn(),
            update: vi.fn(),
            delete: vi.fn(),
            eq: vi.fn(),
            order: vi.fn(),
            single: vi.fn(),
        })),
    },
}));

describe('applicationsApi', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('getAll calls supabase select', async () => {
        const mockData = [{ id: '1', position: 'Developer' }];
        const selectMock = vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockData, error: null }),
        });

        (supabase.from as any).mockReturnValue({
            select: selectMock,
        });

        const result = await applicationsApi.getAll();
        expect(supabase.from).toHaveBeenCalledWith('applications');
        expect(selectMock).toHaveBeenCalledWith('*, company:companies(*)');
        expect(result).toEqual(mockData);
    });

    it('create calls supabase insert', async () => {
        const newApp = {
            company_id: '123',
            position: 'Dev',
            status: 'applied' as const
        };
        const userId = 'user-1';
        const mockResponse = { id: '1', ...newApp, user_id: userId };

        const insertMock = vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockResponse, error: null })
            })
        });

        (supabase.from as any).mockReturnValue({
            insert: insertMock,
        });

        const result = await applicationsApi.create(newApp, userId);
        expect(insertMock).toHaveBeenCalledWith([{ ...newApp, user_id: userId }]);
        expect(result).toEqual(mockResponse);
    });

    it('update calls supabase update', async () => {
        const updates = { status: 'interview' as const };
        const id = '1';
        const mockResponse = { id, ...updates };

        const updateMock = vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                    single: vi.fn().mockResolvedValue({ data: mockResponse, error: null })
                })
            })
        });

        (supabase.from as any).mockReturnValue({
            update: updateMock,
        });

        await applicationsApi.update(id, updates);
        expect(updateMock).toHaveBeenCalledWith(updates);
    });

    it('delete calls supabase delete', async () => {
        const id = '1';

        const deleteMock = vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null })
        });

        (supabase.from as any).mockReturnValue({
            delete: deleteMock,
        });

        await applicationsApi.delete(id);
        expect(deleteMock).toHaveBeenCalled();
    });
});
