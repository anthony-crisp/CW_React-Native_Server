import express from 'express';
import * as admin from 'firebase-admin';
import bodyParser from 'body-parser';
var serviceAccount = require('./react-native-project-444e3-firebase-adminsdk-cvbqz-c7356ae3dc.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://react-native-project-444e3.firebaseio.com/',
  databaseAuthVariableOverride: null,
});

var db = admin.database();
var ref = db.ref('restricted_access/secret_document');
ref.once(
  'value',
  function(snapshot) {
    console.log(snapshot.val());
  },
  function(errorObject) {
    console.log('The read failed: ' + errorObject.code);
  }
);

const app = express();

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.get('/all', (req, res) => {
  console.log('hit');
  db
    .ref('people')
    .once('value')
    .then(snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        console.log(data);
        Object.keys(data).forEach(key => {
          const item = data[key];
          item.id = key;
        });
        res.json(data);
      } else {
        res.json([]);
      }
    });
});

app.post('/update', (req, res) => {
  console.log('update hit', req.body);
  db
    .ref('people')
    .child(req.body.id)
    .update({
      score: req.body.score,
    })
    .then(() => res.json(req.body))
    .catch(err => console.log(err));
});

const server = app.listen(process.env.PORT || 3000, () => {
  const { address, port } = server.address();
  console.log(`Listening at http://${address}:${port}`);
});
