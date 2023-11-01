import * as fs from 'fs';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { HttpException, HttpStatus } from '@nestjs/common';

export const getStorage = (path: string = './public/uploads') => {
  return diskStorage({
    destination: function (req, file, cb) {
      if (!fs.existsSync(`./public/uploads/${path}`)) {
        fs.mkdirSync(`./public/uploads/${path}`, { recursive: true });
      }
      cb(null, `./public/uploads/${path}`);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
    },
  });
};

export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(
      new HttpException(
        `Unsupported file type${extname(file.originalname)}`,
        HttpStatus.BAD_REQUEST,
      ),
      false,
    );
  }
  if (file.originalname.length > 50) {
    return callback(
      new HttpException('File name to long', HttpStatus.BAD_REQUEST),
      false,
    );
  }
  callback(null, true);
};

export const unlinkFile = (path: string) => {
  return fs.unlinkSync(path);
};

export const unlinkFileAsync = (path) =>
  new Promise((resolve, reject) => {
    if (path) {
      resolve(fs.unlinkSync(path));
    }
    reject;
  });
