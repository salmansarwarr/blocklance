import { Image } from "../models/Image";
import path from 'path';


// POST route to upload an image
app.post('/upload', upload.single('image'), async (req, res) => {
    if (!req.file) {
      return res.status(400).send('No image file uploaded');
    }
  
    const image = new Image({
      filename: req.file.filename,
      path: req.file.path
    });
  
    console.log(image);
    try {
      await image.save();
  
      res.status(200).send('Image uploaded and saved successfully');
    } catch (error) {
      res.status(500).send('Error saving image to the database');
    }
});

// GET route to retrieve an image by its filename
app.get("/images/:filename", (req, res) => {
    const { filename } = req.params;
    res.sendFile(path.join(__dirname, "images", filename));
});

// GET route to retrieve all images
app.get("/images", async (req, res) => {
    try {
      const images = await Image.find();
      res.json(images);
    } catch (error) {
      console.error('Error retrieving images:', error);
      res.status(500).json({ error: 'Error retrieving images' });
    }
});

// GET route to retrieve an image by its ID
app.get("/image/:id", async (req, res) => {
    const { id } = req.params;
    try {
      const image = await Image.findById(id);
      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }
      res.json(image);
    } catch (error) {
      console.error('Error retrieving image by ID:', error);
      res.status(500).json({ error: 'Error retrieving image by ID' });
    }
});
