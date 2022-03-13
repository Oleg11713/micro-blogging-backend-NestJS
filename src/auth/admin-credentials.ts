import * as uuid from 'uuid';
import { ADMIN_ROLE } from '../utils/constsRoles';

export const ADMIN = {
  id: 1,
  displayName: 'Олег Овчинский',
  age: '19',
  email: 'admin@mail.ru',
  password: 'admin12345',
  role: ADMIN_ROLE,
  isActivated: true,
  activationLink: uuid.v4(),
};
