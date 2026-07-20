package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"

	"github.com/beckham-kho/kourt/internal/models"
	"github.com/beckham-kho/kourt/internal/services"
)

type AuthHandler struct {
	authService     *services.AuthService
	jwtAccessSecret string
}

func NewAuthHandler(authService *services.AuthService, jwtAccessSecret string) *AuthHandler {
	return &AuthHandler{authService: authService, jwtAccessSecret: jwtAccessSecret}
}

func (h *AuthHandler) Register(c *fiber.Ctx) error {
	var input models.RegisterInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"success": false, "message": "Body tidak valid"})
	}

	user, err := h.authService.Register(input)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"success": false, "message": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"success": true, "message": "Registrasi berhasil", "data": user})
}

func (h *AuthHandler) Login(c *fiber.Ctx) error {
	var input models.LoginInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"success": false, "message": "Body tidak valid"})
	}

	user, tokens, err := h.authService.Login(c.Context(), input)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"success": false, "message": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Login berhasil",
		"data":    fiber.Map{"user": user, "tokens": tokens},
	})
}

func (h *AuthHandler) Refresh(c *fiber.Ctx) error {
	var body struct {
		RefreshToken string `json:"refresh_token"`
	}
	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"success": false, "message": "Body tidak valid"})
	}

	tokens, err := h.authService.RefreshToken(c.Context(), body.RefreshToken)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"success": false, "message": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"success": true, "message": "Token diperbarui", "data": tokens})
}

func (h *AuthHandler) Logout(c *fiber.Ctx) error {
	userID := c.Locals("user_id").(string)
	jti := c.Locals("jti").(string)
	exp := c.Locals("exp").(int64)

	remaining := exp - time.Now().Unix()
	if err := h.authService.Logout(c.Context(), userID, jti, remaining); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"success": false, "message": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"success": true, "message": "Logout berhasil"})
}