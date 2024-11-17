import { Cloudinary } from '@cloudinary/url-gen';

export const cloudinary = new Cloudinary({
  cloud: {
    cloudName: 'your-cloud-name',
  },
  url: {
    secure: true, // force https, set to false to force http
  },
});