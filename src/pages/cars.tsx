import { Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, SelectProps } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { PaginationRenderItemParams } from '@material-ui/lab';
import Pagination from '@material-ui/lab/Pagination';
import PaginationItem from '@material-ui/lab/PaginationItem';
import { Field, Form, Formik, useField, useFormikContext } from "formik";
import { GetServerSideProps } from "next";
import router, { useRouter } from "next/router";
import Link from 'next/link'
import useSWR from "swr";
import { CarModel } from "../../api/Car";
import getMakes, { Make } from "../database/getMakes";
import getModel, { Model } from "../database/getModels";
import { getPaginatedCars } from "../database/getPaginatedCars";
import getAsaString from "../getAsaString";
import Search from './';
import { ParsedUrlQuery, stringify } from "querystring";
import { forwardRef, useState } from "react";
import deepEqual from 'fast-deep-equal'
import CarPagination from "../components/CarPagination";
import CarCard from "../components/CarCard";


export interface Props {
    makes: Make[];
    models: Model[];
    cars: CarModel[];
    totalPages: number;
};

const Cars = ({ makes, models, cars, totalPages }: Props) => {
    const { query } = useRouter();
    const [serverQuery] = useState(query);
    const { data } = useSWR(
        '/api/cars?' + stringify(query),
        {
            dedupingInterval: 15 * 1000,
            initialData: deepEqual(query, serverQuery) ? { cars, totalPages } : undefined,
        }
    );
    




    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={5} md={2}>
                <Search models={models} makes={makes} singleColumn={true} />
            </Grid>
            <Grid item xs={12} sm={7} md={10} container>
                <Grid item xs={12}>
                    <CarPagination totalPage={data?.totalPages} />
                </Grid>

                <Grid item xs={12} container spacing={3} style={{margin: '20px auto'}}>
                    {
                        (data?.cars || []).map(car => (
                            <Grid item xs={12} sm={6} key={car.id}>
                                <CarCard car={car} />
                            </Grid>
                        ))
                    }
                </Grid>

                <Grid item xs={12}>
                    <CarPagination totalPage={data?.totalPages} />
                </Grid>
            </Grid>
        </Grid>
    )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const make = getAsaString(ctx.query?.make);
    const [makes, models, paginatedCars] = await Promise.all([
        getMakes(),
        getModel(make),
        getPaginatedCars(ctx.query)
    ]);

    return {
        props: {
            makes,
            models,
            cars: paginatedCars.cars,
            totalPages: paginatedCars.totalPages
        }
    }
}

export default Cars
