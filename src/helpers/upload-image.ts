const multer = require('multer');

let counter = 1;

const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    // '/files' это директория в которую будут сохранятся файлы
    console.log(`../imageDB/${req.movie?._id}`);
    cb(null, `../imageDB/${req.movie?._id}`);
  },
  filename: (req: any, file: any, cb: any) => {
    const { originalname } = file;
    console.log(originalname);
    // const movieName = req.movie?.name.split(' ').join('-').toLowerCase();
    const splittedOriginalName = originalname.split('.');
    const extension = splittedOriginalName[splittedOriginalName.length - 1];
    console.log(counter);
    const imageName = `${req.movie._id}_${counter}.${extension}`;
    counter ++;
    console.log(counter);
    req.movie.imagePaths = Array.isArray(req.movie.imagePaths)
      ? req.movie.imagePaths
      : [];
    req.movie.imagePaths.push(imageName);
    console.log( req.movie.imagePaths);
    cb(null, imageName);
  }
});

export const imageUpload = multer({ storage });
