package handlers

import (
	"time"

	"github.com/gofiber/fiber/v2"

	"github.com/beckham-kho/kourt/internal/models"
	"github.com/beckham-kho/kourt/internal/services"
)

type BookingHandler struct {
	service *services.BookingService
}

func NewBookingHandler(service *services.BookingService) *BookingHandler {
	return &BookingHandler{service: service}
}

func (h *BookingHandler) CreateBooking(c *fiber.Ctx) error {
	customerID := c.Locals("user_id").(string)

	var input models.CreateBookingInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false, "message": "Body tidak valid",
		})
	}

	booking, err := h.service.CreateBooking(customerID, input)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false, "message": err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true, "message": "Booking berhasil dibuat", "data": booking,
	})
}

func (h *BookingHandler) GetOwnerBookings(c *fiber.Ctx) error {
	ownerID := c.Locals("user_id").(string)
	status := c.Query("status")

	bookings, err := h.service.GetOwnerBookings(ownerID, status)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false, "message": "Gagal mengambil data booking",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true, "message": "Berhasil mengambil booking", "data": bookings,
	})
}

func (h *BookingHandler) GetMyBookings(c *fiber.Ctx) error {
	customerID := c.Locals("user_id").(string)
	status := c.Query("status")

	bookings, err := h.service.GetCustomerBookings(customerID, status)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false, "message": "Gagal mengambil data booking",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true, "message": "Berhasil mengambil booking", "data": bookings,
	})
}

func (h *BookingHandler) GetWeeklySchedule(c *fiber.Ctx) error {
	ownerID := c.Locals("user_id").(string)

	startParam := c.Query("start")
	start, err := time.Parse(time.RFC3339, startParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false, "message": "Parameter start tidak valid, gunakan format RFC3339",
		})
	}
	end := start.AddDate(0, 0, 7)

	bookings, err := h.service.GetWeeklySchedule(ownerID, start, end)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false, "message": "Gagal mengambil jadwal",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true, "message": "Berhasil mengambil jadwal", "data": bookings,
	})
}

func (h *BookingHandler) UpdateBookingStatus(c *fiber.Ctx) error {
	ownerID := c.Locals("user_id").(string)
	bookingID := c.Params("id")

	var input models.UpdateBookingStatusInput
	if err := c.BodyParser(&input); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false, "message": "Body tidak valid",
		})
	}

	if err := h.service.UpdateStatus(bookingID, ownerID, input.Status); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"success": false, "message": err.Error(),
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true, "message": "Status booking berhasil diperbarui",
	})
}

func (h *BookingHandler) GetStats(c *fiber.Ctx) error {
	ownerID := c.Locals("user_id").(string)

	stats, err := h.service.GetStats(ownerID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"success": false, "message": "Gagal mengambil statistik",
		})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true, "message": "Berhasil mengambil statistik", "data": stats,
	})
}