const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const authenticate = require('../middlewares/authMiddleware');
const Media = require('../models/media'); // Modelo de mídia (pode ser foto ou vídeo)
const User = require('../models/user'); // Modelo de usuários

const router = express.Router();

// Configuração do Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configuração do Multer com Cloudinary para fotos e vídeos
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const folder = 'media_uploads';
    let resourceType = 'image'; // Padrão para imagem

    if (file.mimetype.startsWith('video')) {
      resourceType = 'video'; // Muda para vídeo se o arquivo for do tipo vídeo
    }

    return {
      folder: folder,
      resource_type: resourceType,
      public_id: `${file.fieldname}-${Date.now()}`,
    };
  },
});

// Configurar Multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // Limite de 50MB
});

// Rota para upload de fotos ou vídeos
router.post('/upload', authenticate, upload.single('media'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado' });
    }

    // Determina o tipo de mídia
    const mediaType = req.file.mimetype.startsWith('image') ? 'foto' : 'vídeo';

    // Salvar no banco de dados
    const newMedia = await Media.create({
      userId: req.user.id,
      mediaUrl: req.file.path, // URL do Cloudinary
      description: req.body.description || '',
      title: req.body.title || `${mediaType} enviada`,
      mediaType, // Adiciona o tipo de mídia ao banco de dados
    });

    res.status(201).json({
      message: `${mediaType.charAt(0).toUpperCase() + mediaType.slice(1)} enviada com sucesso`,
      media: newMedia,
    });
  } catch (error) {
    console.error('Erro ao enviar a mídia:', error);
    res.status(500).json({ error: 'Erro ao enviar a mídia' });
  }
});

// Rota para listar fotos e vídeos com o nome do usuário que enviou
router.get('/', authenticate, async (req, res) => {
  try {
    const media = await Media.findAll({
      include: [
        {
          model: User,
          attributes: ['username'], // Apenas o nome do usuário
        },
      ],
    });

    res.status(200).json(media);
  } catch (error) {
    console.error('Erro ao listar as mídias:', error);
    res.status(500).json({ error: 'Erro ao listar as mídias' });
  }
});

module.exports = router;
