import { venueRepository } from '../repositories/venue-repository';
import type { NewVenue, UpdateVenue } from '@packages/types/venue-types';
// import { stadiums } from '../db/schema';

export const venueService = {
  // CREATE
  async createVenue(data: NewVenue) {
    try {
      return await venueRepository.create(data);
    } catch (error) {
      throw new Error('Erro ao criar a sede.');
    }
  },

  // READ (All)
  async getAllVenues() {
    try {
      return await venueRepository.findAll();
    } catch (error) {
      throw new Error('Erro ao buscar as sedes.');
    }
  },

  // READ (One)
  async getVenueById(id: number) {
    try {
      return await venueRepository.findById(id);
    } catch (error) {
      throw new Error('Erro ao buscar a sede específica.');
    }
  },

  // UPDATE
  async updateVenue(id: number, data: UpdateVenue) {
    try {
      return await venueRepository.update(id, data);
    } catch (error) {
      throw new Error('Erro ao atualizar a sede.');
    }
  },

  // DELETE
  async deleteVenue(id: number) {
    try {
      return await venueRepository.delete(id);
    } catch (error) {
      throw new Error('Erro ao excluir a sede.');
    }
  },

  // BUSINESS RULES: Geo-data consolidation for Leaflet Map
  async getVenuesForMap() {
    try {
      const venues = await this.getAllVenues();

      // Filtra sedes sem coordenadas e padroniza o formato [lat, lng] exigido pelo Leaflet
      return venues
        .filter(v => v.latitude !== null && v.longitude !== null)
        .map(v => ({
          id: v.id,
          name: v.name,
          city: v.city,
          capacity: v.capacity,
          coordinates: [v.latitude, v.longitude] as [number, number]
        }));
    } catch (error) {
      throw new Error('Erro ao consolidar os dados de geolocalização das sedes.');
    }
  }
};
