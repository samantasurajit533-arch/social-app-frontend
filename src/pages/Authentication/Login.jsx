import { Button, TextField, Box, Typography } from '@mui/material';
import { Formik, Form } from 'formik';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import { loginUserAction } from '../Redux/Auth/auth.action';

const initialValues = {
  email: "",
  password: ""
};

const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // safer selector (prevents crash if state shape changes)
  const loading = useSelector((state) => state.auth?.loading);

  const handleSubmit = (values) => {

    dispatch(
      loginUserAction({
        data: values,
        navigate
      })
    );
  };

  return (
    <Box sx={{ maxWidth: 450, margin: "0 auto", padding: 2 }}>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >

        {({ values, handleChange, handleBlur, errors, touched }) => (

          <Form>

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Login
            </Typography>

            <TextField
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              margin="normal"
            />

            <TextField
              name="password"
              label="Password"
              type="password"
              fullWidth
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && Boolean(errors.password)}
              helperText={touched.password && errors.password}
              margin="normal"
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ mt: 2, py: 1.2 }}
            >
              {loading ? "Authenticating..." : "Login"}
            </Button>

          </Form>
        )}

      </Formik>
    </Box>
  );
};

export default Login;