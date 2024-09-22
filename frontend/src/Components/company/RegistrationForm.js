import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import { useState } from 'react';
import '../../css/companyForm.css';

const SignupForm = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const initialValues = {
    companyId: '',
    companyName: '',
    service: '',
    email: '',
    phoneNo: '',
    address: '',
    password: '',
    companyLogo: null // Initialize as null
  };

  const validationSchema = Yup.object().shape({
    companyId: Yup.string().required('Company ID is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    companyName: Yup.string().required('Company name is required'),
    service: Yup.string().required('Service is required'),
    address: Yup.string().required('Address is required'),
    phoneNo: Yup.string().required('Phone number is required'),
    password: Yup.string()
      .required('Password is required')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,15}$/,
        'Password must be 8 to 15 characters long and include at least one alphabet, one number, and one special character'
      ),
    companyLogo: Yup.mixed().required('Image is required').test(
      'fileSize',
      'File too large',
      value => value && value.size <= 2000000 // 2MB max size
    ).test(
      'fileType',
      'Unsupported File Format',
      value => value && ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(value.type)
    )
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const formData = new FormData();
    Object.keys(values).forEach(key => {
      formData.append(key, values[key]);
    });

    setIsLoading(true); // Start loading

    try {
      const response = await axios.post('http://localhost:3001/api/companySignup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log(response.data);
      setMessage(response.data.message);
      resetForm();
    } catch (error) {
      
      setMessage(error.response.data.message);
      console.error(error);
    } finally {
      setIsLoading(false); // End loading
      setSubmitting(false);
    }
  };

  return (
    <section className="py-1 bg-blueGray-50">
      <div className="w-full lg:w-8/12 px-4 mx-auto mt-6">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
          <div className="rounded-t bg-white mb-0 px-6 py-6">
            <div className="text-center flex justify-between">
              <h6 className="text-blueGray-700 text-xl font-bold">
                My account
              </h6>
            </div>
          </div>
          <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
            {message && (
              <div className="message-container bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">
                <span>{message}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setMessage('')}>
                  <svg className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.354 5.354a2 2 0 0 0-2.828 0L10 7.172 7.172 4.354a2 2 0 1 0-2.828 2.828L7.172 10l-2.828 2.828a2 2 0 1 0 2.828 2.828L10 12.828l2.828 2.828a2 2 0 1 0 2.828-2.828L12.828 10l2.828-2.828a2 2 0 0 0 0-2.818l.002-.002z"/></svg>
                </span>
              </div>
            )}
            {isLoading && (
              <div className="loading-overlay">
                <div className="loading-spinner"></div>
              </div>
            )}
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, isSubmitting }) => (
                <Form>
                  <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                    User Information
                  </h6>
                  <div className="flex flex-wrap">
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="companyId">
                          Company ID
                        </label>
                        <Field type="text" name="companyId" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                        <ErrorMessage name="companyId" component="div" className="text-red-500" />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="companyName">
                          Company Name
                        </label>
                        <Field type="text" name="companyName" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                        <ErrorMessage name="companyName" component="div" className="text-red-500" />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="service">
                          Service
                        </label>
                        <Field type="text" name="service" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                        <ErrorMessage name="service" component="div" className="text-red-500" />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="phoneNo">
                          Phone No
                        </label>
                        <Field type="text" name="phoneNo" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                        <ErrorMessage name="phoneNo" component="div" className="text-red-500" />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="email">
                          Email
                        </label>
                        <Field type="text" name="email" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                        <ErrorMessage name="email" component="div" className="text-red-500" />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="password">
                          Password
                        </label>
                        <Field type="password" name="password" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                        <ErrorMessage name="password" component="div" className="text-red-500" />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="companyLogo">
                          Company Logo
                        </label>
                        <input type="file" name="companyLogo" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" onChange={(event) => {
                          setFieldValue("companyLogo", event.currentTarget.files[0]);
                        }} />
                        <ErrorMessage name="companyLogo" component="div" className="text-red-500" />
                      </div>
                    </div>
                    <div className="w-full lg:w-6/12 px-4">
                      <div className="relative w-full mb-3">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="address">
                          Address
                        </label>
                        <Field type="text" name="address" className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" />
                        <ErrorMessage name="address" component="div" className="text-red-500" />
                      </div>
                    </div>
                  </div>
                  <button type="submit" className="bg-pink-500 text-white active:bg-pink-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" disabled={isSubmitting}>
                    Submit
                  </button>
                </Form>
              )}
            </Formik>
            <p className="mt-6 text-xs text-gray-600 text-center">
             Already have an Account ?
              <Link to="/companyLogin" className="border-b border-gray-500 border-dotted"> Signin </Link>
              
              
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignupForm;
