package routes

import (
	"github.com/gofiber/fiber/v2"

	"github.com/beckham-kho/kourt/internal/handlers"
	"github.com/beckham-kho/kourt/internal/middleware"
	"github.com/beckham-kho/kourt/internal/repositories"
)

func SetupRoutes(app *fiber.App, courtHandler *handlers.CourtHandler, authHandler *handlers.AuthHandler, jwtAccessSecret string, sessionRepo repositories.SessionRepository) {
	api := app.Group("/api/v1")

	auth := api.Group("/auth")
	auth.Post("/register", authHandler.Register)
	auth.Post("/login", authHandler.Login)
	auth.Post("/refresh", authHandler.Refresh)
	auth.Post("/logout", middleware.RequireAuth(jwtAccessSecret, sessionRepo), authHandler.Logout)

	courts := api.Group("/courts")
	courts.Get("/", courtHandler.GetAllCourts)
	courts.Post("/", middleware.RequireAuth(jwtAccessSecret, sessionRepo), middleware.RequireRole("renter"), courtHandler.GetAllCourts)
}