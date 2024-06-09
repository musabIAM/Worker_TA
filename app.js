const mqtt = require('mqtt')
const options = require('./setup/Hivemq.js').options
const express = require('express');

const db = require('./setup/database.js').app
const firebase = require('./setup/database.js').fb

const database = firebase.getDatabase(db);
const rootRef = firebase.ref(database);

app = express();
var client = mqtt.connect(options);
var client2 = mqtt.connect(options);

client.on('connect', function () {
  console.log('Connected');
  client.subscribe('esp8266_data');
  client.on('message', (topic, message) => {
    validator(message)
  });
});

client2.on('connect', function () {
  console.log('Connected');
  client.subscribe('cobaAWS');
  client.on('message', (topic, message) => {
    validator(message)
  });
});

function slice_data(message){

  message = message.toString()
  var data = []
  data = message.split('#')
  data.shift()

  return data;

}

async function validator (message) {

  message = message.toString();
  var data = [];
  data = slice_data(message);

  // data[0] => nama iot
  // data[1] => long
  // data[2] => lat 
  // data[3] => N
  // data[4] => P
  // data[5] => K
  // data[6] => PH
  // data[7] => Moist
  const device = await check_device (data[0])
  if(!device){
    add_device(data)
    add_history(data)
  } else{
    add_history(data)
  }
}

check_device = (id) => {
  return new Promise( async (resolve, reject) => {
      try {
        firebase.get(firebase.ref(database,'SOIL/'+id)).then((snapshot) => {
          if (snapshot.exists()) {
            console.log("Data available");
            resolve(true);
          } else {
            console.log("No data available");
            resolve(false);
          }
        }).catch((error) => {
          console.error("Error getting data:", error);
        });
      } catch (error) {
          console.log(error)
          reject(error)
      }
  })
}

add_device = (data) => {
  return new Promise( async (resolve, reject) => {
      try {
        firebase.set(firebase.ref(database, 'SOIL/'+data[0]),{
          long:data[1],
          lat:data[2],
          mac_address:'3C:71:BF:2A:D7:9E',
          jenis_iot : data[0]
      }).then(() => {
          // Data saved successfully!
          console.log('Data saved successfully')
          resolve(true)
        })
        .catch((error) => {
          // The write failed...
          console.log('The write failed')
          reject(error)
        });
      } catch (error) {
          console.log(error)
          reject(error)
      }
  })
}

function add_history(data){
  console.log('masuk');
  const newData = [ 
    { 
      N: data[3],
      P: data[4],
      K: data[5], 
      PH: data[6], 
      mosit: data[7], 
      timestamp_alat: '',
      timestamp_server: new Date,
     } 
  ]
  firebase.get(firebase.ref(database,'HISTORY/SOIL/'+data[0]))
    .then((snapshot) => {
        if (snapshot.exists()) {
          const existingData = snapshot.val().data;
          // console.log(existingData)

          const updatedData = [...existingData, ...newData];
          // console.log(updatedData)
          firebase.update(firebase.ref(database,'HISTORY/SOIL/'+data[0]), { 
            data: updatedData 
          }
          );
        } else {
          console.log('ga ada')
          
          firebase.set(firebase.ref(database, 'HISTORY/SOIL/'+data[0]), { 
            data: newData 
          });
        }
    })
    .catch((error) => {
      console.log(error)
    });
}

function add_history_aws(data){
  const newData = [ 
    { 

      Temp : data[1],
      Humid : data[2],
      Wind_speed : data[3],
      Pressure : data[4],
      Rain : data[5],
      Intensity : data[6],
      Wind_dir : data[7],
      Wind_gust : data[8],
      timestamp_alat: '',
      timestamp_server: new Date,
     } 
  ]
  firebase.get(firebase.ref(database,'HISTORY/WEATHER/'+data[0]))
    .then((snapshot) => {
        if (snapshot.exists()) {
          const existingData = snapshot.val().data;

          const updatedData = [...existingData, ...newData];
          firebase.update(firebase.ref(database,'HISTORY/WEATHER/'+data[0]), { 
            data: updatedData 
          }
          );
        } else {
          console.log('ga ada')
          
          firebase.set(firebase.ref(database, 'HISTORY/WEATHER/'+data[0]), { 
            data: newData 
          });
        }
    })
    .catch((error) => {
      console.log(error)
    });
}

