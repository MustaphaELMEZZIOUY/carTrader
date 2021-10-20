import { makeStyles } from "@material-ui/core";
import { red } from '@material-ui/core/colors';

export const useStyles = makeStyles(theme => ({
    card: {
        cursor: 'pointer'
    },
    avatar: {
        backgroundColor: red[500]
    },
    media: {
        height: '300px',
        width: '100%',
        objectFit: 'contain'
    }
}))