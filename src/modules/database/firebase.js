import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, getDocs, getDoc, setDoc, addDoc, deleteDoc } from 'firebase/firestore/lite';
import { getStorage, ref, getDownloadURL, uploadBytes } from "firebase/storage";
import {v4 as uuid} from "uuid"

// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyALs9MRHfWTUyQVt9MOhvcbh45aIDA496I",
    authDomain: "lkib-picturemap.firebaseapp.com",
    projectId: "lkib-picturemap",
    storageBucket: "lkib-picturemap.appspot.com",
    messagingSenderId: "725607961091",
    appId: "1:725607961091:web:d2da6fff868c214a8b7436"
  };
  
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const storage = getStorage();

async function getPointList(name) {
    //Load pointdata from Firebase Database
    let pointsCollection = collection(db, name)
    let pointSnapshot = await getDocs(pointsCollection)
    let pointList = pointSnapshot.docs.map(doc => ({id:doc["id"], data:doc.data()}))
    return pointList
}

async function getImageData(id) {
    //Get associated imagedata from DB
    const imageDataRef = doc(db, "images/" + id)
    const docSnap = await getDoc(imageDataRef)
    const imageData = docSnap.data()
    if(imageData == undefined){return}

    //Get image url
    try   {var imageFileRef = ref(storage, imageData.file)}
    catch {console.log(`No imagedata for: ${id}`);  return}
    const url = await getDownloadURL(imageFileRef)

    return{
      url: url,
      description: imageData.description,
      photographer: imageData.photographer,
      pm25: imageData.pm25,
      date: new Date(imageData.date_taken.toDate()).toLocaleDateString("nl-NL",{dateStyle:"long"}),
      userID: imageData.userID
  }
}

async function uploadImage(clickCoords){
  //get the metadata from the form
  const photographer = document.getElementById("upload-input-photographer")
  const pm25 = document.getElementById("upload-input-pm25")
  const description = document.getElementById("upload-input-desc")
  const date = document.getElementById("upload-input-date")

  //get the file from the DOM
  let fileInputDOM = document.getElementById("upload-input-file")
  if (fileInputDOM.files.length == 0){return}
  let file = fileInputDOM.files[0]

  const location = '/images/' + file.name
  const storageRef = ref(storage, location)

  //Uploading file to Firestore Storage
  await uploadBytes(storageRef, file).then((snapshot) => {
    console.log('Uploaded the file');
  });

  //Updating the Firestore Database
  const pointsRef = await addDoc(collection(db, "points"), {
    x: clickCoords[0],
    y: clickCoords[1]
  });
  console.log("set the points db succesfully")
  await setDoc(doc(db, "images", pointsRef.id), {
    date_taken: new Date(date.value),
    date_upload: new Date(),
    description: description.value,
    file: location,
    photographer: photographer.value,
    pm25: pm25.value,
    userID: userID()
  });
  console.log("set the images db succesfully")
}

async function removeImage(id){
  const pointDoc = doc(db, "points", id)
  const imageDoc = doc(db, "images", id)
  await deleteDoc(pointDoc)
  await deleteDoc(imageDoc)
}

function userID(){
  const userId = localStorage.getItem("userId");
  if (userId) return userId
  const newId = uuid()
  localStorage.setItem("userId",newId)
  return newId
}

async function uploadSuggest(clickCoords){
  const pointsRef = await addDoc(collection(db, "suggestions/suggestions/" + settings.suggestId), {
    x: clickCoords[0],
    y: clickCoords[1],
    opened: false
  });
  return pointsRef.id
}

async function updateSuggest(id, field, value){
  const docRef = doc(db, "suggestions/suggestions/" + settings.suggestId, id)
  const update = {}
  update[field] = value
  await setDoc(docRef, update, {merge:true})
}

async function getSuggestData(id, value){
  const docRef = doc(db, "suggestions/suggestions/" + settings.suggestId, id)
  const docSnap = await getDoc(docRef)
  const data = docSnap.data()[value]
  return data
}

async function dataMover(){
  var list = await getPointList("suggestions")
  list.forEach(element => {
    setDoc(doc(db, "suggestions/suggestions/nvo/" + element.id), element.data);
  });

}

export {db, storage, getPointList, getImageData, uploadImage, uploadSuggest, updateSuggest, getSuggestData, removeImage}