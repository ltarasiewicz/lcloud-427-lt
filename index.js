var AWS = require("aws-sdk");

// Create an S3 client
var s3 = new AWS.S3();


// Create a bucket and upload something into it
let lcloudBucket = "lcloud-427-lt";

let fs = require("fs");
let pathToUploadFile = "./file-to-upload";

fs.readFile(pathToUploadFile, (err, data) => {
    s3.putObject({Bucket: lcloudBucket, Key: "lt-file", Body: data}, function(err, data) {
        if (err)
            console.log(err)
        else
            console.log("Successfully uploaded data to " + lcloudBucket);
    });
});


s3.listObjectsV2({Bucket: lcloudBucket, MaxKeys: 10}, (err, data) => {
  console.log(data.Contents);
  console.log(err);
});