package repositories

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
)

type SessionRepository interface {
	SaveRefreshToken(ctx context.Context, userID, jti string, ttl time.Duration) error
	IsRefreshTokenValid(ctx context.Context, userID, jti string) (bool, error)
	DeleteRefreshToken(ctx context.Context, userID string) error
	BlacklistAccessToken(ctx context.Context, jti string, ttl time.Duration) error
	IsAccessTokenBlacklisted(ctx context.Context, jti string) (bool, error)
}

type SessionRedis struct {
	client *redis.Client
}

func NewSessionRedis(client *redis.Client) *SessionRedis {
	return &SessionRedis{client: client}
}

func sessionKey(userID string) string {
	return "session:" + userID
}

func blacklistKey(jti string) string {
	return "blacklist:" + jti
}

func (s *SessionRedis) SaveRefreshToken(ctx context.Context, userID, jti string, ttl time.Duration) error {
	return s.client.Set(ctx, sessionKey(userID), jti, ttl).Err()
}

func (s *SessionRedis) IsRefreshTokenValid(ctx context.Context, userID, jti string) (bool, error) {
	stored, err := s.client.Get(ctx, sessionKey(userID)).Result()
	if err == redis.Nil {
		return false, nil
	}
	if err != nil {
		return false, err
	}
	return stored == jti, nil
}

func (s *SessionRedis) DeleteRefreshToken(ctx context.Context, userID string) error {
	return s.client.Del(ctx, sessionKey(userID)).Err()
}

func (s *SessionRedis) BlacklistAccessToken(ctx context.Context, jti string, ttl time.Duration) error {
	return s.client.Set(ctx, blacklistKey(jti), "1", ttl).Err()
}

func (s *SessionRedis) IsAccessTokenBlacklisted(ctx context.Context, jti string) (bool, error) {
	exists, err := s.client.Exists(ctx, blacklistKey(jti)).Result()
	if err != nil {
		return false, err
	}
	return exists > 0, nil
}