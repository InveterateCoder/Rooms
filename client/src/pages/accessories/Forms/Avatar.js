import React from "react";
const images = ["woman", "man", "user"];

export function Avatar(props) {
    return <div className="mb-5">
        <img src={`/img/${props.image}.svg`} width={100} className="rounded-circle border acnt-img"
            alt="icon of a person" />
        {
            images.map(name =>
                name !== props.image &&
                <button key={name} onClick={() => props.selectImage(name)} className="align-bottom acnt-img">
                    <img src={`/img/${name}.svg`} width={50} className="rounded-circle border"
                        alt={`icon of a ${name}`} /></button>)
        }
    </div >
}