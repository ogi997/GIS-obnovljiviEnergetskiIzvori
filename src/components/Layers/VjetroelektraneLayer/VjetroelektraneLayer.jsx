import {Button, ToggleButton} from "react-bootstrap";
import ClipLoader from "react-spinners/ClipLoader";
import {Eye, Plus, VectorPen} from "react-bootstrap-icons";
import styled from "../../../pages/Map/LeftSidebar/style.module.css";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import React, {useEffect, useState} from "react";
import Tooltip from "react-bootstrap/Tooltip";
import {createVjetroString, editVjetroString, vjetroLayerDisabledString} from "../../../constant/constants";
import {useDispatch, useSelector} from "react-redux";
import {toggleCreateModel, toggleEditModel, setSelectedModel, getAll} from '../../../redux-store/modelsSlice';
import ownStyle from './style.module.css';
import {addLayer, removeLayer} from "../../../utils/LayerControl";
import {checkControlsIsActive, disableControls, enableControls} from "../../../utils/utils";
const VjetroelektraneLayer = ({map, setToastMessage}) => {
    const dispatch = useDispatch();
    const [toggleVjetro, setToggleVjetro] = useState(false);
    const {solarModels, windModels} = useSelector((state) => state.models);
    const { authenticated } = useSelector((state) => state.users);
    const renderTooltipVjetroCreate = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {!toggleVjetro ? vjetroLayerDisabledString : createVjetroString}
        </Tooltip>
    );
    const renderTooltipVjetroEdit = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {!toggleVjetro ? vjetroLayerDisabledString : editVjetroString }
        </Tooltip>
    );
    useEffect( () => {
        return () => {
            dispatch(setSelectedModel({modelType: 'windFarm'}));
            dispatch(toggleCreateModel({modelAction: 'SET_VALUE', modelValue: false}));
            dispatch(toggleEditModel({modelAction: 'SET_VALUE', modelValue: false}));
            removeLayer('windFarms', map);
            enableControls();
        }
    }, [dispatch, map]);
    const handleToggleVjetro = async () => {
        setToggleVjetro(prev => !prev);

        if(toggleVjetro) {
            dispatch(setSelectedModel({modelType: 'windFarm'}));
            dispatch(toggleCreateModel({modelAction: 'SET_VALUE', modelValue: false}));
            dispatch(toggleEditModel({modelAction: 'SET_VALUE', modelValue: false}));
        }

        if (!toggleVjetro) {
            dispatch(setSelectedModel({modelType: 'windFarm'}));
            const response = await dispatch(getAll({typeModel: 'windFarm' }));

            if (response.error) {
                setToggleVjetro(prev => !prev);
                setToastMessage("Vjetroelektrane", response.payload, "danger");
                return;
            }
            addLayer('windFarms', response.payload, map);
        }

        if (toggleVjetro) {
            removeLayer('windFarms', map);
        }
    };
    const handleCreateVjetro = () => {
        if(checkControlsIsActive())
            return;

        dispatch(setSelectedModel({modelType: 'solar'}));
        if (solarModels.create)
            dispatch(toggleCreateModel({modelAction: 'TOGGLE'}));

        if (solarModels.edit)
            dispatch(toggleEditModel({modelAction: 'TOGGLE'}));

        dispatch(setSelectedModel({modelType: 'windFarm'}));
        dispatch(toggleEditModel({modelAction: 'SET_VALUE', modelValue: false}));
        dispatch(toggleCreateModel({modelAction: 'TOGGLE'}));

        if (!windModels.create)
            disableControls();
        else
            enableControls();
    };
    const handleEditVjetro = () => {
        if (checkControlsIsActive())
            return;

        dispatch(setSelectedModel({modelType: 'solar'}));
        if (solarModels.create)
            dispatch(toggleCreateModel({modelAction: 'TOGGLE'}));

        if(solarModels.edit)
            dispatch(toggleEditModel({modelAction: 'TOGGLE'}));

        dispatch(setSelectedModel({modelType: 'windFarm'}));
        dispatch(toggleCreateModel({modelAction: 'SET_VALUE', modelValue: false}));
        dispatch(toggleEditModel({modelAction: 'TOGGLE'}));

        if (!windModels.edit)
            disableControls();
        else
            enableControls();
    };
    if(windModels.loading) {
        return (
          <>
             <ClipLoader color="#36d7b7" size={32} />
              <span className={ownStyle.marginLeft15}>Loading...</span>
          </>
        );
    }
    return (
      <>
          <ToggleButton data-cy-activevjetro onClick={handleToggleVjetro} variant={"link"} size={"sm"} value={""}
                        style={{padding: '0', borderRadius: '99px', marginRight: '10px'}}>
              <Eye className={styled.eyeAntenna}
                   style={!toggleVjetro ? {color: 'black'} : {color: 'white', backgroundColor: 'orange'}}/>
          </ToggleButton>

          <p className={styled.margbottom0}>Vjetroelektrane</p>

          <div style={{marginLeft: 'auto'}}>
              {authenticated &&
              <OverlayTrigger
                  placement="top"
                  overlay={renderTooltipVjetroCreate}
              >
                            <span className="d-inline-block">
                            <Button data-cy-createvjetro disabled={!toggleVjetro} onClick={handleCreateVjetro} variant={"link"} size={"sm"}
                                    style={{borderRadius: '99px', padding: '0'}}>
                              <Plus className={`${styled.widthHeight25} ${styled.whiteBackground}`}
                                    style={!windModels.create ? {color: 'black', backgroundColor: 'white'} : {
                                        color: 'white',
                                        backgroundColor: 'black'
                                    }}/>
                            </Button>
                            </span>
              </OverlayTrigger>
              }

              <OverlayTrigger
                  placement="top"
                  overlay={renderTooltipVjetroEdit}
              >
                            <span className="d-inline-block">
                              <Button data-cy-editvjetro disabled={!toggleVjetro} onClick={handleEditVjetro} variant={"link"} size={"sm"}
                                      style={{borderRadius: '99px', marginLeft: '3px', padding: '0'}}>
                                <VectorPen className={`${styled.widthHeight25} ${styled.whiteBackground}`}
                                           style={!windModels.edit ? {color: 'black', backgroundColor: 'white'} : {
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
export default VjetroelektraneLayer;
