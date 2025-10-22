import axios from 'axios';
import FormData from 'form-data';

const run = async () => {
  try {
    const form = new FormData();
    form.append('name', 'Hot dog');
    form.append('description', 'Comes with ketchup mustard and relish');
    form.append('category', 'Food');
    form.append('price', '4.11');
    form.append('gst', '0');
    form.append('quantity', '10');

    const res = await axios.post('http://localhost:4000/api/items', form, { headers: form.getHeaders() });
    console.log('STATUS', res.status);
    console.log(JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error('ERR', err.message);
    if (err.response) console.error(err.response.data);
    process.exit(1);
  }
};

run();