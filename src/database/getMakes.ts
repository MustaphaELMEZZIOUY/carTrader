import { openDB } from "../openDB";

export interface Make {
    make: string;
    count: number
}

export default async function getMakes () {
    const db = await openDB();
    const makes = await db.all<Make>(`
        select make, count(*) as count from Car group by make
    `);

    return makes;
}