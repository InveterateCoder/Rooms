import React, { useState } from "react";
import { FormGroup } from "./FormGroup";
import Langs from "../../../data/langs_full";
import { faTimes } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export function FilterGroup(props) {
    const [input, setInput] = useState("");
    const [error, setError] = useState(true);
    const inputChanged = ev => {
        let value = ev.target.value
        setInput(ev.target.value);
        let valid = false;
        for (let key in Langs) {
            if (key === value) {
                valid = true;
                break;
            }
        }
        if (error === valid)
            setError(!valid);
    }
    const addFilter = () => {
        let key = Langs[input];
        if (key) {
            setInput("");
            setError(true);
            if (!props.filters[key])
                props.addFilter(key, input);
        }

    }
    return <>
        <FormGroup label={props.label} value={input} type="search" error={error} holder={props.holder}
            inputChanged={inputChanged} list={Object.keys(Langs)} add={addFilter} addTitle={props.add} />
        {
            props.filters && Object.keys(props.filters).length > 0 &&
            <h5 className="border p-3">
                {
                    Object.entries(props.filters).map(([key, value]) =>
                        <span key={key} className="badge badge-info m-1">{value}
                            <span className="badge badge-dark badge-times"
                                onClick={() => props.deleteFilter(key)}>
                                    <FontAwesomeIcon icon={faTimes} /></span></span>)
                }
            </h5>
        }
    </>
}