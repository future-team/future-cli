import React, { Component ,PropTypes} from 'react';
import {Grid,Row,Col,Panel,PanelHeader,PanelContent,PanelFooter,ValidatorPanel,Input,FormGroup,Button,Dialog} from 'eagle-ui';

import {bindingMixin} from 'eg-tools';

import SuccessDialog from './SuccessDialog.jsx';

import './Msg.less';

/***
 *
 * 留言表单
 */
@bindingMixin
export default class Msg extends Component {
    constructor(props) {

        super(props);

        this.rules = {
            username:{
                required:true
            },
            email:{
                email:true,
                required:true
            },
            content:{
                required:true,
                minlength:{
                    params:10
                },
                maxlength:{
                    params:250
                }
            }
        };
        this.setBinding('msg');
    }

    static defaultProps={

    };

    onChangeHandler(e){
        this.manualChange(e.target.name,e.target.value);
    }

    submitHandler(){
        this.props.save(()=>{
            Dialog.mask('msg-success')
        });

        return false;
    }

    render() {
        const {msg} = this.props;
        return (
            <div>

            </div>
        );
    }
}