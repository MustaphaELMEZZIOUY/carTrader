import { ParsedUrlQuery } from "querystring";
import { CarModel } from "../../api/Car";
import getAsaString from "../getAsaString";
import { openDB } from "../openDB";

const mainQuery = `
    FROM car
    WHERE (@make is NULL OR @make = make)
    AND (@model is NULL OR @model = model)
    AND (@minPrice is NULL OR @minPrice <= price)
    AND (@maxPrice is NULL OR @maxPrice >= price)
`;
export async function getPaginatedCars(query: ParsedUrlQuery) {
    const db = await openDB();
    const params = {
        '@make': getValueAsStr(query.make),
        '@model': getValueAsStr(query.model),
        '@minPrice': getValueAsNbr(query.minPrice),
        '@maxPrice': getValueAsNbr(query.maxPrice),
    };
    const rowPerPage = getValueAsNbr(query.rowPerPage) || 4;
    const currentPage = getValueAsNbr(query.page) || 1;
    const offset = (currentPage - 1) * rowPerPage;

    //   


    const carsPromise = db.all<CarModel[]>(
        `
        select *
        ${mainQuery}
        LIMIT @rowPerPage OFFSET @offset
        `,
        {
            ...params,
            '@rowPerPage': rowPerPage,
            '@offset': offset,
        }
    );

    const totalRowsPromise = db.get(`
        select COUNT(*) as count ${mainQuery}
    `, params);

    const [cars, totalRows] = await Promise.all([carsPromise, totalRowsPromise]);

    return {
        cars,
        totalPages: Math.ceil(totalRows.count / rowPerPage)
    }
}

const getValueAsNbr = (value: string | string[]) => {
    const newValue = getValueAsStr(value);
    const nbr = parseInt(newValue);
    return isNaN(nbr) ? null : nbr;
}

const getValueAsStr = (value: string | string[]) => {
    const newValue = getAsaString(value);
    return !newValue || newValue === 'all' ? null : newValue;
}