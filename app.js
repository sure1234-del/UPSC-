// Telegram Init
const tg = window.Telegram.WebApp;
tg.expand();

const user = tg.initDataUnsafe.user;
document.getElementById("userInfo").innerHTML =
  "Welcome, " + user.first_name + " (ID: " + user.id + ")";


// 🔥 Firebase Config (Replace with your own)
const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_ID",
  appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Load Videos from Firestore
db.collection("videos").get().then(snapshot => {
  snapshot.forEach(doc => {
    const data = doc.data();
    createVideoCard(doc.id, data.title, data.url);
  });
});


function createVideoCard(id, title, url) {
  const div = document.createElement("div");
  div.className = "card";

  div.innerHTML = `
    <h3>${title}</h3>
    <button onclick="playVideo('${id}','${url}')">
      Watch Video
    </button>
    <div id="player-${id}"></div>
  `;

  document.getElementById("videoContainer").appendChild(div);
}


function playVideo(videoId, url) {

  const userRef = db.collection("views").doc(user.id + "_" + videoId);

  userRef.get().then(doc => {

    let count = 0;

    if (doc.exists) {
      count = doc.data().count;
    }

    if (count >= 3) {
      alert("You have reached the 3-view limit.");
      return;
    }

    userRef.set({ count: count + 1 });

    document.getElementById("player-" + videoId).innerHTML = `
      <div style="position:relative;">
        <div class="watermark">
          ${user.first_name} | ${user.id}
        </div>
        <video controls controlsList="nodownload">
          <source src="${url}" type="application/x-mpegURL">
        </video>
      </div>
    `;

  });
}
