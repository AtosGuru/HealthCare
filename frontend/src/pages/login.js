import React,{Component} from 'react';
import './../css/App.css';
import {Row,Col,Container,Form,Button} from 'react-bootstrap'
import axios from './../config/server.config';
import {
  setToken
} from './../store/Actions/BasicAction';
import {connect} from 'react-redux'
import toastr from 'toastr'
import 'toastr/build/toastr.min.css'
import { MDBContainer,  MDBCard,MDBCardBody,MDBCardImage,MDBRow,MDBCol,MDBIcon,MDBInput,MDBBtn } from 'mdb-react-ui-kit';


class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:'',
        };
    }

    onChangeValue = (target,e) =>{
        this.setState({
            ...this.state,
            [target]:e.target.value
        });      
    }
    keypress = (e) =>{
        console.log(e);
        if(e.key == "Enter"){
            this.onLogin();
        }
    }
    onLogin = () =>{
        const _self = this;
        axios.post('basic/login',{...this.state})
        .then(function(response){
            if(response.data.state == "wrong"){
                _self.setState({
                    email:'',
                    password:'',
                });

                toastr.options = {
                  positionClass : 'toast-top-full-width',
                  hideDuration: 300,
                  timeOut: 3000
                }
                toastr.clear()
                setTimeout(() => toastr.info('wrong password!'), 300)

            }else{
                _self.props.setToken(response.data);
            }
        });
    }

    render(){
        return(
					<div className="login-wrapper">
							<MDBContainer className='m-auto'>
								<MDBCard background='success' >
										<MDBRow className='g-0'>
												<MDBCol md='6'>
													<MDBCardImage src='login.png' className=' rounded-start w-100 h-100'/>
												</MDBCol>
												<MDBCol md='6'>
														<MDBCardBody className='d-flex flex-column'>
																<div className='d-flex flex-row mt-2'>
																		<MDBCardImage src='logo-rated.png' className='h-10'></MDBCardImage>
																</div>
																<h5 className="fw-normal my-4 pb-3" style={{letterSpacing: '1px'}}>Sign into your account</h5>
																<MDBInput wrapperClass='mb-4' label='Email address' id='formControlLg' type='email' size="lg" value={this.state.email} onChange={(e) => this.onChangeValue('email',e)}/>
																<MDBInput wrapperClass='mb-4' type="password" label='Password' id='formControlLg' size="lg" value={this.state.password} onKeyUpCapture={(e) =>this.keypress(e)} onChange={(e) => this.onChangeValue('password',e)}/>
																<MDBBtn className="mb-4 px-5" color="primary" size='lg' onClick={() =>this.onLogin()}>Login</MDBBtn>
														</MDBCardBody>
												</MDBCol>
										</MDBRow>
								</MDBCard>
						</MDBContainer>
					</div>
        )
    }
  }


  const mapDispatchToProps = (dispatch) => ({
    setToken:(data) =>dispatch(setToken(data)),
});

  export default connect(null,mapDispatchToProps)(Login)