//styles & state
import styled from './style.module.css';
import React, { useEffect, useState } from 'react';
import {
  Layers, ChevronDoubleLeft, ChevronDoubleDown, ArrowUpShort, FileEarmarkText,
  Sliders2, Eye, ArrowDownShort, Plus, EyeSlash, Trash
} from 'react-bootstrap-icons';
import Logo from '../../../assets/logo.jpg';
import { OverlayTrigger, Tooltip, Button } from 'react-bootstrap';


//components & redux
import SolarLayer from "../../../components/Layers/SolarLayer/SolarLayer";
import VjetroelektraneLayer from "../../../components/Layers/VjetroelektraneLayer/VjetroelektraneLayer";
import SolarModal from "../../../components/Modal/SolarModal/SolarModal";
import Layer from "../../../components/Modal/LayerModal/Layer";
import VjetroelektraneModal from "../../../components/Modal/VjetroelektraneModal/VjetroelektraneModal";
import { useDispatch, useSelector } from "react-redux";
import { getEntiteti, getKantoni, getZone } from "../../../redux-store/utils";
import ToastMessage from "../../../components/ToastMessage/ToastMessage";
import { getModel } from "../../../redux-store/modelsSlice";
import ImportShapeFile from "../../../components/Layers/ImportShapeFile/ImportShapeFile";
import {deleteTemporaryLayer} from '../../../redux-store/testslice';


