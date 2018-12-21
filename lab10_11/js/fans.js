var useLocalStorage = true;

function switchUseLS(){
  useLocalStorage = !useLocalStorage;
}

window.isOnline = () => this.navigator.onLine;

const getById = id => document.getElementById(id);

// REST
class ServerService {
  async sendToServer(data) {
    try {
      await fetch('/feedbacks', {
        method: 'post',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Cannot fetch data: ', error);
    }
  }

 async getFromServer() {
    try {
      const data = await fetch('/feedbacks/all');
      return data.text();
    } catch (error) {
      console.error('Cannot fetch data: ', error);
    }
  }
}
//

const feedbackContainer = getById('container');
const form = getById('form');
const namearea = getById('name');
const textarea = getById('text');

class Feedback{
  constructor(name, text, date, time){
    this.name = name;
    this.text = text;
    this.date = date;
    this.time = time;
  }
}

function feedbackTemplate(feedback) { 
var name = feedback.name;
var text = feedback.text;
var date = feedback.date;
var time = feedback.time;

return ` 
    <div class="container">
        <br>
        <p>
        <br>
        ${text}
        </p>
        <br>
        <span class="review-date">${date}, ${time}</span>
        <span class="review-author">${name}</span>
    </div>

    <div class="divider"></div>
`
}

//REST
const service = new ServerService();

const initAndRenderData = async () => {
  const items = await service.getFromServer();
  console.log(items);

  const itemsStringified = JSON.stringify(items);

  JSON.parse(items).forEach(({ name, text, date, time }) => {
    var tempFeedback = new Feedback(name, text, date, time);
    $('#container').prepend(
       feedbackTemplate(tempFeedback),
         );
   });
  // if(useLocalStorage){
  //     if (isOnline()) return;
  //     const data = localStorage.getItem('feedbacks-data');

  //     if (!data) {
  //       console.log('Нема доступних локальних даних');
  //     } else {
  //       JSON.parse(data).forEach(({ title, value, date, time }) => {
  //           var tempFeedback = new Feedback(title, value, date, time);
  //           $('#container').prepend(
  //           feedbackTemplate(tempFeedback),
  //           );
  //       });
  //     }
  // } else {
  //     var openDB = indexedDB.open("feedbacks-data", 1);
  //     openDB.onupgradeneeded = function() {
  //         var db = openDB.result;
  //         var store = db.createObjectStore("feedbacks", {keyPath: "name"});
  //         store.createIndex("name", "name", { unique: false });
  //         store.createIndex("text", "text", { unique: false });
  //         store.createIndex("date", "date", { unique: false });
  //         store.createIndex("time", "time", { unique: false });
  //     }
  //     openDB.onsuccess = function(event) {
  //       var db = openDB.result;
  //       var tx = db.transaction("feedbacks", "readwrite");
  //         var store = tx.objectStore("feedbacks");
  //         store.openCursor().onsuccess = function(event) {
  //         var cursor = event.target.result;

  //         if (cursor) {
  //           var tempFeed = new Feedback(cursor.value.name, cursor.value.text, cursor.value.date, cursor.value.time);
  //             //console.log(tempFeed);
  //             //feedbacks.push(tempFeed);
  //             $('#container').prepend(feedbackTemplate(tempFeed));
  //             cursor.continue();
  //         }
  //       };
  //         tx.oncomplete = function(){
  //           db.close();
  //         }
  //     }
  // }
}

function writeLocally(feedback){
  if(useLocalStorage){
      const item = localStorage.getItem('feedbacks-data')
      let data = item ? JSON.parse(item) : [];
      data.push(feedback);
      localStorage.setItem('feedbacks-data', JSON.stringify(data));
  }
  else {
    var openDB = indexedDB.open("feedbacks-data", 1);

    openDB.onerror = function(event) {
      alert("Error occurred when loading feedback");
    };

    openDB.onsuccess = function(event) {
      var db = openDB.result;
      var tx = db.transaction(["feedbacks"], "readwrite");
      var store = tx.objectStore("feedbacks");
      var addFeedback = store.put(feedback);
      addFeedback.onsuccess = function(event){
        alert("Feedback created");
      }
      addFeedback.onerror = function(event){
        alert("Error occurred when loading feedbacks");
      }
      tx.oncomplete = function(){
        db.close();
      }
    };
  }
}

const onSubmitPress = async (e) => {
  e.preventDefault();

  const isValid = (textarea.value.length > 0 && namearea.value.length > 0);
  form.classList.add('was-validated')

  if (!isValid) return;

  const date = new Date();

  var feedback = new Feedback(namearea.value, textarea.value, date.toLocaleDateString(), date.toLocaleTimeString());
  
  // $('#container').prepend(
  //   feedbackTemplate(feedback)
  // );

  // writeLocally(feedback);

  await service.sendToServer({
    name: namearea.value,
    text: textarea.value,
    date: date.toLocaleDateString(),
    time: date.toLocaleTimeString(),
  });

  form.classList.remove('was-validated');
  namearea.value = '';
  textarea.value = '';
}

const onOnline = () => {
  initAndRenderData();
  console.log('Статус: онлайн, завантажую дані на сервер...');
}

const onOffline = () => {
  // initAndRenderData();
  console.log('Відсутнє підключення, перемикаюсь у офлайн режим...');
}

const addButton = getById('submitBtn');
addButton.onclick = onSubmitPress;
window.addEventListener('online', onOnline);
window.addEventListener('offline', onOffline);
window.addEventListener('DOMContentLoaded', initAndRenderData);

