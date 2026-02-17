package com.application.ecom.service;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Date;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.HttpMethod;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.GeneratePresignedUrlRequest;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class AwsS3Service {

    private final String bucketName = "pavan-kalyan-1437";

    @Value("${aws.s3.access}")
    private String awsS3AccessKey;
    @Value("${aws.s3.secrete}")
    private String awsS3SecreteKey;

    private AmazonS3 s3Client;

    @PostConstruct
    public void init() {
        BasicAWSCredentials awsCredentials = new BasicAWSCredentials(awsS3AccessKey, awsS3SecreteKey);
        this.s3Client = AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(awsCredentials))
                .withRegion(Regions.EU_NORTH_1)
                .build();
    }

    public String saveImageToS3(MultipartFile photo) {
        java.io.File tempFile = null;
        try {
            String s3FileName = photo.getOriginalFilename();

            // Convert MultipartFile to Temp File to avoid Stream Reset issues on Retry
            tempFile = java.io.File.createTempFile("upload_", s3FileName);
            photo.transferTo(tempFile);

            PutObjectRequest putObjectRequest = new PutObjectRequest(bucketName, s3FileName, tempFile);
            s3Client.putObject(putObjectRequest);

            // Return the Key (filename) instead of the full URL for private buckets
            return s3FileName;

        } catch (IOException e) {
            log.error("Error uploading to S3", e);
            throw new RuntimeException("Unable to upload image to s3 bucket: " + e.getMessage());
        } finally {
            if (tempFile != null && tempFile.exists()) {
                tempFile.delete();
            }
        }
    }

    public String getPresignedUrl(String s3FileName) {
        // Handle legacy data: if s3FileName is a full URL, extract the key
        if (s3FileName != null && s3FileName.startsWith("http")) {
            s3FileName = s3FileName.substring(s3FileName.lastIndexOf("/") + 1);
        }

        Date expiration = new Date();
        long expTimeMillis = expiration.getTime();
        expTimeMillis += 1000 * 60 * 60; // 1 hour expiration
        expiration.setTime(expTimeMillis);

        GeneratePresignedUrlRequest generatePresignedUrlRequest = new GeneratePresignedUrlRequest(bucketName,
                s3FileName)
                .withMethod(HttpMethod.GET)
                .withExpiration(expiration);

        URL url = s3Client.generatePresignedUrl(generatePresignedUrlRequest);
        return url.toString();
    }

    public void deleteImageFromS3(String s3FileName) {
        if (s3FileName == null || s3FileName.isEmpty()) {
            return;
        }
        // Handle legacy data: if s3FileName is a full URL, extract the key
        if (s3FileName.startsWith("http")) {
            s3FileName = s3FileName.substring(s3FileName.lastIndexOf("/") + 1);
        }
        try {
            s3Client.deleteObject(bucketName, s3FileName);
        } catch (Exception e) {
            log.error("Error deleting image from S3: " + s3FileName, e);
            // We verify if we want to throw exception or just log it.
            // Usually for deletion, we might want to proceed deleting the product even if
            // s3 fails.
        }
    }
}
