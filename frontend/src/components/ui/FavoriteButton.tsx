"use client";
import { Star, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}

export function FavoriteButton({ isFavorite, onToggle }: FavoriteButtonProps) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="text-muted-foreground hover:text-yellow-500"
      onClick={onToggle}
    >
      {isFavorite ? (
        <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
      ) : (
        <StarOff className="h-4 w-4" />
      )}
      <span className="sr-only">{isFavorite ? "Unfavorite" : "Favorite"}</span>
    </Button>
  );
}
