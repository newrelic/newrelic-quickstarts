// NOTE: this script was created for a one-off task to update the
// logo image sizes in the repository. If we would like to automate
// this process in the future, we should convert this to typescript.

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const sharp = require('sharp');

/** The mazimum size a logo can be (width or height) */
const LOGO_MAX_SIZE = 200;

/**
 * Gets the filepath for all logos.
 */
const getQuickstartLogos = () =>
  glob.sync(path.join(__dirname, '..', 'quickstarts/**/logo.*'));

/**
 * Given a maximum image size, this will return an iterator
 * function that accepts a filepath and returns `true` if the image
 * width or height is abobe that maximum.
 */
const isImageTooBig = (max) => async (filepath) => {
  const { width, height } = await sharp(filepath).metadata();
  return width > max || height > max;
};

const getNewImageSize = async (filepath, max) => {
  const { width, height } = await sharp(filepath).metadata();

  // If it's a square, set both to the max
  if (width === height && width > max) {
    return { width: max, height: max };
  }

  // If the image is wider than it is tall, set the width to the max
  // and scale the height accordingly
  if (width > height) {
    return {
      width: max,
      height: Math.round((height * max) / width),
    };
  }

  // Otherwise, the image is taller than it is wide. Do the opposite.
  return {
    width: Math.round((width * max) / height),
    height: max,
  };
};

/**
 * Given a maximum image size, this will return an iterator
 * function that accepts a filepath and updates the image based on
 * the desired file size.
 */
const updateImageSize = (max) => async (filepath) => {
  const { width, height } = await getNewImageSize(filepath, max);
  const image = await sharp(filepath).resize(width, height);
  const { format } = await image.metadata();

  switch (format) {
    case 'jpeg':
      image.jpeg();
      break;
    case 'png':
      image.png();
      break;
    case 'webp':
      image.webp();
      break;
    default:
      console.log(`Unknown file format: ${format} (${filepath})`);
      return false;
  }

  const buffer = await image.toBuffer();

  fs.writeFileSync(filepath, buffer);

  return true;
};

const main = async () => {
  const logos = getQuickstartLogos().filter((f) => path.extname(f) !== '.svg');

  const logosToUpdate = await Promise.all(
    logos.filter(isImageTooBig(LOGO_MAX_SIZE))
  );

  logosToUpdate.forEach(updateImageSize(LOGO_MAX_SIZE));
};

main();
