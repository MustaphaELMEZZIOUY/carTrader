import { NextApiRequest, NextApiResponse } from "next";
import getModel from "../../database/getModels";
import getAsaString from "../../getAsaString";

export default async function models(req: NextApiRequest, res: NextApiResponse) {
    const make = getAsaString(req.query.make);
    const models = await getModel(make);

    res.json(models);
}