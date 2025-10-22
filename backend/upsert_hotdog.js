import axios from 'axios';
import FormData from 'form-data';

const NAME = 'Hot dog';
const payload = {
  name: 'Hot dog',
  description: 'Comes with ketchup mustard and relish',
  category: 'Food',
  price: 4.11,
  gst: 0,
  quantity: 10
};

const run = async () => {
  try {
    const res = await axios.get('http://localhost:4000/api/items');
    const items = Array.isArray(res.data) ? res.data : (res.data.items || res.data);
    const existing = items.find(i => (i.name || '').toLowerCase() === NAME.toLowerCase());
    if (existing) {
      console.log('Item exists, updating:', existing._id);
      const updateRes = await axios.put(`http://localhost:4000/api/items/${existing._id}`, payload, { headers: { 'Content-Type': 'application/json' } });
      console.log('Updated:', updateRes.status);
      console.log(JSON.stringify(updateRes.data, null, 2));
      return;
    }

    console.log('Item not found, creating new item');
    const form = new FormData();
    Object.entries(payload).forEach(([k,v]) => form.append(k, String(v)));
    const createRes = await axios.post('http://localhost:4000/api/items', form, { headers: form.getHeaders() });
    console.log('Created:', createRes.status);
    console.log(JSON.stringify(createRes.data, null, 2));
  } catch (err) {
    console.error('ERR', err.message);
    if (err.response) console.error(err.response.data);
    process.exit(1);
  }
};

run();
