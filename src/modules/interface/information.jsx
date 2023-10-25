import { useState } from 'react';
import {ScreenWrapper} from './wrapper'

export function Information({status, returnBase}){
    if(status != "information"){return}
    const [infoStatus, setInfoStatus] = useState("light-painting")

    function lightPainting(event){
        setInfoStatus("light-painting")
    }

    function doeMee(event){
        setInfoStatus("doe-mee")
    }

    function expeditie(event){
        setInfoStatus("expeditie")
    }

    return(
        <ScreenWrapper returnBase={returnBase}>
            <div className="wrapper-10">
            <h1>Luchtkwaliteit in Beeld</h1>
            <h2 >Ga in gesprek over de luchtkwaliteit in jouw wijk!</h2>
            <p>
                In de zomer van 2023 trokken geïnteresseerden eropuit om de 
                luchtkwaliteit in Leiden in kaart te brengen. Met behulp van 
                een techniek van Brits kunstenaar Robin Price maakten ze het 
                onzichtbare zichtbaar om zo het gesprek over het belang van 
                goede luchtkwaliteit te kunnen starten.
            </p>
            <div className="meta-wrapper">
                {infoStatus != "light-painting" &&<div className="button" onClick={lightPainting}>Light Painting</div>}
                {infoStatus == "light-painting" &&<div className="button inverse" onClick={lightPainting}>Light Painting</div>}
                {infoStatus != "expeditie" &&<div className="button" onClick={expeditie}>Op expeditie</div>}
                {infoStatus == "expeditie" &&<div className="button inverse" onClick={expeditie}>Op expeditie</div>}
                {infoStatus != "doe-mee" &&<div className="button" onClick={doeMee}>Doe met ons mee</div>}
                {infoStatus == "doe-mee" &&<div className="button inverse" onClick={doeMee}>Doe met ons mee</div>}
            </div>
            {infoStatus == "light-painting" && <div className="wrapper-10">
                <p>
                    Robin's techniek werkt door middel van ‘light painting’. Door een foto 
                    met een lange sluitertijd te maken kan je er met behulp van fel 
                    licht op tekenen. Robin koppelde voor zijn project een lange led-strip 
                    aan een luchtkwaliteitssensor. Het resultaat: een foto met daarin 
                    lichtpuntjes. Des te meer lichtpuntjes, des te slechter de luchtkwaliteit.
                </p>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/7ZA533mtWAA?si=-wttljjlODr2iHLh" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>                
            </div>}
            {infoStatus == "expeditie" &&<div className="wrapper-10">
                <p>
                    In 2023 kwam Robin's techniek naar Nederland. In het weekend van 30 
                    juni tot en met 2 juli organiseerde het Citizen Science Lab een 
                    expeditie om de luchtkwaliteit van Leiden in beeld te brengen. Het 
                    was een leerzame mengelmoes met informatie over luchtvervuiling, 
                    workshops en natuurlijk de expeditie zelf, waarbij iedereen op pad 
                    ging om foto’s te maken.
                </p>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/oOEWDgukb-o?si=wC_fXgF0-t0ERSZ5" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>}
            {infoStatus == "doe-mee" &&<div className="wrapper-10">
                <p>
                    Tijdens de expeditie hebben we meerdere van Robin’s kits nagebouwd. 
                    Zo kunnen we blijven experimenteren met zijn techniek en nieuwe foto’s 
                    van luchtvervuiling blijven maken. Op deze site vind je de foto’s die 
                    met die kits gemaakt zijn!
                </p>
                <p>
                    Vindt jij het leuk om ook een foto expeditie bij jou in de wijk / club 
                    / buurthuis / school / kantoor te organiseren, of wil je een kit lenen? 
                    Neem dan contact op met de Citizen Science Lab:  info@citscilab.org 
                    of schrijf je in voor de mailing-list.
                    
                </p>
                <a href="https://fd24.formdesk.com/universiteitleiden/lkib-mailing"><div className="button">Inschrijven</div></a>
            </div>}
            </div>
        </ScreenWrapper>
    )
}