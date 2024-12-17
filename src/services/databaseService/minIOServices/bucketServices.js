const { rename } = require("fs");
const { minioClient, policyMinio } = require("../../../config/minIO");
const { sortByLastNumber, removeEndSlash } = require("../../../utils");

// Create a bucket
const createBucket = async (bucketName) => {
  try {
    await new Promise((resolve, reject) => {
      minioClient.makeBucket(bucketName, "us-east-1", function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    }).then(() => {
      minioClient.setBucketPolicy(
        bucketName,
        JSON.stringify(policyMinio(bucketName)),
        function (err) {
          if (err) {
            throw err;
          }
        }
      );
    });
    return { success: true };
  } catch (err) {
    console.error(`Error creating bucket ${bucketName}:`, err);
    return { success: false, error: err };
  }
};

// Listed buckets
const listBuckets = async () => {
  try {
    const buckets = await minioClient.listBuckets();
    return { success: true, buckets };
  } catch (err) {
    console.error("Error listing buckets:", err);
    return { success: false, error: err };
  }
};

// Check exists of a bucket
const bucketExists = async (bucketName) => {
  try {
    const existed = await minioClient.bucketExists(bucketName);
    return { success: true, existed };
  } catch (err) {
    console.error(`Error checking if bucket ${bucketName} exists:`, err);
    return { success: false, error: err };
  }
};

// Remove a bucket
const removeBucket = async (bucketName) => {
  try {
    await minioClient.removeBucket(bucketName);
    return { success: true };
  } catch (err) {
    console.error(`Error removing bucket ${bucketName}:`, err);
    return { success: false, error: err };
  }
};

// List chapters in a comic
const getListChapters = async (bucketName, prefix = "", recursive = false) => {
  try {
    const chapters = [];
    const stream = minioClient.listObjects(bucketName, prefix, recursive);

    for await (const obj of stream) {
      chapters.push(obj);
    }

    const chapterNames = chapters.map((object) =>
      removeEndSlash(object.prefix)
    );

    return { success: true, chapters: sortByLastNumber(chapterNames, true) };
  } catch (err) {
    console.error("Error listing chapters:", err);
    return { success: false, error: err };
  }
};

// List objects in a bucket using listObjectsV2
const listObjectsV2 = async (bucketName, prefix = "", recursive = false) => {
  try {
    const objects = [];
    const stream = minioClient.listObjectsV2(bucketName, prefix, recursive);

    for await (const obj of stream) {
      objects.push(obj);
    }

    return { success: true, objects: objects };
  } catch (err) {
    console.error("Error listing objects V2:", err);
    return { success: false, error: err };
  }
};

// Rename a bucket
const renameBucket = async (oldName, newName) => {
  try {
    await createBucket(newName);

    const objectsStream = minioClient.listObjectsV2(oldName, "", true);
    const copyPromises = [];

    objectsStream.on("data", (obj) => {
      const copyPromise = minioClient.copyObject(
        newName,
        obj.name,
        `${oldName}/${obj.name}`
      );
      copyPromises.push(copyPromise);
    });

    objectsStream.on("end", async () => {
      try {
        await Promise.all(copyPromises);

        const deleteStream = minioClient.listObjectsV2(oldName, "", true);
        const objectsList = [];

        deleteStream.on("data", (obj) => {
          objectsList.push(obj.name);
        });

        deleteStream.on("end", async () => {
          await minioClient.removeObjects(oldName, objectsList);

          await minioClient.removeBucket(oldName);
          console.log(`Bucket ${oldName} renamed to ${newName}`);
        });
      } catch (err) {
        console.error("Error during copy or delete operation:", err);
      }
    });

    return { success: true, renamed: true };
  } catch (err) {
    console.error(`Error renaming bucket ${oldName} to ${newName}:`, err);
    return { success: false, error: err };
  }
};

// List incomplete uploads in a bucket
const listIncompleteUploads = async (
  bucketName,
  prefix = "",
  recursive = false
) => {
  try {
    const uploads = [];
    const stream = minioClient.listIncompleteUploads(
      bucketName,
      prefix,
      recursive
    );

    for await (const upload of stream) {
      uploads.push(upload);
    }

    return { success: true, uploads: uploads };
  } catch (err) {
    console.error("Error listing incomplete uploads:", err);
    return { success: false, error: err };
  }
};

module.exports = {
  listBuckets,
  renameBucket,
  createBucket,
  bucketExists,
  removeBucket,
  listObjectsV2,
  getListChapters,
  listIncompleteUploads,
};
