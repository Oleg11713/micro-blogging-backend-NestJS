import { IsNotEmpty, IsString } from 'class-validator';

export class PublicationDto {
  @IsNotEmpty()
  id?: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  images?:
    | { mv: (arg0: string) => object }[]
    | { mv: (arg0: string) => object };

  @IsNotEmpty()
  userId?: number;
}
