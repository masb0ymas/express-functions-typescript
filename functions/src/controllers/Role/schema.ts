import * as yup from 'yup'

const create = yup
  .object()
  .shape({
    name: yup.string().required('Nama role wajib diisi'),
    createdAt: yup.date().nullable(),
    updatedAt: yup.date().nullable(),
  })
  .required()

export default {
  create,
}
