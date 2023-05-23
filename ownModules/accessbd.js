const {Client} = require("pg");

class AccessBD {
    static #instance = null;
    static #initialized = null;

    constructor() {
        if (AccessBD.#instance) {
            throw new Error("Already Instantiated");
        } else if (!AccessBD.#initialized) {
            throw new Error("Must be instanced only on getInstance without throwing error");
        }
    }

    initLocal() {
        this.client = new Client({
            database: "license_database",
            user: "teodor",
            password: "teodor",
            host: "localhost",
            port: 5432,
        });

        this.client.connect();
    }

    getClient() {
        if (!AccessBD.#instance) {
            throw new Error("The class has not been instantiated");
        }
        return this.client;
    }

    static getInstance({init = "local"} = {}) {
        // being a singleton, this is now a class, not instance (static method)
        if (!this.#instance) {
            this.#initialized = true;
            this.#instance = new AccessBD();


            try {
                switch (init) {
                    case "local" :
                        this.#instance.initLocal();
                }

                // if the code reaches here that means that no error was at initialization
            } catch (e) {
                console.log("Error when initializing database!");
            }
        }
        return this.#instance;
    }


    select({table = "", selectedObjects = [], andConditions = []} = {}, callback) {
        let whereCondition = "";
        if (andConditions.length > 0)
            whereCondition = `where ${andConditions.join(" and ")}`;

        let command = `select ${selectedObjects.join(",")}
                       from ${table} ${whereCondition}`;
        console.error(command);
        this.client.query(command, callback);
    }

    insert({table = "", selectedObjects = [], valori = []} = {}, callback) {
        if (selectedObjects.length !== valori.length)
            throw new Error("Numarul de campuri difera de nr de valori")

        let command = `insert into ${table}(${selectedObjects.join(",")})
                       values (${valori.join(",")})`;
        console.log(command);
        this.client.query(command, callback)
    }


    update({table = "", selectedObjects = [], valori = [], andConditions = []} = {}, callback, parametriQuery) {
        if (selectedObjects.length !== valori.length)
            throw new Error("Numarul de campuri difera de nr de valori")
        let updatedSelectedObjects = [];
        for (let i = 0; i < selectedObjects.length; i++)
            updatedSelectedObjects.push(`${selectedObjects[i]}='${valori[i]}'`);
        let whereCondition = "";
        if (andConditions.length > 0)
            whereCondition = `where ${andConditions.join(" and ")}`;
        let command = `update ${table}
                       set ${updatedSelectedObjects.join(", ")} ${whereCondition}`;
        console.log(command);
        this.client.query(command, callback)
    }

    updatewParameters({
                           table = "",
                           selectedObjects = [],
                           valori = [],
                           andConditions = []
                       } = {}, callback, parametriQuery) {
        if (selectedObjects.length !== valori.length)
            throw new Error("Numarul de campuri difera de nr de valori")
        let updatedSelectedObjects = [];
        for (let i = 0; i < selectedObjects.length; i++)
            updatedSelectedObjects.push(`${selectedObjects[i]}=$${i + 1}`);
        let whereCondition = "";
        if (andConditions.length > 0)
            whereCondition = `where ${andConditions.join(" and ")}`;
        let command = `update ${table}
                       set ${updatedSelectedObjects.join(", ")} ${whereCondition}`;
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1111", command);
        this.client.query(command, valori, callback)
    }

    delete({table = "", andConditions = []} = {}, callback) {
        let whereCondition = "";
        if (andConditions.length > 0)
            whereCondition = `where ${andConditions.join(" and ")}`;

        let command = `delete
                       from ${table} ${whereCondition}`;
        console.log(command);
        this.client.query(command, callback)
    }
}

module.exports = AccessBD;