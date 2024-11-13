const cloudinary = require('cloudinary').v2;

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Tente carregar uma imagem de teste (use uma URL pública para testar)
cloudinary.uploader.upload('https://res.cloudinary.com/demo/image/upload/sample.jpg', 
  function(error, result) { 
    console.log(result, error); 
});