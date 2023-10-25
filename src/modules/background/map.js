/*
DEPRECATED IN FAVOR OF lkibmap.js
*/

import {getPointList, getSuggestData, uploadSuggest} from '../database/firebase.js';
import { pythagoras } from '../utils.js';

import {Feature, Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector.js';
import Point from 'ol/geom/Point.js';
import VectorSource from 'ol/source/Vector';
import Stamen from 'ol/source/Stamen.js';

import Collection from 'ol/Collection.js';
import {Style} from 'ol/style.js';
import Icon from 'ol/style/Icon.js';
import Overlay from 'ol/Overlay.js';

import { styles } from './styles.js';
import { ImagePoints } from './points.js';

import { LKIBMap } from './lkibmap.js';
/*
//Point Layer
const pointCollection = new Collection([])

export async function loadPoints(){

  let pointList = await getPointList("points")
  //Extract data from each database-node and put into feature colection
  pointList.forEach(function(point){
    let feature = new Feature({
      geometry: new Point([point.data.x, point.data.y], "xy")
    })
    feature.setId(point.id)
    const randomRotation = Math.random() * 6
    feature.setStyle(  new Style({
      image: new Icon({
        src: "/assets/spot.png",
        scale: 0.2,
        rotation: randomRotation
      })
    }),)
    
    //console.log(styler)
    pointCollection.push(feature)
    if(settings.dynamics == "pulse"){
      const styler = new LedStyler(feature)
    }
  })
}

const pointLayer = new VectorLayer({
  source: new VectorSource({
    features: pointCollection
  }),
})

export function pointLayerFilter(candidate){
  if (candidate != pointLayer){return false}
  else {return true}
}

//Suggest Layer
const suggestsCollection = new Collection([])

async function loadSuggests(){
  let pointList = await getPointList("suggestions/suggestions/" + settings.suggestId)

  pointList.forEach(function(point){
    let feature = new Feature({
      geometry: new Point([point.data.x, point.data.y], "xy")
    })
    feature.setId(point.id)
    let text = point.data.why
    if(text != "" && text != undefined){
      feature.setStyle(styles[2])      
    }
    else {
      feature.setStyle(styles[1])
    }
    
       
    //console.log(styler)
    suggestsCollection.push(feature)

  })
}

export async function refreshSuggests(){
  console.log("refreshing suggests")
  const length = suggestsCollection.getLength()
  
  for(let i = 1; i < 5; i++){
    try{
      let feature = suggestsCollection.getArray()[length - i]
      let text = await getSuggestData(feature.getId(), 'why')
      if(text != "" && text != undefined){
        feature.setStyle(styles[2])      
      }
      else {
        feature.setStyle(styles[1])
      }
    }
    catch(error){console.log(error)}
  }

}

const suggestLayer = new VectorLayer({
  source: new VectorSource({
    features: suggestsCollection
  })
})

export const popUp = new Overlay({
  position: [500166, 6828934],
  positioning: 'top-center',
  offset: [0,-75]
});

export function addSuggest(event){
  let feature = new Feature({
    geometry: new Point(event.coordinate, "xy")
  })

  feature.setStyle(styles[3])

  suggestsCollection.push(feature)
  movePopUp(event.coordinate)
}

export function removeSuggest(){
  suggestsCollection.pop()
}

export function movePopUp(coords){
  popUp.setPosition(coords)
}

export async function confirmSuggest(){
  const feature = suggestsCollection.item(suggestsCollection.getLength() - 1)
  feature.setStyle(styles[1])
  const coords = feature.getGeometry().getCoordinates()
  const ref = await uploadSuggest(coords)
  feature.setId(ref)
  return ref
}

export function suggestLayerFilter(candidate){
  if (candidate != suggestLayer){return false}
  else {return true}
}
*/
//Stamen Layer
const stamenLayer = new TileLayer({
  className: 'stamen-map',
  source: new Stamen({
    layer: "toner-lite"
  }),
})

//Functions for Map Dynamics
function cursorChange(map, event){
  //set cursor to hand if hovering over point
  let pointsThere = map.getFeaturesAtPixel([event.pageX,event.pageY], {layerFilter: pointLayerFilter})
  if (pointsThere.length > 0){document.body.style.cursor = "pointer"}
  else {document.body.style.cursor = "auto"}
}

function mouseDynamics(map, event){
  //Resize the points based on distance from the pointer
  let mouseCoords = map.getEventCoordinate(event)
  let allFeatures = pointLayer.getSource().getFeatures()
  allFeatures.forEach(scaleFeature.bind(null, mouseCoords))

}

function scaleFeature(mouseCoords, feature){
  let featureCoords = feature.getGeometry().flatCoordinates
  let distance = pythagoras(mouseCoords, featureCoords)
  
  //if too far, skip for speed
  if (distance > 10000){return}

  //calculate the scale of the star based on distance
  let scale = (10/distance)*10
  if (scale < 0.1){scale = 0.1}
  if (scale > 0.3 ){scale = 0.3}

  //Create the new style
  let style = new Style({
    image: new Icon({
      src: "/assets/spot.png",
      scale: scale
    }),
  })

  //set the new style
  feature.setStyle(style)
}

//Function for Automatic Map Dynamics
/*
//var starUp = false;
const step = 0.002

class LedStyler{

  constructor(feature){
    this.feature = feature
    this.starUp = false

    const randomScale = Math.random() * 0.2
    this.feature.getStyle().getImage().setScale(randomScale)
    this.frame()
  }


  frame() {
    let style = this.feature.getStyle()
    let shape = style.getImage()
           
    if (shape.getScale() > 0.2) {
        this.starUp = false;
        shape.setScale(shape.getScale() - step)
    } 
    else if (shape.getScale() < 0.05) {
        this.starUp = true;
        shape.setScale(shape.getScale() + step)
    }
    else{
        if (this.starUp){
            shape.setScale(shape.getScale() + step)
            //console.log(shape.getScale())
            style = new Style({
                image: shape
            });
            this.feature.setStyle(style);
        }
        else{
            shape.setScale(shape.getScale() - step)
            //console.log(shape.getScale())
            style = new Style({
                image: shape
            });
            this.feature.setStyle(style);
        }
    }
    setTimeout(this.frame.bind(this), 30)
  }

}
*/
//Infopopup
const infoPopUp = new Overlay({
  position: [500087.17431458086, 6828941.165971401],
  positioning: 'top-center',
  offset: [0,-75],
});

export function getMap(){
  const lkibmap = new LKIBMap()
  return lkibmap.map


  /*
  const points = new ImagePoints()

  const map = new Map({
    controls: [],
    target: 'map',
    layers: [stamenLayer, points.layer],
    view: new View({
      center: [500166, 6828934],
      zoom: 15,
      enableRotation: false
    }),
  });
  if (settings.suggests){
    map.addLayer(suggestLayer)
  }
  points.load()
  loadSuggests()

  //Add dynamics to the cursor
  map.getViewport().addEventListener("mousemove", cursorChange.bind(null, map));

  if(settings.dynamics == "mouse"){
    map.getViewport().addEventListener("mousemove", mouseDynamics.bind(null, map));
  }

  //Add pop up
  popUp.setElement(document.getElementById("popup"))
  map.addOverlay(popUp)

  //infoPopUp.setElement(document.getElementById("infopop"))
  //map.addOverlay(infoPopUp)

  return map
  */
}