const LeftSidebar = ({ map }) => {

  const [isMenuHidden, setIsMenuHidden] = useState(false);
  const [isArrowHidden1, setIsArrowHidden1] = useState(false);
  const [isArrowHidden2, setIsArrowHidden2] = useState(true);
  const [showSolarModal, setShowSolarModal] = useState(false);
  const [showVjetroModal, setShowVjetroModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [idData, setIdData] = useState(null);
  const [idData2, setIdData2] = useState(null);
  const [activeIcon, setActiveIcon] = useState(null);


  const [isSliders1Clicked, setIsSliders1Clicked] = useState(false);
  const [isSliders2Clicked, setIsSliders2Clicked] = useState(false);
  const [isSliders3Clicked, setIsSliders3Clicked] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [headerToast, setHeaderToast] = useState('');
  const [bodyToast, setBodyToast] = useState('');
  const [variant, setVariant] = useState('');
  const setToastMessage = (header, body, alert) => {
    setHeaderToast(header);
    setBodyToast(body);
    setVariant(alert);
    setShowToast(true);
  };

  const renderTooltipTempLayerAdd = (props) => (
    <Tooltip id="add-layer-tooltip" {...props}>
      New layer
    </Tooltip>

  );

  const dispatch = useDispatch();

  const toggleLayer = (layerId) => {
    const layer = map.current.getStyle().layers.find(layer => layer.id === layerId);

    if (layer) {
      const visibility = map.current.getLayoutProperty(layerId, 'visibility');
      map.current.setLayoutProperty(layerId, 'visibility', visibility === 'none' ? 'visible' : 'none');
    }
  };
  


  const deleteLayer = (layerId) => {
    dispatch(deleteTemporaryLayer(layerId));
  
    const layer = map.current.getLayer(layerId);
    const sourceId = layer?.source;
    if (layer) map.current.removeLayer(layerId);
    if (sourceId) map.current.removeSource(sourceId);
  };



  const handleLayersClick1 = () => {
    setActiveIcon('layers');
    setIsSliders1Clicked(true);
    setIsSliders2Clicked(false);
    setIsSliders3Clicked(false);
  }

  const handleLayersClick2 = () => {
    setActiveIcon('sliders2');
    setIsSliders1Clicked(false);
    setIsSliders3Clicked(false);
    setIsSliders2Clicked(true);
  }

  const handleLayersClick3 = () => {
    setActiveIcon("importShapeFile");
    setIsSliders1Clicked(false);
    setIsSliders2Clicked(false);
    setIsSliders3Clicked(true);
    
  }

  const handleEyeClick = (layerId) => {
    const visibility = map.current.getLayoutProperty(layerId, 'visibility');
    dispatch({
      type: 'CHANGE_VISIBLE',
      payload: {
        id: layerId,
        visible: !(visibility === 'none'),
      },
    });
  };

  const handleToggleMenu = () => {
  setIsMenuHidden(!isMenuHidden);
  setActiveIcon('layers');
  setIsSliders1Clicked(true);
  setIsSliders2Clicked(false);
  setIsSliders3Clicked(false);
  };

  const handleModalOpen = () => {
    setShowModal(true);

  };

  const handleModalClose = () => {
    setShowModal(false);
  };
  
  const handleToggleArrow = (id) => {
    if (id === 1) setIsArrowHidden1(prevState => !prevState);
    else if (id === 2) setIsArrowHidden2(prevState => !prevState);
  };
  
  const { solarModels, windModels } = useSelector((state) => state.models);
  const { authenticated } = useSelector((state) => state.users);
  const [coordinate, setCoordinate] = useState({});
  const {temporaryLayers} = useSelector(state => state.temporaryLayers);



  useEffect(() => {
    dispatch(getEntiteti());
    dispatch(getZone());
    dispatch(getKantoni());
  }, [dispatch]);

  useEffect(() => {
    if (!map.current) return;
    const mapClickListener = (e) => {
      if (solarModels.create) setShowSolarModal(true);
      else if (windModels.create) setShowVjetroModal(true);
      setCoordinate(e.lngLat);
    }
    map.current.on('click', mapClickListener);
    const currentMap = map.current; 
    return () => currentMap.off('click', mapClickListener); 
  }, [solarModels.create, windModels.create, map]);


  useEffect(() => {
  if (map.current) {
    map.current.getCanvas().style.cursor = (windModels.create || solarModels.create) ? "crosshair" : "";
  }
}, [solarModels.create, windModels.create, map]);


useEffect(() => {
  const pointClick = async (e) => {
    const features = map.current.queryRenderedFeatures(e.point, {
      layers: ['windFarms'],
    });
    const id = features[0].id;

    setShowVjetroModal(true);
    const res = await dispatch(getModel({ value: id, type: 'windFarm' }));
    if (res.error) {
      setToastMessage("Vjetroelektrane", res.payload, "danger");
      setIdData(null);
      setShowVjetroModal(false);
      return;
    }
    setIdData(res.payload);
  };
  const setPointer = () => {
    map.current.getCanvas().style.cursor = 'pointer';
  };
  const unsetPointer = () => {
    map.current.getCanvas().style.cursor = '';
  };
  if (windModels.edit) {
    map.current.on('click', 'windFarms', pointClick);
    map.current.on('mouseenter', 'windFarms', setPointer);
    map.current.on('mouseleave', 'windFarms', unsetPointer);
  }
  const mapCurrent = map.current;
  return () => {
    setIdData(null);
    if (!mapCurrent) return;
    mapCurrent.off('click', 'windFarms', pointClick);
    mapCurrent.off('mouseenter', 'windFarms', setPointer);
    mapCurrent.off('mouseleave', 'windFarms', unsetPointer);
  }
}, [windModels.edit, map, dispatch]);
useEffect(() => {
  const pointClick = async (e) => {
    const features = map.current.queryRenderedFeatures(e.point, {
      layers: ['solarLayer'],
    });
    const id = features[0].id;

    setShowSolarModal(true);
    const res = await dispatch(getModel({ value: id, type: 'solar' }));
    if (res.error) {
      setToastMessage("Solar panels", res.payload, "danger");
      setIdData2(null);
      setShowSolarModal(false);
      return;
    }

    setIdData2(res.payload);
  };

  const setPointer = () => {
    map.current.getCanvas().style.cursor = 'pointer';
  };
  const unsetPointer = () => {
    map.current.getCanvas().style.cursor = '';
  };
  if (solarModels.edit) {
    map.current.on('click', 'solarLayer', pointClick);
    map.current.on('mouseenter', 'solarLayer', setPointer);
    map.current.on('mouseleave', 'solarLayer', unsetPointer);
  }
  const mapCurrent = map.current;

  return () => {
    setIdData2(null);
    if (!mapCurrent) return;
    mapCurrent.off('click', 'solarLayer', pointClick);
    mapCurrent.off('mouseenter', 'solarLayer', setPointer);
    mapCurrent.off('mouseleave', 'solarLayer', unsetPointer);
  }
}, [solarModels.edit, map, dispatch]);
const toggleEye = (layer) => {
  handleEyeClick(layer.id);
  toggleLayer(layer.id);
}

  return (
    <>
      <div className={styled.leftSide}>
        <div onClick={handleToggleMenu} className={styled.logoIcon} style={{ cursor: 'pointer' }}>
          <img style={{ height: "40px", width: "80px" }} src={Logo} alt="Logo" />

          {isMenuHidden ? (
            <ChevronDoubleDown />
          ) : (
            <ChevronDoubleLeft />
          )}
        </div>

        {isMenuHidden && (
          <>
            <div className={styled.menuBelow}>
              <p style={{ textAlign: 'center', fontSize: '20px', paddingTop: '10px' }}>Map</p>

              <div className={styled.icons}>
                <Layers
                  className={activeIcon === 'layers' ? styled.activeIcon : ''} style={{ cursor: "pointer" }}
                  onClick={handleLayersClick1}
                  data-cy="energy_tab"
                />
                <Sliders2
                  className={activeIcon === 'sliders2' ? styled.activeIcon : ''} style={{ cursor: "pointer" }}
                  onClick={handleLayersClick2}
                  data-cy="temporary_tab"
                />
                {authenticated && <FileEarmarkText
                  className={activeIcon === 'importShapeFile' ? styled.activeIcon : ''} style={{ cursor: 'pointer' }}
                  onClick={handleLayersClick3}
                  data-cy="import_shapefile"
                />}
              </div>
            </div>
            {
              isSliders3Clicked && (
                <ImportShapeFile
                    isSliders3Clicked={isSliders3Clicked}
                    setToastMessage={setToastMessage}
                />
              )
            }

            {isSliders2Clicked && (
              <div data-cy="temporary" onClick={() => handleToggleArrow(1)} style={{ cursor: 'pointer' }} className={styled.infrastructure}>
                <Eye className={styled.eye} style={isArrowHidden1 ? {
                  backgroundColor: 'orange',
                  color: 'white'
                } : { backgroundColor: "transparent" }} />
                <p className={styled.margbottom0}>Temporary layers</p>

                {isArrowHidden1 ?
                  (<ArrowUpShort style={{ marginLeft: 'auto' }}
                    className={`${styled.widthHeight25} ${styled.whiteBackground}`} />)
                  :
                  (<ArrowDownShort style={{ marginLeft: 'auto' }}
                    className={`${styled.widthHeight25} ${styled.whiteBackground}`} />)
                }
              </div>
            )}
            {isArrowHidden1 && isSliders2Clicked && (

              <div className={styled.antenaBase}>

                <div className={styled.layer}>
                  <p className={`${styled.margbottom0} ${styled.layerText}`}>Add layer</p>

                  <div style={{ marginLeft: 'auto' }}>
                    <OverlayTrigger placement="top" overlay={renderTooltipTempLayerAdd}>
                      <span className="d-inline-block">
                        <Button onClick={handleModalOpen} size="sm" style={{ borderRadius: '99px', padding: '0' }} variant="link">
                          <Plus data-cy="temp_add" style={{ backgroundColor: "white", color: 'black', borderRadius: "50px", width: "25px", height: "25px", cursor: "pointer" }} />
                        </Button>
                      </span>
                    </OverlayTrigger>
                  </div>
                </div>

                <div className={styled.scrollbar}>
                {temporaryLayers.map(layer => (
                  <div key={layer.id} className={styled.addedLayers}>
                    <span>{layer.title}</span>
                    {!layer.isVisible ? (
                      <Eye data-cy="temp_eye" className={styled.eyeIcon} onClick={() => toggleEye(layer)} />
                    ) : (
                      <EyeSlash className={styled.eyeSlashIcon} onClick={() => toggleEye(layer)} />
                    )}
                    <Trash data-cy="temp_delete" className={styled.trashIcon} onClick={() => deleteLayer(layer.id)}/> 
                  </div>
                ))}
                </div>
              </div>
            )}

            {isSliders1Clicked && (
              <div data-cy="energy" onClick={() => handleToggleArrow(2)} style={{ cursor: 'pointer' }} className={styled.infrastructure}>
                <Eye className={styled.eye} style={isArrowHidden2 ? {
                  backgroundColor: 'orange',
                  color: 'white'
                } : { backgroundColor: "transparent" }} />
                <p className={styled.margbottom0}>Energy resources</p>

                {isArrowHidden2 ?
                  (<ArrowUpShort style={{ marginLeft: 'auto' }}
                    className={`${styled.widthHeight25} ${styled.whiteBackground}`} />)
                  :
                  (<ArrowDownShort style={{ marginLeft: 'auto' }}
                    className={`${styled.widthHeight25} ${styled.whiteBackground}`} />)
                }
              </div>)}


            {isArrowHidden2 && isSliders1Clicked && (


              <div className={styled.antenaBase}>


                <div className={styled.antenna}>
                  <SolarLayer
                    map={map}
                    setToastMessage={setToastMessage}
                  />
                </div>

                <div className={styled.base}>
                  <VjetroelektraneLayer
                    map={map}
                    setToastMessage={setToastMessage}
                  />
                </div>
              </div>

            )}

          </>
        )}
      </div>

      <Layer toggleLayer={toggleLayer} showModal={showModal}
        handleModalClose={handleModalClose}
        map={map} />


      {showSolarModal && <SolarModal
        show={showSolarModal}
        onHide={() => setShowSolarModal(false)}
        idData2={idData2}
        setIdData2={setIdData2}
        coordinates={coordinate}
        map={map}
        setToastMessage={setToastMessage}
      />}

      {showVjetroModal && <VjetroelektraneModal
        show={showVjetroModal}
        onHide={() => setShowVjetroModal(false)}
        coordinates={coordinate}
        map={map}
        idData={idData}
        setIdData={setIdData}
        setToastMessage={setToastMessage}
      />}

      {showToast && <ToastMessage header={headerToast} body={bodyToast} show={showToast} variant={variant} setShow={setShowToast} />}
    </>
  );

};
export default LeftSidebar;
