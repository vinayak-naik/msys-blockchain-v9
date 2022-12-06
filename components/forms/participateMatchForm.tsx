import React, { useState } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import style from "../../styles/pages/participate.module.css";
import { ErrorMessage, Form, Formik } from "formik";
import TextError from "../reusable/textError";
import * as Yup from "yup";
import { useRouter } from "next/router";

const ParticipateMatchForm = () => {
  const { query } = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const initialValues = {
    amount: 0,
  };

  const validationSchema = Yup.object({
    amount: Yup.number()
      .required("Please enter any amount")
      .typeError("You must specify a number")
      .min(1, "Minimum bet amount is 1 MSCN")
      .max(1000, "Maximum bet amount is 1000 MSCN"),
  });

  const onSubmit = async () => {
    setLoading(false);
  };
  return (
    <div className={style.formBox}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => {
          return (
            <div className={style.formContainer}>
              <h1>Participate for {query.name}</h1>
              <Form method="post" className={style.formBox}>
                <div className={style.inputBox}>
                  <TextField
                    fullWidth
                    type="number"
                    id="amount"
                    label="Amount"
                    variant="outlined"
                    {...formik.getFieldProps("amount")}
                  />
                  <div className={style.errorBox}>
                    <ErrorMessage component={TextError} name="amount" />
                  </div>
                </div>
                <div className={style.inputBox}>
                  <Button
                    disabled={loading}
                    type="submit"
                    variant="contained"
                    color="success"
                    endIcon={
                      loading ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : null
                    }
                  >
                    {loading ? "Processing " : "Participate"}
                  </Button>
                </div>
              </Form>
            </div>
          );
        }}
      </Formik>
    </div>
  );
};

export default ParticipateMatchForm;
