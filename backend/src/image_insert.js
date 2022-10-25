//import mongoose
import mongoose from 'mongoose';

import dotenv from 'dotenv';
dotenv.config();

//DB Connection Setup
const dbConnOptions = {
  authSource: 'admin',
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
const dbConnUrl = `mongodb://${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
//Connect Database
mongoose.connect(dbConnUrl, dbConnOptions).catch((error) => {
  console.log(error);
});

//import models
import { Images } from '../models/img.model.js';

const data = [
  [
    'https://i.postimg.cc/054m3wvT/img-1.jpg',
    'https://i.postimg.cc/ZYWjCZ5h/img-2.jpg',
    'https://i.postimg.cc/xqrXdLTq/img-3.jpg',
    'https://i.postimg.cc/DybsKwy8/img-4.jpg',
    'https://i.postimg.cc/6pJZ6xyz/img-5.jpg',
    'https://i.postimg.cc/4yHKZWGr/img-6.jpg',
    'https://i.postimg.cc/KvLNDNTq/img-7.jpg',
    'https://i.postimg.cc/0QB6LLTY/img-8.jpg',
    'https://i.postimg.cc/gc1sh5xL/img-9.jpg',
    'https://i.postimg.cc/sgrJ6h9V/img-10.jpg',
  ],
  [
    'https://i.postimg.cc/NGWh0dYp/img-1.jpg',
    'https://i.postimg.cc/wxNfwg8Q/img-2.jpg',
    'https://i.postimg.cc/NfhVtL7n/img-3.jpg',
    'https://i.postimg.cc/0QTt9HmS/img-4.jpg',
    'https://i.postimg.cc/J0jp0cc2/img-5.jpg',
    'https://i.postimg.cc/0yVczNDP/img-6.jpg',
    'https://i.postimg.cc/vmjhvS0K/img-7.jpg',
    'https://i.postimg.cc/P5XSfDLS/img-8.jpg',
    'https://i.postimg.cc/253Thf7v/img-9.jpg',
    'https://i.postimg.cc/Yqk38Fxt/img-10.jpg',
  ],
  [
    'https://i.postimg.cc/xTndCj9s/img-1.jpg',
    'https://i.postimg.cc/4xF4BzVM/img-2.jpg',
    'https://i.postimg.cc/VkNLq7rn/img-3.jpg',
    'https://i.postimg.cc/ZKH5ykRJ/img-4.jpg',
    'https://i.postimg.cc/Px1tX99s/img-5.jpg',
    'https://i.postimg.cc/TPLdSpcP/img-6.jpg',
    'https://i.postimg.cc/zv5qVpYL/img-7.jpg',
    'https://i.postimg.cc/d3BwddJ5/img-8.jpg',
    'https://i.postimg.cc/wBCqdgWQ/img-9.jpg',
    'https://i.postimg.cc/XNcVTM99/img-10.jpg',
  ],
  [
    'https://i.postimg.cc/yxFtSzyB/img-1.jpg',
    'https://i.postimg.cc/L84whwYK/img-2.jpg',
    'https://i.postimg.cc/rwhb4jxd/img-3.jpg',
    'https://i.postimg.cc/65XDxyBQ/img-4.jpg',
    'https://i.postimg.cc/J45SrMh5/img-5.jpg',
    'https://i.postimg.cc/tgYcN6NB/img-6.jpg',
    'https://i.postimg.cc/ZRND1hg3/img-7.jpg',
    'https://i.postimg.cc/3rpPqg56/img-8.jpg',
    'https://i.postimg.cc/Jhv26hTM/img-9.jpg',
    'https://i.postimg.cc/nrtwxPbW/img-10.jpg',
  ],
  [
    'https://i.postimg.cc/L8hg94Vc/img-1.jpg',
    'https://i.postimg.cc/J01t9Rnd/img-2.jpg',
    'https://i.postimg.cc/T3SLp87p/img-3.jpg',
    'https://i.postimg.cc/MGQcBsNt/img-4.jpg',
    'https://i.postimg.cc/qRczbNk3/img-5.jpg',
    'https://i.postimg.cc/XqQXWtBN/img-6.jpg',
    'https://i.postimg.cc/GhmHK364/img-7.jpg',
    'https://i.postimg.cc/3RQkFXHh/img-8.jpg',
    'https://i.postimg.cc/Wpnd0qYR/img-9.jpg',
    'https://i.postimg.cc/MK3XF28d/img-10.jpg',
  ],
  [
    'https://i.postimg.cc/Cx4rgNmP/img-1.jpg',
    'https://i.postimg.cc/ydDL0zBt/img-2.jpg',
    'https://i.postimg.cc/XvH2ZvM9/img-3.jpg',
    'https://i.postimg.cc/DZRBgYwZ/img-4.jpg',
    'https://i.postimg.cc/KjLQsr15/img-5.jpg',
    'https://i.postimg.cc/m2Y8YjfL/img-6.jpg',
    'https://i.postimg.cc/J4VpHgFY/img-7.jpg',
    'https://i.postimg.cc/gc6MJdg6/img-8.jpg',
    'https://i.postimg.cc/yNYQYZGV/img-9.jpg',
    'https://i.postimg.cc/T3TQCbfr/img-10.jpg',
  ],
  [
    'https://i.postimg.cc/8cqBRFwr/img-1.jpg',
    'https://i.postimg.cc/fT9vwKT7/img-2.jpg',
    'https://i.postimg.cc/9XSp5SVF/img-3.jpg',
    'https://i.postimg.cc/C15j9CQq/img-4.jpg',
    'https://i.postimg.cc/KzWnbK6s/img-5.jpg',
    'https://i.postimg.cc/y8CyWZkM/img-6.jpg',
    'https://i.postimg.cc/ZqV8fsVm/img-7.jpg',
    'https://i.postimg.cc/g0YyHby4/img-8.jpg',
    'https://i.postimg.cc/zGwShGhV/img-9.jpg',
    'https://i.postimg.cc/MTZmYJwq/img-10.jpg',
  ],
  [
    'https://i.postimg.cc/cJRxZPVq/img-1.jpg',
    'https://i.postimg.cc/85wTfMpt/img-2.jpg',
    'https://i.postimg.cc/VL2mtYwQ/img-3.jpg',
    'https://i.postimg.cc/vBGQm3s4/img-4.jpg',
    'https://i.postimg.cc/5y0bByj1/img-5.jpg',
    'https://i.postimg.cc/KjHFJbgT/img-6.jpg',
    'https://i.postimg.cc/2jczzQX5/img-7.jpg',
    'https://i.postimg.cc/vH4GD4pt/img-8.jpg',
    'https://i.postimg.cc/VkM1B3sS/img-9.jpg',
    'https://i.postimg.cc/wv3wDRD9/img-10.jpg',
  ],
  [
    'https://i.postimg.cc/Y94w0VPq/img-1.jpg',
    'https://i.postimg.cc/8Pdg7LZW/img-2.jpg',
    'https://i.postimg.cc/4xBC5skx/img-3.jpg',
    'https://i.postimg.cc/rsxXC4cB/img-4.jpg',
    'https://i.postimg.cc/zB9Yg7mw/img-5.jpg',
    'https://i.postimg.cc/XYVSdXPP/img-6.jpg',
    'https://i.postimg.cc/qMHdB1x4/img-7.jpg',
    'https://i.postimg.cc/nVDJty73/img-8.jpg',
    'https://i.postimg.cc/PqxgV9Tz/img-9.jpg',
    'https://i.postimg.cc/SKvwBdK0/img-10.jpg',
  ],
  [
    'https://i.postimg.cc/5ths5R0t/img-1.jpg',
    'https://i.postimg.cc/wTwF4vvZ/img-2.jpg',
    'https://i.postimg.cc/MpX5CSfT/img-3.jpg',
    'https://i.postimg.cc/MK6dYRW1/img-4.jpg',
    'https://i.postimg.cc/9QSbVnyB/img-5.jpg',
    'https://i.postimg.cc/05dVmZq8/img-6.jpg',
    'https://i.postimg.cc/yd0vLygy/img-7.jpg',
    'https://i.postimg.cc/FzZG4Fxf/img-8.jpg',
    'https://i.postimg.cc/sxyKqG5d/img-9.jpg',
    'https://i.postimg.cc/43953Q5R/img-10.jpg',
  ],
  [
    'https://i.postimg.cc/d3pPG9zm/img-1.jpg',
    'https://i.postimg.cc/44SgCJm7/img-2.jpg',
    'https://i.postimg.cc/MGqk0Hr4/img-3.jpg',
    'https://i.postimg.cc/K8XhzJ7m/img-4.jpg',
    'https://i.postimg.cc/g2vF6848/img-5.jpg',
    'https://i.postimg.cc/YqLwMJWX/img-6.jpg',
    'https://i.postimg.cc/GpQWXRWp/img-7.jpg',
    'https://i.postimg.cc/yd8w55Ky/img-8.jpg',
    'https://i.postimg.cc/50KZM3Nd/img-9.jpg',
    'https://i.postimg.cc/pr93VFp9/img-10.jpg',
  ],
  [
    'https://i.postimg.cc/15rrnzw4/img-1.jpg',
    'https://i.postimg.cc/dVQm8Kj6/img-2.jpg',
    'https://i.postimg.cc/sgnPm0nr/img-3.jpg',
    'https://i.postimg.cc/GhdkC1VR/img-4.jpg',
    'https://i.postimg.cc/qB88S7mQ/img-5.jpg',
    'https://i.postimg.cc/hjm9S4KD/img-6.jpg',
    'https://i.postimg.cc/Xvpfzchy/img-7.jpg',
    'https://i.postimg.cc/brj1dXvQ/img-8.jpg',
    'https://i.postimg.cc/rp31XRXZ/img-9.jpg',
    'https://i.postimg.cc/7hM02BCj/img-10.jpg',
  ],
  [
    'https://i.postimg.cc/PJFVBryt/img-1.jpg',
    'https://i.postimg.cc/MpB3FwQS/img-2.jpg',
    'https://i.postimg.cc/QN6zB03R/img-3.jpg',
    'https://i.postimg.cc/9Mmx0qNm/img-4.jpg',
    'https://i.postimg.cc/2600Z8P4/img-5.jpg',
    'https://i.postimg.cc/QMrYLzQW/img-6.jpg',
    'https://i.postimg.cc/hvhpbRBN/img-7.jpg',
    'https://i.postimg.cc/7LMsqN9t/img-8.jpg',
    'https://i.postimg.cc/HsVhbXWj/img-9.jpg',
    'https://i.postimg.cc/90S1LgX0/img-10.jpg',
  ],
];

async function insertImage() {
  for (let i = 0; i < 13; i++) {
    for (let j = 0; j < 10; j++) {
      const res = await new Images({ name: i + 1, img: data[i][j] }).save();
      console.log(res);
    }
  }
}

insertImage();
