#!/usr/bin/env node

const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const fs = require("fs");

const lcloudBucket = "lcloud-427-lt";
const pathToUploadFile = "./file-to-upload";

fs.readFile(pathToUploadFile, (err, data) => {
    s3.putObject({Bucket: lcloudBucket, Key: "lt-file", Body: data}, function(err, data) {
        if (err)
            console.log(err);
        else
            console.log("Successfully uploaded data to " + lcloudBucket);
    });
});


/*s3.listObjectsV2({Bucket: lcloudBucket}, (err, data) => {
  console.log(data.Contents);
  console.log(err);
});


s3.listObjectsV2({Bucket: lcloudBucket, Prefix: "lt-"}, (err, data) => {
    console.log(data.Contents);
    console.log(err);
});

s3.deleteObject({Bucket: lcloudBucket, Key: "lt-file"}, (err, data) => {
    console.log(data.Contents);
    console.log(err);
});*/

const listFileMatchingOptionalRegexp = (regexp = /.+/) => {
    {

    }
    return new Promise((resolve, reject) => {
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


listFileMatchingOptionalRegexp(). then((s3ObjectsMatchingFilter) => {
    console.log(s3ObjectsMatchingFilter);
});