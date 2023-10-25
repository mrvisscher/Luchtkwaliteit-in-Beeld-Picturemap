import { createRoot } from 'react-dom/client';
import { useState } from 'react';

import { Map } from './modules/interface/map.jsx';
import { Information } from './modules/interface/information.jsx';
import { MenuBar, Title } from "./modules/interface/basics.jsx";

const root = createRoot(document.getElementById('app'));
root.render(<Interface/>)

function Interface(){
    const [status, setStatus] = useState("base")

    function openInfo(event){
        setStatus("information")
    }

    function returnBase(){
        setStatus("base")
    }

    return(
        <>
            <Title status={status}/>
            <Information status = {status} returnBase={returnBase}/>
            <MenuBar status = {status} openInfo = {openInfo}/>
            <Map status = {status}/>
        </>
        
    )
}