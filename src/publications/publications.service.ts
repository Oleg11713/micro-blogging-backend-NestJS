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
    images: {
      file: { buffer: string | NodeJS.ArrayBufferView };
    },
  ): Promise<Publication> {
    const { title, content, userId } = publicationDto;
    let fileName = '';
    if (Object.keys(images).length !== 0) {
      fileName = await this.fileService.createFile(images);
    }
    const userIdInteger = +userId;
    const publications = await this.publicationsRepository.find();
    const publication = this.publicationsRepository.create({
      id: publications.length + 1,
      title,
      content,
      images: fileName,
      userId: userIdInteger,
    });
    await this.publicationsRepository.save(publication);
    return publication;
  }

  async getPublicationById(id: number): Promise<Publication> {
    const idInteger = +id;
    const publication = await this.publicationsRepository.findOne({
      where: { id: idInteger },
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
    newImages: {
      file: { buffer: string | NodeJS.ArrayBufferView };
    },
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
