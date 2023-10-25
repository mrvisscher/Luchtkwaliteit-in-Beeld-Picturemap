import {Style, Icon} from 'ol/style.js';

//================== Changing Cursor Based on features
export function changeCursor(map, event){
    //set cursor to hand if hovering over point
    let pointsThere = map.getFeaturesAtPixel([event.pageX, event.pageY])    
    if (anyClickable(pointsThere)){document.body.style.cursor = "pointer"}
    else {document.body.style.cursor = "auto"}
}

function anyClickable(points){
    let clickable = false
    for (let i in points){
        if (points[i].clickable){clickable = true}
    }
    return clickable
}

//================== Changing featuresize based on cursor position
export function mouseDynamics(handler, event){
    //Resize the points based on distance from the pointer
    let mouseCoords = handler.map.getEventCoordinate(event)
    let allFeatures = handler.imagePoints.layer.getSource().getFeatures()
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

function pythagoras(coordsA, coordsB){
    let x = Math.abs(coordsA[0] - coordsB[0])
    let y = Math.abs(coordsA[1] - coordsB[1])
    return Math.sqrt(x*x+y*y)
}

//================== Changing featuresize randomly making them blink
export class Pulser{
    step = 0.002

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
            shape.setScale(shape.getScale() - this.step)
        } 
        else if (shape.getScale() < 0.05) {
            this.starUp = true;
            shape.setScale(shape.getScale() + this.step)
        }
        else{
            if (this.starUp){
                shape.setScale(shape.getScale() + this.step)
                //console.log(shape.getScale())
                style = new Style({
                    image: shape
                });
                this.feature.setStyle(style);
            }
            else{
                shape.setScale(shape.getScale() - this.step)
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