import { EntityRepository, Repository } from 'typeorm';

import { Publication } from './publication.entity';

@EntityRepository(Publication)
export class PublicationsRepository extends Repository<Publication> {
  async getPublications(): Promise<Publication[]> {
    const query = this.createQueryBuilder('publication');
    return await query.getMany();
  }
}
