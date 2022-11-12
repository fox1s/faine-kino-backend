const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    // '/files' это директория в которую будут сохранятся файлы
    //   TODO винести в
    cb(null, '../movieDB/');
  },
  filename: (req: any, file: any, cb: any) => {
    const { originalname } = file;

    const nameOfMovie = req.movie?.name.split(' ').join('-').toLowerCase();
    const splittedOriginalName = originalname.split('.');
    const extension = splittedOriginalName[splittedOriginalName.length - 1];
    const movieVideoName = `${nameOfMovie}.${extension}`;
    req.movie.path = movieVideoName;

    cb(null, movieVideoName);
  }
});

export const movieUpload = multer({ storage });
