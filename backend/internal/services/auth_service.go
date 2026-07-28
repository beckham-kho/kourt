package services

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"github.com/beckham-kho/kourt/internal/config"
	"github.com/beckham-kho/kourt/internal/models"
	"github.com/beckham-kho/kourt/internal/repositories"
	"github.com/beckham-kho/kourt/pkg/utils"
)

func secondsToDuration(seconds int64) time.Duration {
	return time.Duration(seconds) * time.Second
}

type AuthService struct {
	userRepo    repositories.UserRepository
	sessionRepo repositories.SessionRepository
	cfg         *config.Config
}

func NewAuthService(userRepo repositories.UserRepository, sessionRepo repositories.SessionRepository, cfg *config.Config) *AuthService {
	return &AuthService{userRepo: userRepo, sessionRepo: sessionRepo, cfg: cfg}
}

func (s *AuthService) Register(input models.RegisterInput) (*models.User, error) {
	if input.Role != models.RoleCustomer && input.Role != models.RoleRenter {
		return nil, errors.New("Role tidak valid")
	}

	existing, _ := s.userRepo.FindByEmail(input.Email)
	if existing != nil {
		return nil, errors.New("Email sudah terdaftar")
	}

	hashed, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	user := &models.User{
		Name:         input.Name,
		Email:        input.Email,
		PasswordHash: string(hashed),
		Role:         input.Role,
	}

	if err := s.userRepo.Create(user); err != nil {
		return nil, err
	}

	return user, nil
}

func (s *AuthService) Login(ctx context.Context, input models.LoginInput) (*models.User, *models.AuthTokens, error) {
	user, err := s.userRepo.FindByEmail(input.Email)
	if err != nil {
		return nil, nil, errors.New("Email atau password salah")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)); err != nil {
		return nil, nil, errors.New("Email atau password salah")
	}

	if !user.IsActive {
		return nil, nil, errors.New("Akun tidak aktif")
	}

	tokens, err := s.issueTokens(ctx, user)
	if err != nil {
		return nil, nil, err
	}

	return user, tokens, nil
}

func (s *AuthService) issueTokens(ctx context.Context, user *models.User) (*models.AuthTokens, error) {
	accessJTI := uuid.NewString()
	refreshJTI := uuid.NewString()

	accessToken, err := utils.GenerateToken(user.ID, string(user.Role), accessJTI, s.cfg.JWTAccessSecret, s.cfg.AccessTokenTTL)
	if err != nil {
		return nil, err
	}

	refreshToken, err := utils.GenerateToken(user.ID, string(user.Role), refreshJTI, s.cfg.JWTRefreshSecret, s.cfg.RefreshTokenTTL)
	if err != nil {
		return nil, err
	}

	if err := s.sessionRepo.SaveRefreshToken(ctx, user.ID, refreshJTI, s.cfg.RefreshTokenTTL); err != nil {
		return nil, err
	}

	return &models.AuthTokens{AccessToken: accessToken, RefreshToken: refreshToken}, nil
}

func (s *AuthService) RefreshToken(ctx context.Context, refreshTokenString string) (*models.AuthTokens, error) {
	claims, err := utils.ParseToken(refreshTokenString, s.cfg.JWTRefreshSecret)
	if err != nil {
		return nil, errors.New("Refresh token tidak valid")
	}

	valid, err := s.sessionRepo.IsRefreshTokenValid(ctx, claims.UserID, claims.JTI)
	if err != nil {
		return nil, err
	}
	if !valid {
		return nil, errors.New("Refresh token sudah tidak berlaku")
	}

	user, err := s.userRepo.FindByID(claims.UserID)
	if err != nil {
		return nil, errors.New("User tidak ditemukan")
	}

	return s.issueTokens(ctx, user)
}

func (s *AuthService) Logout(ctx context.Context, userID, accessJTI string, accessTTLRemaining int64) error {
	if err := s.sessionRepo.DeleteRefreshToken(ctx, userID); err != nil {
		return err
	}
	if accessTTLRemaining > 0 {
		return s.sessionRepo.BlacklistAccessToken(ctx, accessJTI, secondsToDuration(accessTTLRemaining))
	}
	return nil
}