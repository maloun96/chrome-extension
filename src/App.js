import React, { Component } from 'react';
import './App.css';
import CurrencyFormat from 'react-currency-format';
import {WEBSITE_URL} from "./constants";
import * as StorageService from "./storage.service";
import axios from "axios";

const Image = ({image, removeImage}) => (
    <div className="image">
        <img src={image} />
        <span onClick={() => removeImage(image)}>Remove</span>
    </div>
);

const Errors = ({errors}) => (
    <div className="alert alert-danger" role="alert">
        {console.log('errors', errors)}
        {errors.map((error) => (
            <p>{error}</p>
        ))}
    </div>
);

const Success = ({url}) => (
    <div className="alert alert-success" role="alert">
        Product saved successfully. You can check it <a href={url} target="_blank">here</a>
    </div>
);

const DEFAULT_STATE = {
    form: {
        product_name: '',
        brand: '',
        list_price: '',
        net_price: '',
        collection: '',
        height: '',
        width: '',
        weight: '',
        depth: '',
        description: '',
        dimensions_unit: '',
        dimensions: '',
        minimum_order_quantity: '',
        sku: ''
    },
    success: false,
    errors: [],
    productUrl: ''
};

class App extends Component {

    constructor(props) {
        super(props);

        this.state = DEFAULT_STATE;

        this.handleChange = this.handleChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    handleChange(event) {
        let form = {
            ...this.state.form,
            [event.target.name]: event.target.value
        }
        this.setState({ form });
    }

    handleCurrencyChange(input, value) {
        let form = {
            ...this.state.form,
            [input]: value
        }
        this.setState({ form });
    }

    onSubmit(e) {
        e.preventDefault();

        StorageService.get('accessToken', (accessToken) => {
            var config = {
                headers: { 'Authorization': `Bearer ${accessToken}` }
            };
            const data = {
                ...this.state.form,
                image: this.props.images,
            };
            axios.post(`${WEBSITE_URL}/products/add-external`, data, config).then((res) => {
                this.props.removeImages();
                this.setState({
                    form: DEFAULT_STATE.form,
                    productUrl: res.data.url,
                    success: true,
                    errors: []
                });
            }).catch((err) => {
                if (err.response.status === 422) {
                    this.setState({errors: err.response.data.error, success: false});
                }
            })
        });

    }

    render() {
        const {images, removeImage} = this.props;
        const {
            product_name,
            brand,
            list_price,
            net_price,
            collection,
            height,
            width,
            weight,
            depth,
            description,
            dimensions_unit,
            dimensions,
            minimum_order_quantity,
            sku
        } = this.state.form;

        const {success, productUrl, errors} = this.state;
        return (
          <div className="App" onSubmit={this.onSubmit}>
              <form>
                  {images.map((image) => <Image image={image} removeImage={removeImage}/>)}
                  <div className="form-group">
                      <label htmlFor="product_name">Product Name</label>
                      <input type="text" name="product_name" value={product_name} onChange={this.handleChange} className="form-control" placeholder="Product name" />
                  </div>
                  <div className="form-group">
                      <label htmlFor="brand">Product Name</label>
                      <input type="text" name="brand" value={brand} onChange={this.handleChange} className="form-control" placeholder="Brand" />
                  </div>
                  <div className="form-group">
                      <label htmlFor="list_price">List Price</label>
                      <CurrencyFormat value={list_price} name="list_price" className="form-control" decimalScale={2} thousandSeparator={true} prefix={'$'} onValueChange={(values) => this.handleCurrencyChange('list_price', values.value)}/>
                  </div>
                  <div className="form-group">
                      <label htmlFor="net_price">Net Price</label>
                      <CurrencyFormat value={net_price} name="net_price" className="form-control" decimalScale={2} thousandSeparator={true} prefix={'$'} onValueChange={(values) => this.handleCurrencyChange('net_price', values.value)}/>
                  </div>
                  <div className="form-group">
                      <label htmlFor="collection">Collection</label>
                      <input type="text" name="collection" value={collection} onChange={this.handleChange} className="form-control" placeholder="Collection" />
                  </div>
                  <div className="form-group">
                      <label htmlFor="height">Height</label>
                      <input type="text" name="height" value={height} onChange={this.handleChange} className="form-control" placeholder="Height" />
                  </div>
                  <div className="form-group">
                      <label htmlFor="width">Width</label>
                      <input type="text" name="width" value={width} onChange={this.handleChange} className="form-control" placeholder="Width" />
                  </div>
                  <div className="form-group">
                      <label htmlFor="weight">Weight</label>
                      <input type="text" name="weight" value={weight} onChange={this.handleChange} className="form-control" placeholder="Weight" />
                  </div>
                  <div className="form-group">
                      <label htmlFor="depth">Depth</label>
                      <input type="text" name="depth" value={depth} onChange={this.handleChange} className="form-control" placeholder="Depth" />
                  </div>
                  <div className="form-group">
                      <label htmlFor="description">Description</label>
                      <input type="text" name="description" value={description} onChange={this.handleChange} className="form-control" placeholder="Description" />
                  </div>
                  <div className="form-group" >
                      <label htmlFor="dimensions_unit">Dimensions Units</label>
                      <select name="dimensions_unit" className="form-control" value={dimensions_unit} onChange={this.handleChange}>
                          <option value="FT">FT</option>
                          <option value="MM">MM</option>
                          <option value="M">M</option>
                          <option value="CM">CM</option>
                      </select>
                  </div>
                  <div className="form-group" >
                      <label htmlFor="dimensions">Dimensions</label>
                      <input type="text" name="dimensions" value={dimensions} onChange={this.handleChange} className="form-control" placeholder="Dimensions" />
                  </div>
                  <div className="form-group">
                      <label htmlFor="minimum_order_quantity">Minim Order Quantity</label>
                      <input type="number" name="minimum_order_quantity" value={minimum_order_quantity} onChange={this.handleChange} className="form-control" placeholder="Minim Order Quantity" />
                  </div>
                  <div className="form-group">
                      <label htmlFor="sku">SKU</label>
                      <input type="text" name="sku" value={sku} onChange={this.handleChange} className="form-control" placeholder="SKU" />
                  </div>
                  {success ? <Success url={productUrl} /> : null }
                  {errors.length > 0 ? <Errors errors={errors} /> : null }
                  <button type="submit" className="btn btn-primary">Submit</button>
              </form>
          </div>
        );
  }
}

export default App;
