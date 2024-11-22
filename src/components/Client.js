import React, { Component } from 'react';
import Avatar from 'react-avatar';
import "core-js-pure/stable/object/assign";


const Client = ({ username }) => {
    return (
        <div className="client">
            <Avatar name={username} size={50} round="14px" />
            <span className="userName">{username}</span>
        </div>
    );
};

export default Client;
