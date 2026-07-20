package repositories

import (
	"database/sql"

	"github.com/beckham-kho/kourt/internal/models"
)

type UserPostgres struct {
	db *sql.DB
}

func NewUserPostgres(db *sql.DB) *UserPostgres {
	return &UserPostgres{db: db}
}

func (r *UserPostgres) Create(user *models.User) error {
	query := `
		INSERT INTO users (name, email, phone_number, password_hash, role)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, avatar_url, is_verified, is_active, created_at, updated_at
	`
	return r.db.QueryRow(
		query, user.Name, user.Email, user.PhoneNumber, user.PasswordHash, user.Role,
	).Scan(&user.ID, &user.AvatarURL, &user.IsVerified, &user.IsActive, &user.CreatedAt, &user.UpdatedAt)
}

func (r *UserPostgres) FindByEmail(email string) (*models.User, error) {
	query := `
		SELECT id, name, email, phone_number, password_hash, role, avatar_url, is_verified, is_active, created_at, updated_at
		FROM users WHERE email = $1
	`
	var u models.User
	err := r.db.QueryRow(query, email).Scan(
		&u.ID, &u.Name, &u.Email, &u.PhoneNumber, &u.PasswordHash, &u.Role,
		&u.AvatarURL, &u.IsVerified, &u.IsActive, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *UserPostgres) FindByID(id string) (*models.User, error) {
	query := `
		SELECT id, name, email, phone_number, password_hash, role, avatar_url, is_verified, is_active, created_at, updated_at
		FROM users WHERE id = $1
	`
	var u models.User
	err := r.db.QueryRow(query, id).Scan(
		&u.ID, &u.Name, &u.Email, &u.PhoneNumber, &u.PasswordHash, &u.Role,
		&u.AvatarURL, &u.IsVerified, &u.IsActive, &u.CreatedAt, &u.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &u, nil
}