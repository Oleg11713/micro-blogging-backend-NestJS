import {
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AuthCredentialsDto {
  id: number;

  @IsString()
  @MinLength(4)
  @MaxLength(20)
  @IsNotEmpty()
  displayName: string;

  @IsNotEmpty()
  age: string;

  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Пароль слишком лёгкий',
  })
  @IsNotEmpty()
  password: string;

  role: string;
  isActivated: boolean;
  activationLink: string;
}
