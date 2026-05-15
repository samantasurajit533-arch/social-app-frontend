import {
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  TextField,
  FormLabel,
  Typography,
  Box,
  CircularProgress
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
  
  // Get loading state from Redux to disable buttons during API calls
  const { loading } = useSelector((state) => state.auth);

  // UI State: step 1 is Details, step 2 is OTP Input
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [savedEmail, setSavedEmail] = useState("");

  // Step 1: Submit Details to trigger OTP Email
  const handleFormikSubmit = (values) => {
    setSavedEmail(values.email); 
    dispatch(requestOtpAction(values, setStep));
  };

  // Step 2: Submit OTP for Final Registration
  const handleOtpVerifySubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit code.");
      return;
    }
    dispatch(verifyOtpAndRegisterAction({ email: savedEmail, otp, navigate }));
  };

  return (
    <Box sx={{ maxWidth: 450, margin: "2rem auto", padding: 3, boxShadow: 3, borderRadius: 2 }}>
      {step === 1 ? (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleFormikSubmit}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form className="space-y-5">
              <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
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

              <Box>
                <FormLabel>Gender</FormLabel>
                <RadioGroup row name="gender" value={values.gender} onChange={handleChange}>
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                </RadioGroup>
                {touched.gender && errors.gender && (
                  <Typography color="error" variant="caption">{errors.gender}</Typography>
                )}
              </Box>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{ padding: ".8rem 0rem", mt: 2 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Get Verification Code"}
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        <Box component="form" onSubmit={handleOtpVerifySubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Typography variant="h5" fontWeight="bold" align="center">
            Verify Email
          </Typography>
          
          <Typography variant="body2" color="textSecondary" align="center">
            Enter the 6-digit code sent to: <br/> <strong>{savedEmail}</strong>
          </Typography>

          <TextField
            label="6-Digit OTP"
            fullWidth
            variant="outlined"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            inputProps={{ maxLength: 6, style: { textAlign: 'center', letterSpacing: '10px', fontSize: '1.5rem' } }}
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
            ← Back to Details
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Register;
