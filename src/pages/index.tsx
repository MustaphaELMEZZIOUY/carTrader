import { Button, FormControl, Grid, InputLabel, MenuItem, Paper, Select, SelectProps } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Field, Form, Formik, useField, useFormikContext } from "formik";
import { GetServerSideProps } from "next";
import router, { useRouter } from "next/router";
import useSWR from "swr";
import getMakes, { Make } from "../database/getMakes";
import getModel, { Model } from "../database/getModels";
import getAsaString from "../getAsaString";

export interface Props {
  makes: Make[];
  models: Model[];
  singleColumn?: boolean;
};

const prices = [1000, 2500, 5000, 10000, 15000, 50000, 250000];

const useStyle = makeStyles(theme => ({
  paper: {
    maxWidth: 500,
    padding: theme.spacing(3),
    margin: 'auto'
  }
}))

export default function Search({ makes, models, singleColumn }: Props) {
  const { query } = useRouter();
  const classes = useStyle();
  const initialValues = {
    make: getAsaString(query.make) || 'all',
    model: getAsaString(query.model) || 'all',
    maxPrice: getAsaString(query.maxPrice) || 'all',
    minPrice: getAsaString(query.minPrice) || 'all'
  }

  const smValue = singleColumn ? 12 : 6;

  return (
    <Formik initialValues={initialValues} onSubmit={(values) => {
      router.push({
        pathname: '/cars',
        query: {
          ...values,
          page: 1
        }
      },
        undefined,
        {
          shallow: true
        }
      )
    }
  }
    >
      {({ values }) => (
        <Form>
          <Paper elevation={3} className={classes.paper}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={smValue}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel id="demo-make-select-label">Make</InputLabel>
                  <Field
                    as={Select}
                    name="make"
                    labelId="demo-make-select-label"
                    label="Make"
                  >
                    <MenuItem value="all">
                      <em>All Makes</em>
                    </MenuItem>
                    {
                      makes.map(el => (
                        <MenuItem value={`${el.make}`} key={el.make}>
                          {`${el.make} (${el.count})`}
                        </MenuItem>
                      ))
                    }
                  </Field>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={smValue}>
                <ModelSelect name='model' models={models} make={values.make} />
              </Grid>

              <Grid item xs={12} sm={smValue}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="demo-min-select-label">Min Price</InputLabel>
                  <Field
                    as={Select}
                    name="minPrice"
                    labelId="demo-min-select-label"
                    label="Min Price"
                  >
                    <MenuItem value="all">
                      <em>No Min</em>
                    </MenuItem>
                    {
                      prices.map(el => (
                        <MenuItem value={el} key={el}>
                          {`$ ${el}`}
                        </MenuItem>
                      ))
                    }
                  </Field>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={smValue}>
                <FormControl variant="outlined" fullWidth>
                  <InputLabel id="demo-max-select-label">Max Price</InputLabel>
                  <Field
                    as={Select}
                    name="maxPrice"
                    labelId="demo-max-select-label"
                    label="Max Price"
                  >
                    <MenuItem value="all">
                      <em>No Max</em>
                    </MenuItem>
                    {
                      prices.map(el => (
                        <MenuItem value={el} key={el}>
                          {`$ ${el}`}
                        </MenuItem>
                      ))
                    }
                  </Field>
                </FormControl>
              </Grid> 

              <Grid item xs={12}>
                <Button type='submit' fullWidth variant="contained" color='primary'>
                  Search
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Form>
      )}
    </Formik>
  )
}

export interface ModelSelectProps extends SelectProps {
  name: string;
  models: Model[];
  make: string;
}

export function ModelSelect({ models, make, name, ...props }: ModelSelectProps) {
  const { setFieldValue } = useFormikContext()
  const [field] = useField({
    name
  });

  const { data } = useSWR<Model[]>('/api/models?make=' + make, {
    dedupingInterval: 60000,
    onSuccess: newValues => {
      if (!newValues.map(el => el.model).includes(field.value)) {
        // we want to make this field.value = 'all'
        setFieldValue(name, 'all')
      }
    }
  });
  const newModels = data || models

  return (
    <FormControl fullWidth variant="outlined">
      <InputLabel id="demo-model-select-label">Model</InputLabel>
      <Select
        labelId="demo-model-select-label"
        label="Model"
        {...field}
        {...props}
      >
        <MenuItem value="all">
          <em>All Model</em>
        </MenuItem>
        {
          newModels.map(el => (
            <MenuItem value={`${el.model}`} key={el.model}>
              {`${el.model} (${el.count})`}
            </MenuItem>
          ))
        }
      </Select>
    </FormControl>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const make = getAsaString(ctx.query?.make);
  const [makes, models] = await Promise.all([
    getMakes(),
    getModel(make)
  ]);

  return {
    props: {
      makes,
      models
    }
  }
}
