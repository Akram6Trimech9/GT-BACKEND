import { Role } from "../enums/role"
 
export interface UserI {
    id?: string
    firstName?: string
    lastName?: string
    avatarId?: string
    avatar?:LocalFileDto
    email?: string
    password?: string
    country?: string
    address?: string
    role?: Role
    isEmailConfirmed?: boolean
    refreshToken?: string
}
