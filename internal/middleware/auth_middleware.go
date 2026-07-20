package middleware

import (
	"strings"

	"github.com/gofiber/fiber/v2"

	"github.com/beckham-kho/kourt/internal/repositories"
	"github.com/beckham-kho/kourt/pkg/utils"
)

func RequireAuth(secret string, sessionRepo repositories.SessionRepository) fiber.Handler {
	return func(c *fiber.Ctx) error {
		authHeader := c.Get("Authorization")
		if !strings.HasPrefix(authHeader, "Bearer ") {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"success": false, "message": "Token tidak ditemukan"})
		}
		tokenString := strings.TrimPrefix(authHeader, "Bearer ")

		claims, err := utils.ParseToken(tokenString, secret)
		if err != nil {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"success": false, "message": "Token tidak valid"})
		}

		blacklisted, err := sessionRepo.IsAccessTokenBlacklisted(c.Context(), claims.JTI)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"success": false, "message": "Gagal validasi token"})
		}
		if blacklisted {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"success": false, "message": "Token sudah tidak berlaku"})
		}

		c.Locals("user_id", claims.UserID)
		c.Locals("role", claims.Role)
		c.Locals("jti", claims.JTI)
		c.Locals("exp", claims.ExpiresAt.Unix())

		return c.Next()
	}
}

func RequireRole(roles ...string) fiber.Handler {
	return func(c *fiber.Ctx) error {
		role, ok := c.Locals("role").(string)
		if !ok {
			return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"success": false, "message": "Role tidak ditemukan"})
		}

		for _, allowed := range roles {
			if role == allowed {
				return c.Next()
			}
		}

		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"success": false, "message": "Akses ditolak untuk role ini"})
	}
}