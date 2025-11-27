export interface IUser {
    id: string;
    tenantId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}
export interface ITenant {
    id: string;
    name: string;
    slug: string;
    status: string;
}
export interface IRequestWithUser extends Request {
    user: IUser;
    tenant?: ITenant;
}
