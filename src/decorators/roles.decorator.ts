import { UserRole } from "@/user/user.entity";
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserRole[]) => SetMetadata("role", roles);