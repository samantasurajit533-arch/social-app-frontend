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
import React, { useState, useEffect } from 'react';
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
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Min 6 chars").required("Required"),
  gender: Yup.string().required("Required"),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Ensure we select 'auth' correctly from the root reducer
  const auth = useSelector((state) => state.auth);
  const loading = auth?.loading;

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [savedEmail, setSavedEmail] = useState("");
  const [timer, setTimer] = useState(0);

  // Countdown timer for Resend OTP
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle Step 1: Submit Profile Details
  const handleFormikSubmit = (values, { setSubmitting }) => {
    setSavedEmail(values.email); 
    dispatch(requestOtpAction(values, setStep));
    setTimer(30); // Starts 30s cooldown
    setSubmitting(false);
  };

  // Handle Step 2: Verify 6-Digit OTP
  const handleOtpVerifySubmit = (e) => {
    e.preventDefault(); // CRITICAL: Prevents page reload
    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit code.");
      return;
    }
    dispatch(verifyOtpAndRegisterAction({ email: savedEmail, otp, navigate }));
  };

  const handleResendOtp = () => {
    if (timer === 0) {
      dispatch(requestOtpAction({ email: savedEmail }, setStep));
      setTimer(30);
    }
  };

  return (
    <Box sx={{ maxWidth: 450, margin: "2rem auto", padding: 3, boxShadow: 3, borderRadius: 2, bgcolor: "background.paper" }}>
      {step === 1 ? (
        <Formik 
          initialValues={initialValues} 
          validationSchema={validationSchema} 
          onSubmit={handleFormikSubmit}
        >
          {({ values, handleChange, handleBlur, errors, touched, handleSubmit }) => (
            <Form onSubmit={handleSubmit} className="space-y-5">
              <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
                Create Account
              </Typography>

              <TextField name="firstName" label="First Name" fullWidth value={values.firstName} onChange={handleChange} onBlur={handleBlur} error={touched.firstName && !!errors.firstName} helperText={touched.firstName && errors.firstName} />
              <TextField name="lastName" label="Last Name" fullWidth value={values.lastName} onChange={handleChange} onBlur={handleBlur} error={touched.lastName && !!errors.lastName} helperText={touched.lastName && errors.lastName} />
              <TextField name="email" label="Email" fullWidth value={values.email} onChange={handleChange} onBlur={handleBlur} error={touched.email && !!errors.email} helperText={touched.email && errors.email} />
              <TextField name="password" label="Password" type="password" fullWidth value={values.password} onChange={handleChange} onBlur={handleBlur} error={touched.password && !!errors.password} helperText={touched.password && errors.password} />

              <Box>
                <FormLabel>Gender</FormLabel>
                <RadioGroup row name="gender" value={values.gender} onChange={handleChange}>
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                </RadioGroup>
                {touched.gender && errors.gender && <Typography color="error" variant="caption">{errors.gender}</Typography>}
              </Box>

              <Button fullWidth type="submit" variant="contained" disabled={loading} sx={{ py: 1.5 }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : "Get Verification Code"}
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        <Box component="form" onSubmit={handleOtpVerifySubmit} className="space-y-5">
          <Typography variant="h5" fontWeight="bold" align="center">Verify Email</Typography>
          <Typography align="center" color="textSecondary">
            Code sent to: <strong>{savedEmail}</strong>
          </Typography>

          <TextField 
            label="6-Digit OTP" 
            fullWidth 
            value={otp} 
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} 
            inputProps={{ maxLength: 6, style: { textAlign: 'center', fontSize: '1.2rem', letterSpacing: '5px' } }} 
            required 
          />

          <Button fullWidth type="submit" variant="contained" color="success" disabled={loading} sx={{ py: 1.5 }}>
            {loading ? "Verifying..." : "Verify & Create Account"}
          </Button>

          <Box textAlign="center">
            {timer > 0 ? (
              <Typography variant="caption" color="textSecondary">Resend code in {timer}s</Typography>
            ) : (
              <Button size="small" onClick={handleResendOtp} disabled={loading}>Resend OTP</Button>
            )}
          </Box>

          <Button fullWidth variant="text" onClick={() => setStep(1)} disabled={loading}>
            ← Back to Profile
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Register;
