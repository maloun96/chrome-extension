/*global chrome*/
/* src/content.js */
import React from 'react';
import ReactDOM from 'react-dom';
import Frame, { FrameContextConsumer }from 'react-frame-component';
import "./content.css";
import App from "./App";
import Login from "./Login";
import * as StorageService from "./storage.service";
import axios from "axios";
import {WEBSITE_URL} from "./constants";

class Main extends React.Component {

    constructor() {
        super();
        window.mainComponent = this;

        this.state = {
            logged: false,
            images: []
        };

        this.onSuccessLoggedIn = this.onSuccessLoggedIn.bind(this);
        this.checkComponent = this.checkComponent.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.removeImages = this.removeImages.bind(this);
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => this.checkComponent(request.data));
    }

    /**
     * Everytime when component is showing than check if user is logged in and get images from store
     * @param data
     */
    checkComponent(data) {
        StorageService.get('accessToken', (accessToken) => {
            var config = {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            };

            axios.get(`${WEBSITE_URL}/auth/user`, config).then((response) => {
                this.setState({logged: true})

                // Check if exist images than add it, otherwise get all images
                data ? this.addImage(data) : this.getImages();

            }).catch((err) => {
                console.log(JSON.stringify(err));
                this.setState({logged: false})
            });
        });
    }

    /**
     * Add image to storage
     * @param image
     */
    addImage(image) {
        StorageService.get('images', (images) => {
            if (!images) images = [];

            if (!images.includes(image))
                images.push(image);

            StorageService.set({images}, () => { this.getImages() });
        });
    }

    /**
     * Remove image from storage
     * @param image
     */
    removeImage(image) {
        StorageService.get('images', (images) => {
            if (!images) return;
            const filteredImages = images.filter((i) => i !== image);
            StorageService.set({images: filteredImages}, () => { this.getImages() });
        });
    }

    /**
     * Remove all images from storage
     */
    removeImages() {
        StorageService.set({images: []}, () => { this.getImages() });
    }

    /**
     * Get all images from storage
     */
    getImages() {
        StorageService.get('images', (images) => {
            this.setState({images});
        });
    }

    componentDidMount() {
        StorageService.get('accessToken', (accessToken) => {
            this.setState({logged: accessToken && accessToken !== 'undefined'})
        });
    }

    onSuccessLoggedIn(accessToken) {
        StorageService.set({accessToken}, () => { this.setState({logged: true}) });
    }

    hideExtension() {
        document.getElementById('my-extension-root').style.display = 'none';
    }

    render() {
        const {logged} = this.state;
        return (
            <Frame head={[<link type="text/css" rel="stylesheet" href={chrome.runtime.getURL("/static/css/content.css")} ></link>]}>
               <FrameContextConsumer>
               {
               // Callback is invoked with iframe's window and document instances
                   ({document, window}) => {
                      // Render Children
                        return (
                           <div className={'my-extension'}>
                               <p className='close' onClick={this.hideExtension}>X</p>
                               <img src={'https://steelyardaccess.com/assets/img/steelyard-logo-gray.jpg'} className="App-logo"/>
                               {logged ?
                                   <App
                                       images={this.state.images}
                                       removeImage={this.removeImage}
                                       removeImages={this.removeImages}
                                   /> :
                                   <Login onSuccess={this.onSuccessLoggedIn} />
                               }
                           </div>
                        )
                    }
                }
                </FrameContextConsumer>
            </Frame>
        )
    }
}

const app = document.createElement('div');
app.id = "my-extension-root";

document.body.appendChild(app);
ReactDOM.render(<Main />, app);

app.style.display = "none";

chrome.runtime.onMessage.addListener(
   function(request, sender, sendResponse) {
      if( request.message === "clicked_browser_action") {
        toggle();
      }
      if( request.message === "clicked_event_action") {
          show();
      }
   }
);

function show() {
    app.style.display = "block";
    window.mainComponent.checkComponent();
}

function hide() {
    app.style.display = "none";
}

function toggle(){
    app.style.display === "none" ? show() : hide();
}
