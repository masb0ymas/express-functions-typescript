import * as yup from 'yup'

const signUp = yup
  .object()
  .shape({
    fullName: yup.string().required('Nama lengkap wajib diisi'),
    email: yup.string().required('Email wajib diisi'),
    newPassword: yup
      .string()
      .min(8, 'Minimal 8 karakter')
      .oneOf([yup.ref('confirmNewPassword')], 'Password tidak sama'),
    confirmNewPassword: yup
      .string()
      .min(8, 'Minimal 8 karakter')
      .oneOf([yup.ref('newPassword')], 'Password tidak sama'),
    role: yup.string().required('Role wajib diisi'),
    picturePath: yup.string().nullable(),
    createdAt: yup.date().nullable(),
    updatedAt: yup.date().nullable(),
  })
  .required()

const webLogin = yup
  .object()
  .shape({
    email: yup.string().required('Email wajib diisi'),
    password: yup.string().required('Password wajib diisi'),
    createdAt: yup.date().nullable(),
    updatedAt: yup.date().nullable(),
  })
  .required()

const mobileLogin = yup
  .object()
  .shape({
    email: yup.string().required('Email wajib diisi'),
    password: yup.string().required('Password wajib diisi'),
    deviceToken: yup.string().required('Device Token wajib diisi'),
    createdAt: yup.date().nullable(),
    updatedAt: yup.date().nullable(),
  })
  .required()

export default { signUp, webLogin, mobileLogin }
