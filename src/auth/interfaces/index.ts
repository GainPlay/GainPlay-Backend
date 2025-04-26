import { UUID } from "crypto";

export const enum AuthReflectors {
  IS_PUBLIC = "isPublic",
}

export type AccessToken = {
  access_token: string;
};

export type AccessTokenPayload = {
  userId: UUID;
  email: string;
};
