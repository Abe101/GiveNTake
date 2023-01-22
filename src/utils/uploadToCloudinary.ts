import axios from 'axios';

export default async function uploadToCloudinary(image: any) {
  const formData = new FormData();

  formData.append('file', image);
  formData.append('upload_preset', 'bullstreak');
  formData.append('cloud_name', 'larvae');

  const request = await axios
    .post('https://api.cloudinary.com/v1_1/larvae/upload', formData)
    .then((res) => {
      console.log('uploadImgRes', res);
      return res.data;
    })
    .catch((error) => {
      console.log('uploadImgError', error);
      return error.response;
    });

  return request;
}
