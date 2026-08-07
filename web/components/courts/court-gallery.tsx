"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { CourtImage } from "@/types/court";
import { cn } from "@/lib/utils";
import { Images } from "lucide-react";
import { Button } from "../ui/button";

export default function CourtGallery({
  images,
  courtName,
}: {
  images: CourtImage[];
  courtName: string;
}) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [mobileApi, setMobileApi] = useState<CarouselApi>();
  const [mobileIndex, setMobileIndex] = useState(0);

  const displayImages: CourtImage[] =
    images.length > 0
      ? images
      : [
          {
            id: "placeholder",
            image_url: "https://placehold.co/800x450",
            court_id: "",
            is_primary: true,
            display_order: 0,
          },
        ];

  const visibleImages = displayImages.slice(0, 3);
  const remainingCount = displayImages.length - visibleImages.length;
  const mainImage = visibleImages[0];
  const sideImages = visibleImages.slice(1);
  const emptySlots = Math.max(0, 2 - sideImages.length);

  useEffect(() => {
    if (!mobileApi) return;

    const onSelect = () => setMobileIndex(mobileApi.selectedScrollSnap());
    onSelect();
    mobileApi.on("select", onSelect);
    mobileApi.on("reInit", onSelect);

    return () => {
      mobileApi.off("select", onSelect);
      mobileApi.off("reInit", onSelect);
    };
  }, [mobileApi]);

  return (
    <div className="w-full">
      <div className="md:hidden w-full">
        <Carousel
          setApi={setMobileApi}
          opts={{ align: "start" }}
          className="w-full"
        >
          <CarouselContent>
            {displayImages.map((img, index) => (
              <CarouselItem key={img.id}>
                <div className="relative aspect-video w-full overflow-hidden bg-muted">
                  <img
                    src={img.image_url}
                    alt={`${courtName} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {displayImages.length > 1 && (
                    <div className="absolute top-2 right-2 rounded-full bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
                      {index + 1}/{displayImages.length}
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

        {displayImages.length > 1 && (
          <div className="mt-2 flex items-center justify-center gap-1.5">
            {displayImages.map((_, index) => (
              <button
                key={index}
                onClick={() => mobileApi?.scrollTo(index)}
                aria-label={`Ke foto ${index + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  mobileIndex === index
                    ? "w-4 bg-primary"
                    : "w-1.5 bg-muted-foreground/30",
                )}
              />
            ))}
          </div>
        )}
      </div>

      <div className="hidden md:flex gap-2 w-full">
        <div className="w-2/3 shrink-0 relative rounded-xl overflow-hidden bg-muted aspect-video">
          <img
            src={mainImage.image_url}
            alt={courtName}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 flex flex-col gap-2">
          {sideImages.map((img, index) => {
            const isLastVisible =
              index === sideImages.length - 1 && remainingCount > 0;

            return (
              <div
                key={img.id}
                className="relative flex-1 rounded-lg overflow-hidden bg-muted"
              >
                <img
                  src={img.image_url}
                  alt={`${courtName} ${index + 2}`}
                  className="w-full h-full object-cover"
                />
                {isLastVisible && (
                  <button
                    onClick={() => setGalleryOpen(true)}
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 hover:bg-black/60 transition-colors text-white font-medium"
                  >
                    <Images className="w-5 h-5" />
                    <span>+{remainingCount} foto</span>
                  </button>
                )}
              </div>
            );
          })}

          {Array.from({ length: emptySlots }).map((_, i) => (
            <div key={`empty-${i}`} className="flex-1 rounded-lg bg-muted" />
          ))}
        </div>
      </div>

      <div className="hidden md:flex justify-end mt-2">
        <Button onClick={() => setGalleryOpen(true)} variant="link">
          Lihat semua {displayImages.length} foto
        </Button>
      </div>

      <Dialog open={galleryOpen} onOpenChange={setGalleryOpen}>
        <DialogContent className="w-full md:min-w-1/2 px-4 md:px-15">
          <DialogTitle>{courtName} - Semua Foto</DialogTitle>
          <GalleryCarousel images={displayImages} courtName={courtName} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function GalleryCarousel({
  images,
  courtName,
}: {
  images: CourtImage[];
  courtName: string;
}) {
  const [mainApi, setMainApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onThumbClick = (index: number) => {
    if (!mainApi) return;
    mainApi.scrollTo(index);
  };

  const onSelect = () => {
    if (!mainApi) return;
    const index = mainApi.selectedScrollSnap();
    setSelectedIndex(index);
    thumbApi?.scrollTo(index);
  };

  useEffect(() => {
    if (!mainApi) return;
    onSelect();
    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);
  }, [mainApi, thumbApi]);

  return (
    <div className="w-full mt-2">
      <Carousel setApi={setMainApi} className="w-full">
        <CarouselContent>
          {images.map((img, index) => (
            <CarouselItem key={img.id}>
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-muted">
                <img
                  src={img.image_url}
                  alt={`${courtName} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>

      {images.length > 1 && (
        <Carousel setApi={setThumbApi} className="w-full mt-3">
          <CarouselContent className="ml-0 gap-2">
            {images.map((img, index) => (
              <CarouselItem key={img.id} className="basis-1/5 pl-0">
                <button
                  onClick={() => onThumbClick(index)}
                  className={cn(
                    "aspect-video w-full rounded-md overflow-hidden border-2 transition-all",
                    selectedIndex === index
                      ? "border-primary opacity-100"
                      : "border-transparent opacity-60 hover:opacity-100",
                  )}
                >
                  <img
                    src={img.image_url}
                    alt={`${courtName} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      )}
    </div>
  );
}
