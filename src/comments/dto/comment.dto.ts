import { IsNotEmpty, IsString } from 'class-validator';

export class CommentDto {
  @IsNotEmpty()
  id?: number;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  userId?: number;

  @IsNotEmpty()
  publicationId?: number;
}
