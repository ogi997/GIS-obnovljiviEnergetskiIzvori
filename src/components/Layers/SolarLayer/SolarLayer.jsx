
//bootstrap & styles
import {Button, ToggleButton} from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import {Eye, Plus, VectorPen} from "react-bootstrap-icons";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import styled from "../../../pages/Map/LeftSidebar/style.module.css";
import ownStyled from './style.module.css';
//constants & redux
import {useDispatch, useSelector} from "react-redux";
import { toggleCreateModel, toggleEditModel, setSelectedModel, getAll } from '../../../redux-store/modelsSlice';
import {createSolarString, editSolarString, solarLayerDisabledString} from "../../../constant/constants";
import {addLayer, removeLayer} from "../../../utils/LayerControl";
import React, {useEffect, useState} from "react";
import {checkControlsIsActive, disableControls, enableControls} from "../../../utils/utils";
const SolarLayer = ({map, setToastMessage}) => {
    const dispatch = useDispatch();
    const [toggleSolar, setToggleSolar] = useState(false);

    const {solarModels, windModels} = useSelector((state) => state.models);
    const { authenticated } = useSelector((state) => state.users);

    const renderTooltipSolarCreate = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {!toggleSolar ? solarLayerDisabledString : createSolarString}
        </Tooltip>
    );
    const renderTooltipSolarEdit = (props) => (
        <Tooltip id={"button-tooltip"} {...props}>
            {!toggleSolar ? solarLayerDisabledString : editSolarString}
        </Tooltip>
    );
    useEffect( () => {
        return () => {
            dispatch(setSelectedModel({modelType: 'solar'}));
            dispatch(toggleCreateModel({modelAction: 'SET_VALUE', modelValue: false}));
            dispatch(toggleEditModel({modelAction: 'SET_VALUE', modelValue: false}));
            removeLayer('solarLayer', map);
        }
    }, [dispatch,map]);
    const handleToggleSolar = async () => {
        setToggleSolar(prev => !prev);

        if (toggleSolar) {
            dispatch(setSelectedModel({modelType: 'solar'}));
            dispatch(toggleCreateModel({modelAction: 'SET_VALUE', modelValue: false}));
            dispatch(toggleEditModel({modelAction: 'SET_VALUE', modelValue: false}));
        }

        if (!toggleSolar) {
            dispatch(setSelectedModel({modelType: 'solar'}));
            const response = await dispatch(getAll({typeModel: 'solar' }));

            if (response.error) {
                setToggleSolar(prev => !prev);
                setToastMessage("Solar panels", response.payload, "danger");
                return;
            }
            addLayer('solarLayer', response.payload, map);
        }

        if (toggleSolar) {
            removeLayer('solarLayer', map);
        }
    }
    const handleCreateSolar = () => {
        if (checkControlsIsActive())
            return;

        dispatch(setSelectedModel({modelType: 'windFarm'}));

        if (windModels.create)
            dispatch(toggleCreateModel({modelAction: 'TOGGLE'}));

        if(windModels.edit)
            dispatch(toggleEditModel({modelAction: 'TOGGLE'}));

        dispatch(setSelectedModel({modelType: 'solar'}));
        dispatch(toggleCreateModel({modelAction: 'TOGGLE'}));
        dispatch(toggleEditModel({modelAction: 'SET_VALUE', modelValue: false}));

        if (!solarModels.create)
            disableControls();
        else
            enableControls();

    }
    const handleEditSolar = () => {
        if (checkControlsIsActive())
            return;

        dispatch(setSelectedModel({modelType: 'windFarm'}));
        if(windModels.create)
            dispatch(toggleCreateModel({modelAction: 'TOGGLE'}));
        if(windModels.edit)
            dispatch(toggleEditModel({modelAction: 'TOGGLE'}));

        dispatch(setSelectedModel({modelType: 'solar'}));
        dispatch(toggleCreateModel({modelAction: 'SET_VALUE', setValue: false}));
        dispatch(toggleEditModel({modelAction: 'TOGGLE'}));

        if (!solarModels.edit)
            disableControls();
        else
            enableControls();
    };

    if(solarModels.loading) {
        return (
          <>
              <ClipLoader color="#36d7b7" size={32} />
              <span className={ownStyled.marginLeft15}>Loading...</span>
          </>
        );
    }
    return (
      <>
          <ToggleButton data-cy-activesolar variant={"link"} onClick={handleToggleSolar}
                        style={{padding: '0', borderRadius: '99px', marginRight: '10px'}} size={"sm"}
                        value={""}>
              <Eye className={styled.eyeAntenna}
                   style={!toggleSolar ? {color: 'black'} : {color: 'white', backgroundColor: 'orange'}}/>
          </ToggleButton>
          <p className={styled.margbottom0}>Solar panel</p>

          <div style={{marginLeft: 'auto'}}>
              {authenticated &&
              <OverlayTrigger
                  placement="top"
                  overlay={renderTooltipSolarCreate}
              >
                            <span className="d-inline-block">
                            <Button data-cy-createsolar disabled={!toggleSolar} onClick={handleCreateSolar} variant={"link"} size={"sm"}
                                    style={{borderRadius: '99px', padding: '0'}}>
                              <Plus className={`${styled.widthHeight25} ${styled.whiteBackground}`}
                                    style={!solarModels.create ? {color: 'black', backgroundColor: 'white'} : {
                                        color: 'white',
                                        backgroundColor: 'black'
                                    }}/>
                            </Button>
                            </span>
              </OverlayTrigger>
              }

              <OverlayTrigger
                  placement="top"
                  overlay={renderTooltipSolarEdit}
              >
                            <span className="d-inline-block">
                              <Button data-cy-editsolar disabled={!toggleSolar} onClick={handleEditSolar} variant={"link"} size={"sm"}
                                      style={{borderRadius: '99px', marginLeft: '3px', padding: '0'}}>
                                <VectorPen className={`${styled.widthHeight25} ${styled.whiteBackground}`}
                                           style={!solarModels.edit ? {color: 'black', backgroundColor: 'white'} : {
                                               color: 'white',
                                               backgroundColor: 'black'
                                           }}/>
                              </Button>
                            </span>
              </OverlayTrigger>
          </div>
      </>
    );
}

export default SolarLayer;
