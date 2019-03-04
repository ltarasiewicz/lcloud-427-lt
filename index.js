#!/usr/bin/env node

const AWS = require("aws-sdk");
const s3 = new AWS.S3();
const fs = require("fs");
const argv = require('minimist')(process.argv.slice(2));

const lcloudBucket = "lcloud-427-lt";
const pathsToUploadFiles = ["./file-to-upload", "./second-file-to-upload"];

/*
 Put files to the S3 bucket to have something to work with
 */
pathsToUploadFiles.forEach((filePath, index) => {
    fs.readFile(filePath, (err, data) => {
        s3.putObject({Bucket: lcloudBucket, Key: `lt-file-${index}`, Body: data}, function(err, _) {
            if (err) {
               throw Error("Error uploading files");
            }
            console.log(`Successfully uploaded ${filePath} to ${lcloudBucket}`);
        });
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
If "delete" is the first argument, delete an object matching a key
 */
if ("delete" === argv._[0]) {
    const key = argv._[1];
    if (!key) {
        throw Error("You need to provide the key name to delete")
    }
    return deleteObjectByKey(key).then((response) => {
        console.log(response);
    });
}


/*
Default action taken by the script - list objects in S3 matching regexp optionally
Read the regexp pattern from the command line (first argument give to the script)
 */
return listFileMatchingOptionalRegexp(argv._[0]). then((s3ObjectsMatchingFilter) => {
    console.log(s3ObjectsMatchingFilter);
});
