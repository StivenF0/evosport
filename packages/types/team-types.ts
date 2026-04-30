export interface Team {
  id: number;
  name: string;
  flagUrl: string | null;
}

export type NewTeam = Omit<Team, "id" | "flagUrl"> & {
  flagUrl?: string | null;
};

export type UpdateTeam = Partial<Omit<Team, "id">>;
