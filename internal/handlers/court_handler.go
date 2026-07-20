package handlers

import (
	"github.com/gofiber/fiber/v2"

	"github.com/beckham-kho/kourt/internal/services"
)

type CourtHandler struct {
	service *services.CourtService
}

func NewCourtHandler(service *services.CourtService) *CourtHandler {
	return &CourtHandler{service: service}
}

func (h *CourtHandler) GetAllCourts(c *fiber.Ctx) error {
	courts, err := h.service.GetAllCourts()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Gagal mengambil data court",
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Berhasil mengambil semua data court",
		"data":    courts,
	})
}