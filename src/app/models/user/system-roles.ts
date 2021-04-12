export class SystemRoles {
    public static Admin = 1;
    public static Moderator = 2;
    public static User = 3;

    public static toDropdownArray() {
        return [
            { label: 'Admin', value: this.Admin },
            { label: 'Moderator', value: this.Moderator },
            { label: 'User', value: this.User }
        ];
    }
}
