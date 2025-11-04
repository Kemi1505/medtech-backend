import { RoleType } from "./db.enums";

export interface ReqBody{
    userId: string,
    roleType: RoleType,
    iat: number,
    exp: number
}