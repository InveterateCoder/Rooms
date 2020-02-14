import React, { Component } from "react";
import Loading from "react-loading";
import { Paginator } from "./accessories/Lobby/Paginator";
import { Presenter } from "./accessories/Lobby/Presenter";
import rooms from "../data/rooms.json";

export class Lobby extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: null,
            total: null,
            list: null
        }
    }
    queryServer(request) {
        return {
            list: rooms,
            page: Number(request.request),
            total: 250
        }
    }
    render() {
        return <div id="lobby" className="container-fluid">
            {
                this.props.match.params.page && Number(this.props.match.params.page) !== this.state.page
                    ?   <Loading id="spinner" type="spinningBubbles" color="#17a2b8" width="100px"/>
                    :   <>
                            <Presenter list={this.state.list} />
                            <Paginator base="/lobby/" q={this.props.location.search}
                                page={this.state.page} total={this.state.total} />
                        </>
            }
        </div>
    }
    componentDidMount() {
        let data = this.queryServer({ request: this.props.match.params.page || 1 });
        this.setState({
            page: data.page,
            total: data.total,
            list: data.list
        });
    }
    componentDidUpdate() {
        let page = Number(this.props.match.params.page);
        if (!isNaN(page) && page !== this.state.page) {
            let data = this.queryServer({ request: page });
            this.setState({
                page: data.page,
                total: data.total,
                list: data.list
            })
        }
    }
}