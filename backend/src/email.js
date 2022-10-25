import nodemailer from 'nodemailer';

export async function sendEmail(content, email, title) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  let info = await transporter
    .sendMail({
      from: `"Brian Hong" <${process.env.EMAIL_SENDER}>`,
      to: `${email}`,
      subject: `${title}`,
      html: `${content}`,
    })
    .catch((err) => {
      throw err;
    });
  const resObj = {
    envelope: info.envelope,
    messageId: info.messageId,
    accepted: info.accepted,
    rejected: info.rejected,
    pending: info.pending,
    response: info.response,
  };
  return resObj;
}

function validateEmailStructure(input) {
  if (input.includes('@')) {
    return true;
  } else {
    throw 'ERROR: Email Structure Invalid';
  }
}

function isEmailValid(input) {
  if (input.length !== 0) {
    return true;
  } else {
    throw 'ERROR: Email Input Not Valid';
  }
}

export function checkError(email) {
  try {
    isEmailValid(email);
    validateEmailStructure(email);
  } catch (err) {
    throw err;
  }
  return true;
}

export function createTokenTemplate({ name, token }) {
  //Date is from Server-Side
  const myTemplate = `
    <html>
        <body>
            <div>
                <div>
                    <h1>${name}님 API키 발급을 위한 인증번호입니다</h1>
                    <hr />
                    <div>이름 : ${name}</div>
                    <div>인증번호 : ${token}</div>
                    <div>일시 : ${new Date().toISOString()}</div>
                </div>
            </div>
        </body>
    </html>`;
  return myTemplate;
}

export function createKeyTemplate({ name, key }) {
  //Date is from Server-Side
  const myTemplate = `
    <html>
        <body>
            <div>
                <div>
                    <h1>${name}님 API키가 발급되었습니다</h1>
                    <hr />
                    <div>이름 : ${name}</div>
                    <div>API KEY : ${key}</div>
                    <div>발급일 : ${new Date().toISOString()}</div>
                </div>
            </div>
        </body>
    </html>`;
  return myTemplate;
}
