package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"

	"github.com/beckham-kho/kourt/internal/services"
)

type CourtsHandler struct {
	service *services.CourtService
}

func NewCourtsHandler(service *services.CourtService) *CourtsHandler {
	return &CourtsHandler{service: service}
}

func (h *CourtsHandler) GetAllCourts(c *fiber.Ctx) error {
	search := c.Query("search")
	courts, err := h.service.GetAllCourts(search)
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

func (h *CourtsHandler) GetCourtByID(c *fiber.Ctx) error {
	id := c.Params("id")

	court, err := h.service.GetCourtByID(id)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"success": false,
			"message": "Lapangan tidak ditemukan",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Berhasil mengambil detail lapangan",
		"data":    court,
	})
}

func (h *CourtsHandler) UploadCourtImage(c *fiber.Ctx) error {
	courtID := c.Params("id")
	isPrimary, _ := strconv.ParseBool(c.Query("primary", "false"))

	fileHeader, err := c.FormFile("image")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false,
			"message": "File image tidak ditemukan",
		})
	}

	file, err := fileHeader.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Gagal membuka file",
		})
	}
	defer file.Close()

	url, err := h.service.UploadCourtImage(c.Context(), courtID, file, fileHeader, isPrimary)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Gagal upload gambar",
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "Berhasil upload gambar",
		"data":    fiber.Map{"url": url},
	})
}

func (h *CourtsHandler) DeleteCourtImage(c *fiber.Ctx) error {
	imageID := c.Params("imageId")

	if err := h.service.DeleteCourtImage(imageID); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Gagal menghapus gambar",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Gambar berhasil dihapus",
	})
}