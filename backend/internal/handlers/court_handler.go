package handlers

import (
	"strconv"

	"github.com/gofiber/fiber/v2"

	"github.com/beckham-kho/kourt/internal/models"
	"github.com/beckham-kho/kourt/internal/services"
)

type CourtsHandler struct {
	service *services.CourtService
}

func NewCourtsHandler(service *services.CourtService) *CourtsHandler {
	return &CourtsHandler{service: service}
}

func (h *CourtsHandler) CreateCourt(c *fiber.Ctx) error {
	ownerID := c.Locals("user_id").(string)

	var input models.CreateCourtInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false, "message": "Body tidak valid",
		})
	}

	if input.Name == "" || input.Price <= 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false, "message": "Nama dan harga wajib diisi",
		})
	}

	court, err := h.service.CreateCourt(ownerID, input)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false, "message": "Gagal menambah lapangan", "error": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true, "message": "Lapangan berhasil ditambahkan", "data": court,
	})
}

func (h *CourtsHandler) DeleteCourt(c *fiber.Ctx) error {
	ownerID := c.Locals("user_id").(string)
	courtID := c.Params("id")

	if err := h.service.DeleteCourt(courtID, ownerID); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false, "message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true, "message": "Lapangan berhasil dihapus",
	})
}

func (h *CourtsHandler) UpdateCourt(c *fiber.Ctx) error {
	ownerID := c.Locals("user_id").(string)
	courtID := c.Params("id")

	var input models.UpdateCourtInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false, "message": "Body tidak valid",
		})
	}

	if err := h.service.UpdateCourt(courtID, ownerID, input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false, "message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true, "message": "Lapangan berhasil diperbarui",
	})
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

func (h *CourtsHandler) GetMyCourts(c *fiber.Ctx) error {
	ownerID := c.Locals("user_id").(string)

	courts, err := h.service.GetCourtsByOwner(ownerID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false, "message": "Gagal mengambil data lapangan",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true, "message": "Berhasil mengambil lapangan", "data": courts,
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

func (h *CourtsHandler) ToggleCourtActive(c *fiber.Ctx) error {
	ownerID := c.Locals("user_id").(string)
	courtID := c.Params("id")

	var input struct {
		IsActive bool `json:"is_active"`
	}
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false, "message": "Body tidak valid",
		})
	}

	if err := h.service.ToggleCourtActive(courtID, ownerID, input.IsActive); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false, "message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true, "message": "Status lapangan berhasil diperbarui",
	})
}