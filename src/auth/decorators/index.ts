import { SetMetadata } from "@nestjs/common";
import { AuthReflectors } from "@/auth/interfaces";

export const Public = () => SetMetadata(AuthReflectors.IS_PUBLIC, true);
