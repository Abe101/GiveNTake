export default async function uploadToCloudinary(image: any) {
  const formData = new FormData();

  formData.append('file', image);
  formData.append('upload_preset', 'bullstreak');
  formData.append('cloud_name', 'larvae');

  const request = await fetch('https://api.cloudinary.com/v1_1/larvae/upload', {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      return [true, data.secure_url];
    })
    .catch((error) => {
      return [false, error];
    });

  return request;
}
