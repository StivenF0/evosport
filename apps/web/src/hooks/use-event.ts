import { useQuery } from '@tanstack/react-query';
import { eventService } from '../services/event-service';

export const eventKeys = {
  all: ['event'] as const,
};

export const usePrimaryEvent = () =>
  useQuery({ queryKey: eventKeys.all, queryFn: eventService.getPrimaryEvent });
