package handlers

import (
	"github.com/gofiber/fiber/v2"

	"github.com/beckham-kho/kourt/internal/repositories"
)

type UploadHandler struct {
	storageRepo repositories.StorageRepository
}

func NewUploadHandler(storageRepo repositories.StorageRepository) *UploadHandler {
	return &UploadHandler{storageRepo: storageRepo}
}

func (h *UploadHandler) UploadImage(c *fiber.Ctx) error {
	fileHeader, err := c.FormFile("image")
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false, "message": "File image tidak ditemukan",
		})
	}

	file, err := fileHeader.Open()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false, "message": "Gagal membuka file",
		})
	}
	defer file.Close()

	url, err := h.storageRepo.Upload(c.Context(), file, fileHeader, "courts")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false, "message": "Gagal upload gambar", "error": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true, "message": "Berhasil upload gambar", "data": fiber.Map{"url": url},
	})
}