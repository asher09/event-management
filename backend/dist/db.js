"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
const pg_1 = require("pg");
const pool = new pg_1.Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT ? parseInt(process.env.PGPORT) : 5432,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
});
const query = (text, params) => pool.query(text, params);
exports.query = query;
