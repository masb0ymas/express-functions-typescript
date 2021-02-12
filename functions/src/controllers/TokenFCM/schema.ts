import * as yup from 'yup'

const create = yup
  .object()
  .shape({
    UserId: yup.string().required('User Id wajib diisi'),
    deviceToken: yup.string().required('Device Token wajib diisi'),
    createdAt: yup.date().nullable(),
    updatedAt: yup.date().nullable(),
  })
  .required()

export default {
  create,
}
