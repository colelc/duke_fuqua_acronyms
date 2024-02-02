import { User } from "../interface/user-if";

export class UserService {

    private user : User = {
        dukeId: "lcc9",
        firstName: "Linda",
        lastName: "Cole",
        isAdmin: true
    };

    constructor() {}

    getUser = () => {
        return this.user;
    }

    isUserAdmin = () => {
        return this.user.isAdmin;
    }

    setUserAdmin = (isAdmin: boolean) => {
        this.user.isAdmin = true;
    }

}