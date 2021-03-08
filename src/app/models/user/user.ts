import { SystemRoles } from "./system-roles";

export class User {
    constructor(
        public UserId: number,
        public Username: string,
        public Password: string,
        public RoleId: number,
        public RoleName: string,
        public FirstName: string,
        public LastName: string,
        public Email: string,
        public Country: string,
        public State: string,
        public City: string,
        public ZipCode: string,
        public Address: string,
        public Phone: string,
        public IsBanned: boolean,
        public BannedUntil: Date,
        public BannedById: number,
        public BannedByUsername: string
    ) { }

    public static getInstance(obj: User) {
        return new User(
            obj.UserId,
            obj.Username,
            obj.Password,
            obj.RoleId,
            obj.RoleName,
            obj.FirstName,
            obj.LastName,
            obj.Email,
            obj.Country,
            obj.State,
            obj.City,
            obj.ZipCode,
            obj.Address,
            obj.Phone,
            obj.IsBanned,
            obj.BannedUntil,
            obj.BannedById,
            obj.BannedByUsername
        );
    }

    public hasRole(role: SystemRoles): boolean {
        if (this.RoleId === SystemRoles.Admin) {
            return true;
        }

        if (this.RoleId === role) {
            return true;
        }

        return false;
    }
}
