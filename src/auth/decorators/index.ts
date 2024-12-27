import { AuthReflectors } from "@/auth/interfaces";
import { SetMetadata } from "@nestjs/common";

export const Public = () => SetMetadata(AuthReflectors.IS_PUBLIC, true);
