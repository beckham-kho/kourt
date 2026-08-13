package handlers

import (
	"github.com/gofiber/fiber/v2"

	"github.com/beckham-kho/kourt/internal/repositories"
)

type FacilityHandler struct {
	repo repositories.FacilityRepository
}

func NewFacilityHandler(repo repositories.FacilityRepository) *FacilityHandler {
	return &FacilityHandler{repo: repo}
}

func (h *FacilityHandler) GetAllFacilities(c *fiber.Ctx) error {
	facilities, err := h.repo.FindAll()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false, "message": "Gagal mengambil data fasilitas",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true, "message": "Berhasil mengambil fasilitas", "data": facilities,
	})
}