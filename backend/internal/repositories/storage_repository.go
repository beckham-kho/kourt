package repositories

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"mime/multipart"

	"github.com/aws/aws-sdk-go-v2/service/s3"
	"github.com/google/uuid"
)

type StorageRepository interface {
	Upload(ctx context.Context, file multipart.File, header *multipart.FileHeader, folder string) (string, error)
	Delete(ctx context.Context, key string) error
}

type StorageGarage struct {
	client   *s3.Client
	bucket   string
	publicEndpoint string
}

func NewStorageGarage(client *s3.Client, bucket, publicEndpoint string) *StorageGarage {
	return &StorageGarage{client: client, bucket: bucket, publicEndpoint: publicEndpoint}
}

func (s *StorageGarage) Upload(ctx context.Context, file multipart.File, header *multipart.FileHeader, folder string) (string, error) {
	ext := ""
	for i := len(header.Filename) - 1; i >= 0; i-- {
		if header.Filename[i] == '.' {
			ext = header.Filename[i:]
			break
		}
	}
	key := fmt.Sprintf("%s/%s%s", folder, uuid.NewString(), ext)

	buf, err := io.ReadAll(file)
	if err != nil {
		return "", err
	}

	contentType := "application/octet-stream"
	if ct := header.Header.Get("Content-Type"); ct != "" {
		contentType = ct
	}

	_, err = s.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      &s.bucket,
		Key:         &key,
		Body:        bytes.NewReader(buf),
		ContentType: &contentType,
	})
	if err != nil {
		return "", err
	}

	url := fmt.Sprintf("%s/%s", s.publicEndpoint, key)
	return url, nil
}

func (s *StorageGarage) Delete(ctx context.Context, key string) error {
	_, err := s.client.DeleteObject(ctx, &s3.DeleteObjectInput{
		Bucket: &s.bucket,
		Key:    &key,
	})
	return err
}