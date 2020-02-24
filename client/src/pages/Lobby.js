import React, { Component } from "react";
import { Context } from "../data/Context";
import Loading from "react-loading";
import { Paginator } from "./accessories/Lobby/Paginator";
import { Presenter } from "./accessories/Lobby/Presenter";
import validator from "../utils/validator";
import { Get } from "../utils/requests";
import urls from "../utils/Urls";

export class Lobby extends Component {
    static contextType = Context;
    constructor(props) {
        super(props);
        this.state = {
            page: null,
            total: null,
            list: null,
            slug: null
        }
    }
    queryServer(request) {
        let page = Number(this.props.match.params.page);
        if(this.state.page && page > this.state.page && this.state.page === this.state.total) {
            this.props.history.replace("/lobby/" + this.state.page + this.props.location.search);
            return;
        }
        let slug = this.props.location.search;
        if (slug.startsWith("?q=")) {
            slug = slug.substring(3);
            let name = slug;
            name = name.replace(/_/g, ' ');
            if (validator.groupname(name, this.context.lang, true))
                slug = null;
        }
        if(page !== this.state.page || slug !== this.state.slug) {
            let addr = `${urls.lobbySearch}/${page}/10`;
            if(slug || this.context.c_codes) addr += "?";
            if(slug) addr += "slug=" + slug;
            if(this.context.c_codes) addr += (slug ? "&" : "") + "c_codes=" + this.context.c_codes;
            Get(addr, this.context.lang, this.context.jwt)
                .then(data => {
                    if(data)
                        this.setState({
                            page: data.page,
                            total: data.total,
                            list: data.list,
                            slug: slug
                        });
                }).catch(() => this.props.history.push("/fatal"));
        }
    }
    render() {
        return <div id="lobby" className="container-fluid">
            {
                this.props.match.params.page && Number(this.props.match.params.page) !== this.state.page
                    ? <Loading id="spinner" type="spinningBubbles" color="#17a2b8" width="100px" />
                    : <>
                        <Presenter list={this.state.list} />
                        <Paginator base="/lobby/" q={this.props.location.search}
                            page={this.state.page} total={this.state.total} />
                    </>
            }
        </div>
    }
    componentDidMount() {
        this.queryServer();
    }
    componentDidUpdate() {
        this.queryServer();
    }
}