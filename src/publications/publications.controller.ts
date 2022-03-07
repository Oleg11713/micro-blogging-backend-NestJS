import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { Publication } from './publication.entity';
import { PublicationDto } from './dto/publication.dto';
import { AuthGuard } from '@nestjs/passport';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('publications')
@UseGuards(AuthGuard())
export class PublicationsController {
  constructor(private publicationsService: PublicationsService) {}

  @Get('/viewAllPublications')
  getPublications(): Promise<Publication[]> {
    return this.publicationsService.getPublications();
  }

  @Post('/createPublication')
  @UseInterceptors(FilesInterceptor('images'))
  createPublication(
    @Body() publicationDto: PublicationDto,
    @UploadedFiles() images,
  ): Promise<Publication> {
    return this.publicationsService.createPublication(publicationDto, images);
  }

  @Get('/viewPublication/:id')
  getPublicationById(@Param('id') id: number): Promise<Publication> {
    return this.publicationsService.getPublicationById(id);
  }

  @Patch('updatePublication')
  @UseInterceptors(FilesInterceptor('newImages'))
  updatePublication(
    @Body() publicationDto: PublicationDto,
    @Body() images,
    @UploadedFiles() newImages,
  ): Promise<Publication> {
    const { id, title, content } = publicationDto;

    return this.publicationsService.updatePublication(
      id,
      title,
      content,
      images,
      newImages,
    );
  }

  @Delete('deletePublication/:id')
  deletePublication(@Param('id') id: number) {
    return this.publicationsService.deletePublication(id);
  }
}
