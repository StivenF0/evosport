export type UserRole = "user" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}

export type NewUser = {
  name: string;
  email: string;
  password: string;
};

export type UpdateUser = Partial<Pick<User, "name">>;
