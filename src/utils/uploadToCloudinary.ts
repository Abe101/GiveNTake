export default async function uploadToCloudinary(image: any) {
  const body = {
    file: `data:${image.type};base64,${image.base64}`,
    upload_preset: 'bullstreak',
  };

  const apiUrl = 'https://api.cloudinary.com/v1_1/larvae/image/upload';

  const request = await fetch(apiUrl, {
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json',
    },
    method: 'POST',
  })
    .then((res) => res.json())
    .then((data) => data)
    .catch((err) => err);

  return request;
}
