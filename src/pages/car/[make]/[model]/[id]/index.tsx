import { Grid, Paper, Typography } from "@material-ui/core";
import { GetServerSideProps } from "next";
import Head from 'next/head';
import { CarModel } from "../../../../../../api/Car";
import { openDB } from "../../../../../openDB";

export interface Props {
    car?: CarModel;
}
const Index = ({ car }: Props) => {
    if (!car) {
        return <h4>Sorry No Such a car much !!!</h4>
    };

    return (
        <Paper style={{padding:"10px"}}>
            <Head>
                <title>
                    {
                        car.make + ' ' + car.model
                    }
                </title>
            </Head>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={5}>
                        <img alt="complex" src={car.photoUrl} style={{width: '100%'}}/>
                </Grid>
                <Grid item xs={12} sm={6} md={7} container>
                    <Grid item xs container direction="column" spacing={2}>
                        <Grid item xs>
                            <Typography variant="h5" component="div">
                                {car.make + ' ' + car.model}
                            </Typography>
                            <Typography gutterBottom variant="h4" component="div">
                                ${car.price}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Year: {car.year}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                KMs: {car.kilometers}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Fuel Type: {car.fuelType}
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Details: {car.details}
                            </Typography>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    )
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const id = ctx?.params.id;
    const db = await openDB();
    const car = await db.get<CarModel | undefined>('select * from Car where id = ?', id)
    return {
        props: {
            car: car || null
        }
    }
}

export default Index
