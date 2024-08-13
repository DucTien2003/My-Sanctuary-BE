const Minio = require('minio');

const minioClient = new Minio.Client({
  endPoint: process.env.MIO_END_POINT,
  port: Number(process.env.MIO_PORT),
  useSSL: false,
  accessKey: process.env.MIO_ACCESS_KEY,
  secretKey: process.env.MIO_SECRET_KEY,
});

const policyMinio = (bucketName) => {
  return {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: {
          AWS: ['*'],
        },
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucketName}/*`],
      },
    ],
  };
};

module.exports = { minioClient, policyMinio };
