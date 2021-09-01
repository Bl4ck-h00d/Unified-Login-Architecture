Setup-

-> Open 3 terminals in the root directory of this project.

->Terminal1

```Bash
cd authServer/
npm i
node app.js
```

->Terminal2

```Bash
cd consumer1/
npm i
node app.js
```

->Terminal3

```Bash
cd consumer2/
npm i
node app.js
```

Now, open browser and point to http://127.0.0.1:3020 (consumer1) or http://127.0.0.1:3030 (consumer2)

You will be redirected to a login page, login with credentials(email- admin@flam.com password-123)

Now check other consumer website, you will see that you are already logged in.



http://localhost:3010/auth/login?redirectURL=http://127.0.0.1:3020/