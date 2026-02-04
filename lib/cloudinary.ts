import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageToCloudinary(
    file: File,
    folder: 'places' | 'events'
): Promise<string | null> {
    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64 = buffer.toString('base64');
        const dataUri = `data:${file.type};base64,${base64}`;

        const result = await cloudinary.uploader.upload(dataUri, {
            folder: `place-event-platform/${folder}`,
            resource_type: 'image',
        });

        return result.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        return null;
    }
}

export async function deleteImageFromCloudinary(imageUrl: string): Promise<boolean> {
    try {
        // Extract public_path from URL
        // Example: https://res.cloudinary.com/.../upload/v12345/place-event-platform/events/image.jpg
        const parts = imageUrl.split('/upload/');
        if (parts.length < 2) return false;

        let publicIdPath = parts[1];

        // Remove version prefix if exists (e.g. v1710000000/)
        const pathParts = publicIdPath.split('/');
        if (pathParts[0].startsWith('v') && /^\d+$/.test(pathParts[0].substring(1))) {
            pathParts.shift();
        }

        // Join back to get "folder/filename.ext"
        publicIdPath = pathParts.join('/');

        // Remove extension
        const lastDotIndex = publicIdPath.lastIndexOf('.');
        if (lastDotIndex !== -1) {
            publicIdPath = publicIdPath.substring(0, lastDotIndex);
        }

        const result = await cloudinary.uploader.destroy(publicIdPath, {
            resource_type: 'image'
        });

        return result.result === 'ok';
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        return false;
    }
}

export { cloudinary };
