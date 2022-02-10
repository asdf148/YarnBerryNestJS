import { HttpException, HttpStatus } from '@nestjs/common';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const multerDiskOptions = {
  fileFilter: (
    _req: any,
    file: { mimetype: string },
    callback: (arg0: HttpException, arg1: boolean) => void,
  ) => {
    if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
      callback(null, true);
    } else {
      callback(
        new HttpException(
          {
            message: 1,
            error: '지원하지 않는 이미지 형식입니다.',
          },
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }
  },
  storage: diskStorage({
    destination: (_req, _file, callback) => {
      const uploadPath = process.env.FILE_SAVE_PATH;
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath);
      }
      callback(null, uploadPath);
    },
    filename: (_req, file, callback) => {
      callback(null, `${Date.now()}${extname(file.originalname)}`);
    },
  }),
  limits: {
    fileSize: 16777216, //16MB
    files: 5,
  },
};
