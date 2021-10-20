import { openDB } from "../openDB";
import getAsaString from '../getAsaString';

export interface Model {
    model: string;
    count: number
}

export default async function getModel(make: string | string[]) {
    const Make = getAsaString(make);
    const db = await openDB();
    const makes = await db.all<Model>(`
        select model, count(*) as count 
        from Car
         where make = @make 
         group by model
    `, { '@make': Make });

    return makes;
}