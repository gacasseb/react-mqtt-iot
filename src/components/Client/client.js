import React, { Component } from 'react';

import { Modal, Input, Divider, Card, Button } from "antd";
import { EditOutlined, PoweroffOutlined, CloseOutlined, SettingOutlined } from '@ant-design/icons';

var mqtt = require('mqtt');

class Client extends Component {
    
    constructor(props) {
        
        super(props);

        this.state = {
            connected: false,
            isModalVisible: false,
            isEditModalVisibile: false,
            host : localStorage.getItem('host'),
            topic: localStorage.getItem('topic'),
            port: localStorage.getItem('port'),
            cardTitle: localStorage.getItem('cardTitle')
        }
    }

    componentDidMount() {
        if ( this.state.host && this.state.port ) {
            this.handleConnection()
        }
    }

    handleConnection = () => {

        if ( ! this.state.connected ) {

            this.client = mqtt.connect(`ws://${this.state.host}:${this.state.port}`);

            if ( this.client ) {
            
                this.client.on('connect', () => {
                    
                    this.setState({
                        connected:true
                    });
    
                    console.log('conectado');
                });
    
                this.client.on('disconnect', () => {
    
                    this.setState({
                        connected: false
                    })
                })
            }

        } else {

            this.client.end(true, null, () => {
                this.setState({connected: false});
            });            
        }
    }

    handleShowEditModal = () => {
        this.setState({isEditModalVisibile: true})
    }

    handleOkEditModal = () => {
        this.setState({isEditModalVisibile: false})

        localStorage.set("cardTitle", this.state.cardTitle);
    }

    handleCancelEditModal = () => {
        this.setState({isEditModalVisibile: false})
    }

    handleShowModal = () => {
        this.setState({isModalVisible: true});
    }

    handleCancel = () => {
        this.setState({isModalVisible: false});
    }
    
    handleOk = () => {

        this.setState({isModalVisible: false});
        this.handleConnection()

        localStorage.setItem("host", this.state.host);        
        localStorage.setItem("port", this.state.port);        
        localStorage.setItem("topic", this.state.topic);
    }

    handleHost = (event) => {
        this.setState({
            host: event.target.value
        })
    }

    handleTopic = (event) => {
        this.setState({
            topic: event.target.value
        })
    }

    handlePort = (event) => {
        this.setState({
            port: event.target.value
        })
    }

    handleTitle = (event) => {
        this.setState({
            cardTitle: event.target.value
        })
    }

    renderPublisher = () => {

        if ( this.state.connected ) {

            return <a>Publicar</a>
        }
    }

    render() { 
        return (
            <div>
                <Card
                    style={{width: 300}}
                    title = {this.state.cardTitle}
                    actions={
                        [
                        <Button type="link" onClick={this.handleShowModal} icon={<SettingOutlined />}></Button>,
                        <Button type="link" onClick={this.handleShowEditModal} icon={<EditOutlined />}></Button>,
                        // <Button type="link" icon={ <CloseOutlined /> }></Button>,
                        ]
                    }
                >
                    { this.renderPublisher() }
                </Card>
                <Modal visible={this.state.isModalVisible} onCancel={ this.handleCancel } onOk={ this.handleOk }>
                    <Input addonBefore="IP do Servidor Broker" placeholder={ this.state.host } onChange={this.handleHost} value={ this.state.host } style={{width: "80%"}}></Input>
                    <Divider></Divider>
                    <Input addonBefore="Porta" placeholder={ this.state.port } onChange={ this.handlePort } value={ this.state.port } style={{width: "80%"}}></Input>
                    <Divider></Divider>
                    <Input addonBefore="Tópico" placeholder={ this.state.topic } onChange={this.handleTopic} value={ this.state.topic } style={{width: "80%"}}></Input>
                </Modal>
                <Modal visible={this.state.isEditModalVisibile} onCancel={ this.handleCancelEditModal } onOk={ this.handleOkEditModal }>
                    <Input addonBefore="Nome do dispositivo" placeholder="Nome do card" onChange={this.handleTitle} value={ this.state.cardTitle } style={{width: "80%"}}></Input>
                </Modal>
            </div>
        );
    }
}
 
export default Client;