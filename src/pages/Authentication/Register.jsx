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

const initialValues = { firstName: "", lastName: "", email: "", password: "", gender: "" };

const validationSchema = Yup.object({
  firstName: Yup.string().required("Required"),
  lastName: Yup.string().required("Required"),
  email: Yup.string().email("Invalid").required("Required"),
  password: Yup.string().min(6, "Min 6 chars").required("Required"),
  gender: Yup.string().required("Required"),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [savedEmail, setSavedEmail] = useState("");
  const [timer, setTimer] = useState(0); // Resend টাইমার

  // টাইমার লজিক
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleFormikSubmit = (values) => {
    setSavedEmail(values.email); 
    dispatch(requestOtpAction(values, setStep));
    setTimer(30); // ৩০ সেকেন্ড সেট করুন
  };

  const handleResendOtp = () => {
    if (timer === 0) {
      dispatch(requestOtpAction({ email: savedEmail }, setStep));
      setTimer(30);
    }
  };

  const handleOtpVerifySubmit = (e) => {
    e.preventDefault();
    dispatch(verifyOtpAndRegisterAction({ email: savedEmail, otp, navigate }));
  };

  return (
    <Box sx={{ maxWidth: 450, margin: "2rem auto", padding: 3, boxShadow: 3, borderRadius: 2 }}>
      {step === 1 ? (
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleFormikSubmit}>
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form className="space-y-5">
              <Typography variant="h5" fontWeight="bold" align="center">Create Account</Typography>
              <TextField name="firstName" label="First Name" fullWidth onChange={handleChange} value={values.firstName} error={touched.firstName && !!errors.firstName} />
              <TextField name="lastName" label="Last Name" fullWidth onChange={handleChange} value={values.lastName} error={touched.lastName && !!errors.lastName} />
              <TextField name="email" label="Email" fullWidth onChange={handleChange} value={values.email} error={touched.email && !!errors.email} />
              <TextField name="password" label="Password" type="password" fullWidth onChange={handleChange} value={values.password} error={touched.password && !!errors.password} />
              <Box>
                <FormLabel>Gender</FormLabel>
                <RadioGroup row name="gender" value={values.gender} onChange={handleChange}>
                  <FormControlLabel value="female" control={<Radio />} label="Female" />
                  <FormControlLabel value="male" control={<Radio />} label="Male" />
                </RadioGroup>
              </Box>
              <Button fullWidth type="submit" variant="contained" disabled={loading}>
                {loading ? <CircularProgress size={24} color="inherit" /> : "Get Verification Code"}
              </Button>
            </Form>
          )}
        </Formik>
      ) : (
        <Box component="form" onSubmit={handleOtpVerifySubmit} className="space-y-5">
          <Typography variant="h5" fontWeight="bold" align="center">Verify Email</Typography>
          <Typography align="center">Code sent to: <strong>{savedEmail}</strong></Typography>
          <TextField label="6-Digit OTP" fullWidth value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} inputProps={{ maxLength: 6 }} required />
          <Button fullWidth type="submit" variant="contained" color="success" disabled={loading}>
            {loading ? "Verifying..." : "Verify Account"}
          </Button>
          <Typography align="center">
            {timer > 0 ? `Resend OTP in ${timer}s` : <Button onClick={handleResendOtp}>Resend OTP</Button>}
          </Typography>
          <Button fullWidth variant="text" onClick={() => setStep(1)}>← Back</Button>
        </Box>
      )}
    </Box>
  );
};

export default Register;
