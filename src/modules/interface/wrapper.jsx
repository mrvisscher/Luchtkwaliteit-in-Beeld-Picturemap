export function ScreenWrapper({returnBase, children}){
    return(
        <div className="full-blur" onClick={returnBase}>
            <div className="wrapper" onClick={e => e.stopPropagation()}>
                <WrapperClose returnBase={returnBase}/>
                {children}
            </div>
        </div>
    )
}

function WrapperClose({returnBase}){
    return(
        <div className="button" onClick={returnBase}>
            Close
        </div>
    )
}
