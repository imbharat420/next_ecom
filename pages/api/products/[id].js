import nc from 'next-connect';
import client from '../../../utils/client';

const handler = nc();

handler.get(async (req, res) => {
  const product = await client.fetch(`*[_type == "product" && _id == $id][0]`, {
    id: "4481c706-0e4a-4da3-bacc-067a39fb3b10",
  });
  res.send(product);
});
export default handler;