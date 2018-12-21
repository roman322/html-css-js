var useLocalStorage = false;

function switchUseLS(){
  useLocalStorage = !useLocalStorage;
}

window.isOnline = () => this.navigator.onLine;
const getById = (id) => document.getElementById(id);

// REST
class ServerService {
  async sendToServer(data) {
    try {
      await fetch('/news', {
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
      const data = await fetch('/news/all');
      return data.text();
    } catch (error) {
      console.error('Cannot fetch data: ', error);
    }
  }
}
//

const newsContainer = getById('content_news');

class News{
  constructor(title, body, picture){
    this.title = title;
    this.body = body;
    this.picture = picture;
  }
}

function newsTemplate(news) {
var title = news.title;
var body = news.body;
var picture = news.picture;
var button = document.createElement('input');

button.type  = 'button';
button.addEventListener('click', function() {
    alert(add);
}, false);

return `
    <div id="content_wrapper_news">
      <div href="#" class="news_table">
        <img src="${picture}" alt="${title}">
        <h1>${body}</h1>
      <br>
      </div>
`
}

function myFunction() {
  if(useLocalStorage){
    localStorage.clear();
    alert("Вашу новину видалено успішно!");
    location.reload();
    show();
  }
  else {
      window.indexedDB.deleteDatabase("news_data");
      location.reload();
      show();
  }
}

// function show(){
//   if(useLocalStorage){
//   const data = localStorage.getItem('news_data');

//   if (!isOnline()) return;

//   if (!data) {
//     console.log('No available local data found');
//   } else {
//     JSON.parse(data).forEach(({ title, body, picture }) => {
//         console.log(title, body);
//         var tempNews = new News(title, body, picture);
//         $('#content_news').append(
//           newsTemplate(tempNews),
//         );
//     });
//   }
//   }
//   else if (!isOnline()) return; 

//   else {
//     var openDB = indexedDB.open("news_data", 1);
//     openDB.onupgradeneeded = function() {
//         var db = openDB.result;
//         var store = db.createObjectStore("news", {keyPath: "title"});
//         store.createIndex("title", "title", { unique: false });
//         store.createIndex("body", "body", { unique: false });
//         store.createIndex("picture", "picture", { unique: false });
//     }
//     openDB.onsuccess = function(event) {
//       var db = openDB.result;
//       var tx = db.transaction("news", "readwrite");
//         var store = tx.objectStore("news");
//         store.openCursor().onsuccess = function(event) {
//         var cursor = event.target.result;

//         if (cursor) {
//           var tempNews = new News(cursor.value.title, cursor.value.body, cursor.value.picture);
//           //console.log(tempFeed);
//           //feedbacks.push(tempFeed);
//           $('#content_news').append(
//             newsTemplate(tempNews),
//           );
//           cursor.continue();
//         }
//       };
//         tx.oncomplete = function(){
//           db.close();
//         }
//     }
//   }
// }

//REST
const service = new ServerService();

const initAndRenderData = async () => {
  const items = await service.getFromServer();
  console.log(items);

  const itemsStringified = JSON.stringify(items);

  JSON.parse(items).forEach(({ title, body, picture }) => {
         var tempNews = new News(title, body, picture);
         $('#content_news').append(
           newsTemplate(tempNews),
         );
   });
}

const onOnline = () => {
  initAndRenderData();
  console.log('Network status: online');
}

const onOffline = () => {
  console.log('Connection lost');
}

window.addEventListener('online', onOnline);
window.addEventListener('offline', onOffline);
window.addEventListener('DOMContentLoaded', initAndRenderData);

