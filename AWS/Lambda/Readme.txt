All Lambda functions to process images captured by the Raspberry Pi are held here, these include:
CatalogImage - Triggered by S3 and determines whether this is an image to manage or discard; using rekognition logic to determine.  Retained files held in S3
IdentifyImage - Triggered by placement of file in S3; comparing image against each reference image until a clear match is determined. Image moved to separate S3 location; may add dynamo logic in future to drive stats.
