import { RoleType } from "@core/enums/role-type.enum";
import { Role } from "roles/entities/role.entity";

export const roles: Role[] = [
    {
        name: RoleType.ADMIN,
        active: true,
        createdAt: new Date(),
        updateAt: null
    },
    {
        name: RoleType.USER,
        active: true,
        createdAt: new Date(),
        updateAt: null
    }
]