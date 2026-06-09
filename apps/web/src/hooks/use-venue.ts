import { useQuery } from "@tanstack/react-query";
import { venueService } from "../services/venue-service";

export const venueKeys = {
  all: ["venues"] as const,
};

export const useVenues = () =>
  useQuery({ queryKey: venueKeys.all, queryFn: venueService.getAllVenues });
