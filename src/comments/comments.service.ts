import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CommentsRepository } from './comments.repository';
import { Comment } from './comment.entity';
import { CommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentsRepository)
    private commentsRepository: CommentsRepository,
  ) {}

  getComments(): Promise<Comment[]> {
    return this.commentsRepository.getComments();
  }

  createComment(commentDto: CommentDto): Promise<Comment> {
    return this.commentsRepository.createComment(commentDto);
  }

  async getCommentById(id: number): Promise<Comment> {
    const idInteger = +id;
    const comment = await this.commentsRepository.findOne({
      where: { id: idInteger },
    });
    if (!comment) {
      throw new NotFoundException('Такого комментария не существует');
    }
    return comment;
  }

  async updateComment(id: number, content: string): Promise<Comment> {
    const comment = await this.getCommentById(id);
    if (!comment) {
      throw new NotFoundException('Такого комментария не существует');
    }
    comment.content = content;
    await this.commentsRepository.save(comment);
    return comment;
  }

  async deleteComment(id: number): Promise<void> {
    const deletedComment = await this.commentsRepository.delete({ id });
    if (deletedComment.affected === 0) {
      throw new NotFoundException(`Такого комментария не существует`);
    }
  }
}
