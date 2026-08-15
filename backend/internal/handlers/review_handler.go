package handlers

import (
	"github.com/gofiber/fiber/v2"

	"github.com/beckham-kho/kourt/internal/services"
)

type ReviewHandler struct {
	service *services.ReviewService
}

func NewReviewHandler(service *services.ReviewService) *ReviewHandler {
	return &ReviewHandler{service: service}
}

func (h *ReviewHandler) GetCourtReviews(c *fiber.Ctx) error {
	courtID := c.Params("id")

	reviews, err := h.service.GetReviewsByCourtID(courtID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Gagal mengambil data review",
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Berhasil mengambil review",
		"data":    reviews,
	})
}

func (h *ReviewHandler) GetOwnerReviews(c *fiber.Ctx) error {
	ownerID := c.Locals("user_id").(string)

	reviews, err := h.service.GetReviewsByOwnerID(ownerID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false, "message": "Gagal mengambil data review",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true, "message": "Berhasil mengambil review", "data": reviews,
	})
}

func (h *ReviewHandler) GetCourtRatingSummary(c *fiber.Ctx) error {
	courtID := c.Params("id")

	summary, err := h.service.GetRatingSummary(courtID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false,
			"message": "Gagal mengambil ringkasan rating",
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "Berhasil mengambil ringkasan rating",
		"data":    summary,
	})
}