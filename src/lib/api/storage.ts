import { supabase } from '../supabase';

export const storageApi = {
    async uploadDocument(file: File, userId: string, applicationId?: string) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;

        // 1. Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
            .from('documents')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 2. Create database record
        const { data, error: dbError } = await supabase
            .from('documents')
            .insert([
                {
                    user_id: userId,
                    application_id: applicationId,
                    name: file.name,
                    file_path: filePath,
                    file_type: file.type,
                    size: file.size,
                },
            ])
            .select()
            .single();

        if (dbError) throw dbError;
        return data;
    },

    async deleteDocument(id: string, filePath: string) {
        // 1. Delete from Storage
        const { error: storageError } = await supabase.storage
            .from('documents')
            .remove([filePath]);

        if (storageError) throw storageError;

        // 2. Delete database record
        const { error: dbError } = await supabase
            .from('documents')
            .delete()
            .eq('id', id);

        if (dbError) throw dbError;
    },

    getPublicUrl(filePath: string) {
        const { data } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);

        return data.publicUrl;
    }
};
