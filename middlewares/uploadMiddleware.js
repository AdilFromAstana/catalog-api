const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

// Папка для загрузки (вне проекта)
const uploadPath = path.resolve(__dirname, "../../uploads/items");

// Функция генерации уникального имени файла
const generateFileName = (originalName) => {
  const extension = path.extname(originalName);
  return `${uuidv4()}${extension}`;
};

// Конфигурируем `multer`
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, generateFileName(file.originalname));
  },
});

const upload = multer({ storage });

module.exports = upload;
