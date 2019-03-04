#!/usr/bin/env node

const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const fs = require("fs");

const lcloudBucket = "lcloud-427-lt";
const pathToUploadFile = "./file-to-upload";

/*
 Put file to the S3 bucket to have something to work with
 */
fs.readFile(pathToUploadFile, (err, data) => {
    s3.putObject({Bucket: lcloudBucket, Key: "lt-file", Body: data}, function(err, data) {
        if (err)
            console.log(err);
        else
            console.log("Successfully uploaded data to " + lcloudBucket);
    });
});


const deleteObjectByKey = (key) => {
  return new Promise((resolve, _) => {
      s3.deleteObject({Bucket: lcloudBucket, Key: key}, (_, data) => {
          resolve(data);
      });
  });
};


const listFileMatchingOptionalRegexp = (regexp = /.+/) => {
    return new Promise((resolve, _) => {
        let filteredObjects = [];
        s3.listObjectsV2({Bucket: lcloudBucket}, (_, data) => {
            for (let s3Object of data.Contents) {
                if(s3Object.Key.match(regexp)) {
                    filteredObjects.push(s3Object);
                }
            }
            resolve(filteredObjects);
        });
    });
};

/*
 Read the regexp pattern from the command line (first argument give to the script)
 */
listFileMatchingOptionalRegexp(process.argv[2]). then((s3ObjectsMatchingFilter) => {
    console.log(s3ObjectsMatchingFilter);
});


