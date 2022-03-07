import * as uuid from 'uuid';

export const ADMIN = {
  displayName: 'Олег Овчинский',
  age: '19',
  email: 'admin@mail.ru',
  password: 'admin12345',
  role: 'ADMIN',
  isActivated: true,
  activationLink: uuid.v4(),
};
