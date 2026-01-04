import type { User } from "@models";

const users: User[] = [
    { id: 1, name: "Ahmet", email: "ahmet@example.com" },
    { id: 2, name: "Mehmet", email: "mehmet@example.com" },
];

export const UserService = {
    findAll: (): User[] => {
        return users;
    },
    findById: (id: number): User | undefined => {
        return users.find((user) => user.id === id);
    },
    create: (user: User): User => {
        users.push(user);
        return user;
    },
};
