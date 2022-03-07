import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { Comment } from './comment.entity';
import { CommentDto } from './dto/comment.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('comments')
@UseGuards(AuthGuard())
export class CommentsController {
  constructor(private commentsService: CommentsService) {}
  @Get('viewAllComments')
  getComments(): Promise<Comment[]> {
    return this.commentsService.getComments();
  }

  @Post('createComment')
  createComment(@Body() commentDto: CommentDto): Promise<Comment> {
    return this.commentsService.createComment(commentDto);
  }

  @Get('viewComment/:id')
  getCommentById(@Param('id') id: number): Promise<Comment> {
    return this.commentsService.getCommentById(id);
  }

  @Patch('updateComment')
  updateComment(@Body() commentDto: CommentDto): Promise<Comment> {
    const { id, content } = commentDto;
    return this.commentsService.updateComment(id, content);
  }

  @Delete('deleteComment/:id')
  deleteComment(@Param('id') id: number): Promise<void> {
    return this.commentsService.deleteComment(id);
  }
}
