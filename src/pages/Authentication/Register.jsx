import {
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  FormLabel,
  Typography,
  Box
} from '@mui/material';
import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as Yup from "yup";
import { requestOtpAction, verifyOtpAndRegisterAction } from '../Redux/Auth/auth.action';

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
  
  // Connect to global Redux state to display dynamic loading indicators
  const { loading } = useSelector((state) => state.auth || state);

  // Layout Step Tracker: 1 = Form Input Details, 2 = 6-Digit OTP Box Entry
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [savedEmail, setSavedEmail] = useState("");

  // Step 1: Submit Formik Profile data to get email verification code
  const handleFormikSubmit = (values) => {
    setSavedEmail(values.email); // Temporarily track user email parameter for Step 2
    dispatch(requestOtpAction(values, setStep));
  };

  // Step 2: Deliver 6-digit key token payload matching destination user email 
  const handleOtpVerifySubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit code.");
      return;
    }
    dispatch(verifyOtpAndRegisterAction({ email: savedEmail, otp, navigate }));
  };

  return (
    <Box sx={{ maxWidth: 450, margin: "0 auto", padding: 2 }}>
      {step === 1 ? (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormikSubmit}
        >
          {({
            values,
            handleChange,
            handleBlur,
            errors,
            touched
          }) => (
            <Form className="space-y-5">
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                Create Account
              </Typography>

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
                disabled={loading}
                sx={{ padding: ".8rem 0rem" }}
              >
                {loading ? "Sending OTP..." : "Get Verification Code"}
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        // Step 2 panel: Triggers once requestOtpAction fires setStep(2)
        <Box component="form" onSubmit={handleOtpVerifySubmit} className="space-y-5">
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            Verify Identity
          </Typography>
          
          <Typography variant="body2" color="textSecondary">
            A secure 6-digit validation code was sent to: <strong>{savedEmail}</strong>
          </Typography>

          <TextField
            label="6-Digit OTP Code"
            fullWidth
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Numbers only validation
            inputProps={{ maxLength: 6 }}
            placeholder="000000"
            required
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            color="success"
            disabled={loading}
            sx={{ padding: ".8rem 0rem" }}
          >
            {loading ? "Verifying..." : "Verify & Create Account"}
          </Button>

          <Button
            fullWidth
            variant="text"
            onClick={() => setStep(1)}
            disabled={loading}
          >
            ← Back to Profile Form
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Register;
