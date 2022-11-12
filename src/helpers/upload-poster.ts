import { IRequestExtended } from 'src/models';

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req: IRequestExtended, file: any, cb: any) => {
    // '/files' это директория в которую будут сохранятся файлы
    cb(null, `../imageDB/${req.movie?._id}`);
  },
  filename: (req: any, file: any, cb: any) => {
    const { originalname } = file;

    // const movieName = req.movie?.name.split(' ').join('-').toLowerCase();
    const splittedOriginalName = originalname.split('.');
    const extension = splittedOriginalName[splittedOriginalName.length - 1];
    const posterName = `${req.movie._id}_poster.${extension}`;

    req.movie.posterPath = posterName;

    cb(null, posterName);
  }
});

export const posterUpload = multer({ storage });
