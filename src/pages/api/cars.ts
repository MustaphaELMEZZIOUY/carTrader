import { NextApiRequest, NextApiResponse } from "next";
import { getPaginatedCars } from "../../database/getPaginatedCars";

export default async function Cars(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const cars = await getPaginatedCars(req.query);

    return res.json(cars);
}