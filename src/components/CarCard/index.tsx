import { Avatar, Card, CardContent, CardHeader, CardMedia, IconButton, Typography } from "@material-ui/core"
import { CarModel } from "../../../api/Car"
import { useStyles } from "./styles";
import Link from 'next/link';

const CarCard = ({ car }: { car: CarModel }) => {
    const classes = useStyles();
    return (
        <Link href={`/car/[make]/[model]/[id]`} as={`/car/${car.make}/${car.model}/${car.id}`}>
            <Card className={classes.card}>
                <CardHeader
                    avatar={
                        <Avatar className={classes.avatar} aria-label={`${car.make} ${car.model}`}>
                            {car.make[0]}
                        </Avatar>
                    }
                    title={`${car.make} ${car.model}`}
                    subheader={`$${car.price}`}
                />
                <CardMedia
                    component="img"
                    image={car.photoUrl}
                    alt={`${car.make} ${car.model}`}
                    className={classes.media}
                />
                <CardContent>
                    <Typography variant="body1">
                        {car.details}
                    </Typography>
                </CardContent>
            </Card>
        </Link>
    )
}

export default CarCard
