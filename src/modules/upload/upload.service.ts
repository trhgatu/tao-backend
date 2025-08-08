import { supabase } from '@core';
import { v4 as uuidv4 } from 'uuid';

export const uploadImageToSupabase = async (
  fileBuffer: Buffer,
  mimetype: string,
  folder = ''
) => {
  const extension = mimetype.split('/')[1];
  const fileName = `${uuidv4()}.${extension}`;
  const filePath = folder ? `${folder}/${fileName}` : fileName;

  const { error } = await supabase.storage
    .from('uploads')
    .upload(filePath, fileBuffer, {
      contentType: mimetype,
    });

  if (error) throw error;

  const { data: publicUrl } = supabase.storage
    .from('uploads')
    .getPublicUrl(filePath);

  return publicUrl?.publicUrl;
};
