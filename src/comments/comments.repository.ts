import { EntityRepository, Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CommentDto } from './dto/comment.dto';

@EntityRepository(Comment)
export class CommentsRepository extends Repository<Comment> {
  async getComments(): Promise<Comment[]> {
    const query = this.createQueryBuilder('comment');
    return await query.getMany();
  }

  async createComment(commentDto: CommentDto): Promise<Comment> {
    const { content, userId, publicationId } = commentDto;
    const comment = this.create({ content, userId, publicationId });
    await this.save(comment);
    return comment;
  }
}
