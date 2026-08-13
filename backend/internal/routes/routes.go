package routes

import (
	"github.com/gofiber/fiber/v2"

	"github.com/beckham-kho/kourt/internal/handlers"
	"github.com/beckham-kho/kourt/internal/middleware"
	"github.com/beckham-kho/kourt/internal/repositories"
)

func SetupRoutes(app *fiber.App, courtHandler *handlers.CourtsHandler, authHandler *handlers.AuthHandler, reviewHandler *handlers.ReviewHandler, bookingHandler *handlers.BookingHandler, facilityHandler *handlers.FacilityHandler, uploadHandler *handlers.UploadHandler, jwtAccessSecret string, sessionRepo repositories.SessionRepository) {
	api := app.Group("/api/v1")

	auth := api.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)
	auth.Get("/me", middleware.RequireAuth(jwtAccessSecret, sessionRepo), authHandler.Me)
	auth.Post("/refresh", authHandler.Refresh)
	auth.Post("/logout", middleware.RequireAuth(jwtAccessSecret, sessionRepo), authHandler.Logout)

	courts := api.Group("/courts")
	courts.Get("/", courtHandler.GetAllCourts)
	courts.Get("/:id", courtHandler.GetCourtByID)
	courts.Get("/owner/mine", middleware.RequireAuth(jwtAccessSecret, sessionRepo), middleware.RequireRole("renter"), courtHandler.GetMyCourts)
	courts.Post("/", middleware.RequireAuth(jwtAccessSecret, sessionRepo), middleware.RequireRole("renter"), courtHandler.CreateCourt)
	courts.Delete("/:id", middleware.RequireAuth(jwtAccessSecret, sessionRepo), middleware.RequireRole("renter"), courtHandler.DeleteCourt)
	courts.Put("/:id", middleware.RequireAuth(jwtAccessSecret, sessionRepo), middleware.RequireRole("renter"), courtHandler.UpdateCourt)
	courts.Post("/:id/image", middleware.RequireAuth(jwtAccessSecret, sessionRepo), middleware.RequireRole("renter"), courtHandler.UploadCourtImage)
	courts.Delete("/:id/image/:imageId", middleware.RequireAuth(jwtAccessSecret, sessionRepo), middleware.RequireRole("renter"), courtHandler.DeleteCourtImage)
	courts.Get("/:id/reviews", reviewHandler.GetCourtReviews)
	courts.Get("/:id/reviews/summary", reviewHandler.GetCourtRatingSummary)
	courts.Patch("/:id/active", middleware.RequireAuth(jwtAccessSecret, sessionRepo), middleware.RequireRole("renter"), courtHandler.ToggleCourtActive)

	uploads := api.Group("/uploads")
	uploads.Post("/image", middleware.RequireAuth(jwtAccessSecret, sessionRepo), middleware.RequireRole("renter"), uploadHandler.UploadImage)

	facilities := api.Group("/facilities")
	facilities.Get("/", facilityHandler.GetAllFacilities)

	bookings := api.Group("/bookings")
	bookings.Post("/", middleware.RequireAuth(jwtAccessSecret, sessionRepo), middleware.RequireRole("customer"), bookingHandler.CreateBooking)
	bookings.Get("/my", middleware.RequireAuth(jwtAccessSecret, sessionRepo), bookingHandler.GetMyBookings)
	bookings.Get("/owner", middleware.RequireAuth(jwtAccessSecret, sessionRepo), middleware.RequireRole("renter"), bookingHandler.GetOwnerBookings)
	bookings.Get("/owner/schedule", middleware.RequireAuth(jwtAccessSecret, sessionRepo), middleware.RequireRole("renter"), bookingHandler.GetWeeklySchedule)
	bookings.Get("/owner/stats", middleware.RequireAuth(jwtAccessSecret, sessionRepo), middleware.RequireRole("renter"), bookingHandler.GetStats)
	bookings.Patch("/:id/status", middleware.RequireAuth(jwtAccessSecret, sessionRepo), middleware.RequireRole("renter"), bookingHandler.UpdateBookingStatus)

}