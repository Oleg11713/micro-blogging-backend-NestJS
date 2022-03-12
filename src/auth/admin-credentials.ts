import * as uuid from 'uuid';
import { ADMIN_ROLE, START_ID } from '../utils/constsRoles';

export const ADMIN = {
  id: START_ID,
  displayName: 'Олег Овчинский',
  age: '19',
  email: 'admin@mail.ru',
  password: 'admin12345',
  role: ADMIN_ROLE,
  isActivated: true,
  activationLink: uuid.v4(),
};
