import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PublicationsRepository } from './publications.repository';
import { Publication } from './publication.entity';
import { PublicationDto } from './dto/publication.dto';
import { FilesService } from '../files/file.service';

@Injectable()
export class PublicationsService {
  constructor(
    @InjectRepository(PublicationsRepository)
    private publicationsRepository: PublicationsRepository,
    private fileService: FilesService,
  ) {}
  getPublications(): Promise<Publication[]> {
    return this.publicationsRepository.getPublications();
  }

  async createPublication(
    publicationDto: PublicationDto,
    images: object,
  ): Promise<Publication> {
    const { title, content, userId } = publicationDto;
    let fileName = '';
    if (Object.keys(images).length !== 0) {
      fileName = await this.fileService.createFile(images);
    }
    const publication = this.publicationsRepository.create({
      title,
      content,
      images: fileName,
      userId,
    });
    await this.publicationsRepository.save(publication);
    return publication;
  }

  async getPublicationById(id: number): Promise<Publication> {
    const publication = await this.publicationsRepository.findOne({
      where: { id },
    });
    if (!publication) {
      throw new NotFoundException('Такой публикации не существует');
    }
    return publication;
  }

  async updatePublication(
    id: number,
    title: string,
    content: string,
    images: { images: string },
    newImages: object,
  ): Promise<Publication> {
    const publication = await this.getPublicationById(id);
    if (!publication) {
      throw new NotFoundException('Такой публикации не существует');
    }
    let fileName = '';
    if (newImages) {
      fileName =
        (await this.fileService.createFile(newImages)) + ',' + images.images;
    }
    publication.title = title;
    publication.content = content;
    publication.images = fileName;
    await this.publicationsRepository.save(publication);
    return publication;
  }

  async deletePublication(id: number): Promise<void> {
    const deletedPublication = await this.publicationsRepository.delete({ id });
    if (deletedPublication.affected === 0) {
      throw new NotFoundException(`Такой публикации не существует`);
    }
  }
}
