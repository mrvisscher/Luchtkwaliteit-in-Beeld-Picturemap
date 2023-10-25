export function MenuBar({status, openInfo, debugCallback}){
    if(status != "base"){return}
    return(
        <div className="menu-bar">
            <div className="float-textbox">Luchtkwaliteit in Beeld</div>
            <div className="button" onClick={openInfo}>
                Info
            </div>
        </div>
    )
}

export function Title({status, children}){
    if(status != "base"){return}
    if(settings.title == ""){return}
    return(
        <div>
            <div className="title">{settings.title}</div>
            <div className="subtitle">Laat een punt achter op de kaart</div>
        </div>

    )
}