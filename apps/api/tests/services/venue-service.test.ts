import { beforeEach, describe, expect, it, spyOn } from "bun:test";
import { venueRepository } from "@api/repositories/venue-repository";
import { venueService } from "@api/services/venue-service";

describe("VenueService - Create Venue", () => {
  beforeEach(() => {
    spyOn(venueRepository, "create").mockRestore();
  });

  it("should create a new venue.", async () => {
    spyOn(venueRepository, "create").mockResolvedValue({
      id: 1,
      name: "Maracanã",
      city: "Rio de Janeiro",
      capacity: 78000,
      latitude: -22.91,
      longitude: -43.23,
    });

    const venue = await venueService.createVenue({
      name: "Maracanã",
      city: "Rio de Janeiro",
      capacity: 78000,
      latitude: -22.91,
      longitude: -43.23,
    });

    expect(venue).not.toBeNull();
    expect(venue?.name).toBe("Maracanã");
    expect(venue?.capacity).toBe(78000);
  });

  it("should throw an error if venue failed to be created.", async () => {
    spyOn(venueRepository, "create").mockRejectedValue(new Error());

    const venue = venueService.createVenue({
      name: "Maracanã",
      city: "Rio de Janeiro",
    });

    expect(venue).rejects.toThrow("Erro ao criar a sede.");
  });
});

describe("VenueService - Find By Id", () => {
  beforeEach(() => {
    spyOn(venueRepository, "findById").mockRestore();
  });

  it("should find a venue by id.", async () => {
    spyOn(venueRepository, "findById").mockResolvedValue({
      id: 1,
      name: "Maracanã",
      city: "Rio de Janeiro",
      capacity: 78000,
      latitude: -22.91,
      longitude: -43.23,
    });

    const venue = await venueService.getVenueById(1);

    expect(venue).not.toBeNull();
    expect(venue?.id).toBe(1);
    expect(venue?.name).toBe("Maracanã");
  });

  it("should throw an error if no venue was found.", async () => {
    spyOn(venueRepository, "findById").mockRejectedValue(new Error());

    const venue = venueService.getVenueById(99);

    expect(venue).rejects.toThrow("Erro ao buscar a sede específica.");
  });
});

describe("VenueService - Get All", () => {
  beforeEach(() => {
    spyOn(venueRepository, "findAll").mockRestore();
  });

  it("should return all venues.", async () => {
    spyOn(venueRepository, "findAll").mockResolvedValue([
      {
        id: 1,
        name: "Maracanã",
        city: "Rio de Janeiro",
        capacity: 78000,
        latitude: -22.91,
        longitude: -43.23,
      },
      {
        id: 2,
        name: "Arena Dunnas",
        city: "Mossoró",
        capacity: 45000,
        latitude: -5.18,
        longitude: -37.34,
      },
    ]);

    const venues = await venueService.getAllVenues();

    expect(venues).not.toBeArrayOfSize(0);
    expect(venues[0]?.id).toBe(1);
    expect(venues[1]?.name).toBe("Arena Dunnas");
  });

  it("should throw an error if no venue was found.", async () => {
    spyOn(venueRepository, "findAll").mockRejectedValue(new Error());

    const venues = venueService.getAllVenues();

    expect(venues).rejects.toThrow("Erro ao buscar as sedes.");
  });
});

describe("VenueService - Update Venue", () => {
  beforeEach(() => {
    spyOn(venueRepository, "update").mockRestore();
  });

  it("should update a venue.", async () => {
    spyOn(venueRepository, "update").mockResolvedValue({
      id: 1,
      name: "Maracanã Atualizado",
      city: "Rio de Janeiro",
      capacity: 80000,
      latitude: -22.91,
      longitude: -43.23,
    });

    const venue = await venueService.updateVenue(1, {
      capacity: 80000,
      name: "Maracanã Atualizado",
    });

    expect(venue).not.toBeNull();
    expect(venue?.id).toBe(1);
    expect(venue?.name).toBe("Maracanã Atualizado");
    expect(venue?.capacity).toBe(80000);
  });

  it("should throw an error if no venue was found for update.", async () => {
    spyOn(venueRepository, "update").mockRejectedValue(new Error());

    const venue = venueService.updateVenue(99, { capacity: 80000 });

    expect(venue).rejects.toThrow("Erro ao atualizar a sede.");
  });
});

describe("VenueService - Delete Venue", () => {
  beforeEach(() => {
    spyOn(venueRepository, "delete").mockRestore();
  });

  it("should delete a venue.", async () => {
    spyOn(venueRepository, "delete").mockResolvedValue({
      id: 1,
      name: "Maracanã",
      city: "Rio de Janeiro",
      capacity: 78000,
      latitude: -22.91,
      longitude: -43.23,
    });

    const venue = await venueService.deleteVenue(1);

    expect(venue).not.toBeNull();
    expect(venue?.id).toBe(1);
  });

  it("should throw an error if no venue was found for delete.", async () => {
    spyOn(venueRepository, "delete").mockRejectedValue(new Error());

    const venue = venueService.deleteVenue(99);

    expect(venue).rejects.toThrow("Erro ao excluir a sede.");
  });
});

describe("VenueService - Get Venues For Map (Business Rule)", () => {
  beforeEach(() => {
    spyOn(venueService, "getAllVenues").mockRestore();
  });

  it("should filter venues without coordinates and map them to Leaflet format.", async () => {
    spyOn(venueService, "getAllVenues").mockResolvedValue([
      {
        id: 1,
        name: "Maracanã",
        city: "Rio de Janeiro",
        capacity: 78000,
        latitude: -22.91,
        longitude: -43.23,
      },
      {
        id: 2,
        name: "Estádio Incompleto",
        city: "São Paulo",
        capacity: 40000,
        latitude: null,
        longitude: null,
      },
      {
        id: 3,
        name: "Arena Dunnas",
        city: "Mossoró",
        capacity: 45000,
        latitude: -5.18,
        longitude: -37.34,
      },
    ]);

    const mapVenues = await venueService.getVenuesForMap();

    // Deve ignorar o "Estádio Incompleto" que tem lat/lng nulos
    expect(mapVenues).toBeArrayOfSize(2);

    // Verifica a estrutura e conversão para tupla [lat, lng]
    expect(mapVenues[0]?.coordinates).toEqual([-22.91, -43.23]);
    expect(mapVenues[1]?.coordinates).toEqual([-5.18, -37.34]);
    expect(mapVenues[1]?.name).toBe("Arena Dunnas");
  });

  it("should throw an error if map consolidation fails.", async () => {
    spyOn(venueService, "getAllVenues").mockRejectedValue(new Error());

    const result = venueService.getVenuesForMap();

    expect(result).rejects.toThrow("Erro ao consolidar os dados de geolocalização das sedes.");
  });
});
