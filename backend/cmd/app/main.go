package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"

	"github.com/beckham-kho/kourt/internal/config"
	"github.com/beckham-kho/kourt/internal/handlers"
	"github.com/beckham-kho/kourt/internal/repositories"
	"github.com/beckham-kho/kourt/internal/routes"
	"github.com/beckham-kho/kourt/internal/services"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println(".env tidak ditemukan, menggunakan environment variable sistem")
	}

	cfg := config.LoadConfig()
	if cfg.JWTAccessSecret == "" || cfg.JWTRefreshSecret == "" {
		log.Fatal("JWT_ACCESS_SECRET dan JWT_REFRESH_SECRET wajib di-set di .env")
	}

	db := config.ConnectPostgres(cfg)
	defer db.Close()

	redisClient := config.ConnectRedis(cfg)
	defer redisClient.Close()

	courtRepo := repositories.NewCourtPostgres(db)
	courtService := services.NewCourtService(courtRepo)
	courtHandler := handlers.NewCourtHandler(courtService)

	userRepo := repositories.NewUserPostgres(db)
	sessionRepo := repositories.NewSessionRedis(redisClient)
	authService := services.NewAuthService(userRepo, sessionRepo, cfg)
	authHandler := handlers.NewAuthHandler(authService, cfg.JWTAccessSecret)

	app := fiber.New()
	app.Use(logger.New())

	routes.SetupRoutes(app, courtHandler, authHandler, cfg.JWTAccessSecret, sessionRepo)

	log.Printf("🚀 Server berjalan di port %s", cfg.AppPort)
	if err := app.Listen(":" + cfg.AppPort); err != nil {
		log.Fatalf("Gagal menjalankan server: %v", err)
	}
}