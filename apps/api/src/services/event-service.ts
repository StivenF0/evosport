import type { NewEvent, UpdateEvent } from "@packages/types";
import { eventRepository } from "../repositories/event-repository";

export const eventService = {
  // CREATE
  async createEvent(data: NewEvent) {
    try {
      return await eventRepository.create(data);
    } catch (error) {
      throw new Error("Erro ao criar o evento.");
    }
  },

  // READ (All)
  async getAllEvents() {
    try {
      return await eventRepository.findAll();
    } catch (error) {
      throw new Error("Erro ao buscar os eventos.");
    }
  },

  // READ (One)
  async getEventById(id: number) {
    try {
      return await eventRepository.findById(id);
    } catch (error) {
      throw new Error("Erro ao buscar o evento específico.");
    }
  },

  // UPDATE
  async updateEvent(id: number, data: UpdateEvent) {
    try {
      return await eventRepository.update(id, data);
    } catch (error) {
      throw new Error("Erro ao atualizar o evento.");
    }
  },

  // DELETE
  async deleteEvent(id: number) {
    try {
      return await eventRepository.delete(id);
    } catch (error) {
      throw new Error("Erro ao excluir o evento.");
    }
  },
};
