import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();


const client = new S3Client({region: process.env.AWS_BUCKET_REGION,
	credentials:{
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	}
});

export async function uploadFile(file: any, fileName: string){
	try {
		const stream = fs.createReadStream(file);

		const uploadParams = {
			Bucket: process.env.AWS_BUCKET_NAME,
			Key: fileName,
			Body: stream
		};
		const command = new PutObjectCommand(uploadParams);

		return await client.send(command);
	} catch (error) {
		console.log(error.message)
	}
}