import React, {useContext} from "react";
import {Context} from "../../../data/Context";
import Flag from "react-flags";
import LocalizedStrings from "react-localization";
const text = new LocalizedStrings({
    en:{
        sorry: "SORRY",
        norecord: "No records yet"
    },
    ru:{
        sorry: "ЖАЛЬ",
        norecord: "Пока нет записей"
    }
})

export function Presenter(props) {
    const context = useContext(Context);
    text.setLanguage(context.lang);
    return <div id="content">
        {
            !props.list || props.list.length < 1
                ?   <div id="no_records">
                        <img src="/img/search.png" width="128" alt="Search" />
                        <span className="display-4 text-danger">{text.sorry}</span>
                        <div className="display-4">{text.norecord}</div>
                    </div> 
                :   props.list.map(item =>
                        <div key={item.slug} className="card">
                            <a href={"/room/" + item.slug} className="card-body">
                                <h4 className="card-title">{item.locked && <img src="/img/lock.png" width="32" alt="lock imag" />}
                                    <span><Flag name={item.flag} format="png" pngSize={32} alt={"flat" + item.flag} basePath="/img" /></span><span>{item.name}</span></h4>
                                <strong className="text-dark">Online: <span className="badge badge-secondary">{item.online}</span></strong>
                                <p className="card-text text-dark">{item.description}</p>
                            </a>
                        </div>)
        }
    </div>
}