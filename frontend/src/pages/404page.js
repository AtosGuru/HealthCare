import React, { Component } from 'react';

export default class NotFound extends Component {
    render(){
        return(
            <>
                <h1 className='m-5 text-danger'>404</h1>
                <h2 className="text-success">Not Found</h2>
            </>
        );
    }
}