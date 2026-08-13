package main

import (
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
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

	storageClient := config.ConnectStorage(cfg)
	storageRepo := repositories.NewStorageGarage(storageClient, cfg.StorageBucket, cfg.StoragePublicEndpoint)
	courtsRepo := repositories.NewCourtsPostgres(db)
	courtsService := services.NewCourtService(courtsRepo, storageRepo)
	courtsHandler := handlers.NewCourtsHandler(courtsService)

	uploadHandler := handlers.NewUploadHandler(storageRepo)

	userRepo := repositories.NewUserPostgres(db)
	sessionRepo := repositories.NewSessionRedis(redisClient)
	authService := services.NewAuthService(userRepo, sessionRepo, cfg)
	authHandler := handlers.NewAuthHandler(authService, cfg.JWTAccessSecret)

	reviewRepo := repositories.NewReviewPostgres(db)
	reviewService := services.NewReviewService(reviewRepo)
	reviewHandler := handlers.NewReviewHandler(reviewService)

	facilityRepo := repositories.NewFacilityPostgres(db)
	facilityHandler := handlers.NewFacilityHandler(facilityRepo)

	bookingRepo := repositories.NewBookingPostgres(db)
	bookingService := services.NewBookingService(bookingRepo, courtsRepo)
	bookingHandler := handlers.NewBookingHandler(bookingService)

	app := fiber.New()
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000",
		AllowMethods:     "GET,POST,PUT,DELETE,OPTIONS",
		AllowHeaders:     "Content-Type,Authorization",
		AllowCredentials: true,
	}))

	routes.SetupRoutes(app, courtsHandler, authHandler, reviewHandler, bookingHandler, facilityHandler, uploadHandler, cfg.JWTAccessSecret, sessionRepo)

	log.Printf("🚀 Server berjalan di port %s", cfg.AppPort)
	if err := app.Listen(":" + cfg.AppPort); err != nil {
		log.Fatalf("Gagal menjalankan server: %v", err)
	}
}