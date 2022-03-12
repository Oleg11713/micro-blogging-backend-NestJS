import { EntityRepository, Repository } from 'typeorm';

import { Comment } from './comment.entity';
import { CommentDto } from './dto/comment.dto';

@EntityRepository(Comment)
export class CommentsRepository extends Repository<Comment> {
  async getComments(): Promise<Comment[]> {
    return await this.find();
  }

  async createComment(commentDto: CommentDto): Promise<Comment> {
    const { content, userId, publicationId } = commentDto;
    const userIdInteger = +userId;
    const publicationIdInteger = +publicationId;
    const comments = await this.find();
    const comment = this.create({
      id: comments.length + 1,
      content,
      userId: userIdInteger,
      publicationId: publicationIdInteger,
    });
    await this.save(comment);
    return comment;
  }
}
