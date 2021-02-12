import * as yup from 'yup'

const createUser = yup
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

const createUserFirebase = yup
  .object()
  .shape({
    email: yup.string().required('Email wajib diisi'),
    newPassword: yup
      .string()
      .min(8, 'Minimal 8 karakter')
      .oneOf([yup.ref('confirmNewPassword')], 'Password tidak sama')
      .required(),
    confirmNewPassword: yup
      .string()
      .min(8, 'Minimal 8 karakter')
      .oneOf([yup.ref('newPassword')], 'Password tidak sama')
      .required(),
  })
  .required()

export default {
  createUser,
  createUserFirebase,
}
