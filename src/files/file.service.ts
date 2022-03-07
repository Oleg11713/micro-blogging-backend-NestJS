import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as uuid from 'uuid';

@Injectable()
export class FilesService {
  async createFile(files): Promise<string> {
    try {
      const fileNames: string[] = [];
      if (Array.isArray(files)) {
        files.map((file) => {
          const fileName = uuid.v4() + '.jpg';
          const filePath = path.resolve(__dirname, '..', 'static');
          if (!fs.existsSync(filePath)) {
            fs.mkdirSync(filePath, { recursive: true });
          }
          fs.writeFileSync(path.join(filePath, fileName), file.buffer);
          fileNames.push(fileName);
        });
      } else {
        const fileName = uuid.v4() + '.jpg';
        const filePath = path.resolve(__dirname, '..', 'static');
        if (!fs.existsSync(filePath)) {
          fs.mkdirSync(filePath, { recursive: true });
        }
        fs.writeFileSync(path.join(filePath, fileName), files.buffer);
        fileNames[0] = fileName;
      }
      return fileNames.join(',');
    } catch (e) {
      throw new HttpException(
        'Произошла ошибка при записи файла',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
