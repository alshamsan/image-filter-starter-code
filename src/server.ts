import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // GET /filteredimage?image_url={{URL}}
  //    endpoint to filter an image from a public url.
  // QUERY PARAMETERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file
  app.get("/filteredimage/", async (req, res, next) => {
    const { image_url } = req.query;
    // 1. validate the image_url query
    if (!image_url) {
      return res.status(400).send('image url is required');
    }

    // display feedback for received image_url
    console.log(`image URL: ${image_url}`);

    // 2. call filterImageFromURL(image_url) to filter the image
    const filteredPath = await filterImageFromURL(image_url);

    // display feedback for the absolute path to the filtered image locally saved file
    console.log(`Path to downloaded image: ${filteredPath}`);

    // 3. send the resulting file in the response
    res.status(200).sendFile(filteredPath);

    // 4. deletes any files on the server on finish of the response
    res.on('finish', () => deleteLocalFiles([filteredPath]));
  });


  // Root Endpoint
  // Displays a simple message to the user
  app.get("/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });


  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();