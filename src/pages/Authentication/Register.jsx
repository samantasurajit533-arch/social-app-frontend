import {
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  FormLabel
} from '@mui/material';
import { Formik, Form } from 'formik';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import { registerUserAction } from '../Redux/Auth/auth.action';

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  gender: ""
};

const validationSchema = Yup.object({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  email: Yup.string()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  gender: Yup.string().required("Gender is required"),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
const handleSubmit = (values) => {
  dispatch(registerUserAction({ data: values, navigate }));
};

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          values,
          handleChange,
          handleBlur,
          errors,
          touched
        }) => (
          <Form className="space-y-5">

            <TextField
              name="firstName"
              label="First Name"
              fullWidth
              value={values.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.firstName && Boolean(errors.firstName)}
              helperText={touched.firstName && errors.firstName}
            />

            <TextField
              name="lastName"
              label="Last Name"
              fullWidth
              value={values.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.lastName && Boolean(errors.lastName)}
              helperText={touched.lastName && errors.lastName}
            />

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
            />

            <div>
              <FormLabel>Gender</FormLabel>
              <RadioGroup
                row
                name="gender"
                value={values.gender}
                onChange={handleChange}
              >
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="male" control={<Radio />} label="Male" />
              </RadioGroup>
              {touched.gender && errors.gender && (
                <div className="text-red-500 text-sm">{errors.gender}</div>
              )}
            </div>

            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{ padding: ".8rem 0rem" }}
            >
              Register
            </Button>

          </Form>
        )}
      </Formik>
    </>
  );
};

export default Register;