//bootstrap components
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import ModalHeader from 'react-bootstrap/ModalHeader';
import ModalBody from 'react-bootstrap/ModalBody';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

//hooks & form
import { useForm } from "react-hook-form";
import mapboxgl from 'mapbox-gl';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';


const Layer = ({ showModal, handleModalClose, map, toggleLayer }) => {

  const { register, formState: { errors }, handleSubmit, reset } = useForm();
  const [layerCounter, setLayerCounter] = useState(0);
  const dispatch = useDispatch();



  useEffect(() => {
    if (showModal) {
      reset();
    }
  }, [showModal, reset]);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

  const isGeoJSONUrl = (url) => {
    return url.endsWith('.geojson');
  }

  const responseStatus = (e, response) => {
    if (response.status === 200) handleModalClose();
    e.target.reset();
  }
  

  function addPolygon(geometryType, geojson, layerCounter) {

    const sourceId = `urban-areas-${layerCounter}`;
    const layerId = `urban-areas-fill-${layerCounter}`;

    map.current.addSource(sourceId, {
      type: 'geojson',
      data: geojson
    });

    map.current.addLayer({
      'id': layerId,
      'type': 'fill',
      'source': sourceId,
      'layout': {
        'visibility': 'none'
      },
      'paint': {
        'fill-color': '#f08',
        'fill-opacity': 0.4
      }
    });

    setLayerCounter(layerCounter + 1);
    toggleLayer(layerId);



    // fly to the polygon
    const bounds = new mapboxgl.LngLatBounds();
    geojson.features[0].geometry.coordinates[0].forEach(coord => {
      bounds.extend(coord);
    });

    map.current.flyTo({ center: bounds.getCenter(), zoom: 8.5 });
  }

  function addPoints(geometryType, geojson, layerCounter) {

    const sourceId = `airports-${layerCounter}`;
    const layerId = `airports-points-${layerCounter}`;

    map.current.addSource(sourceId, {
      type: 'geojson',
      data: geojson
    });

    map.current.addLayer({
      'id': layerId,
      'type': 'circle',
      'source': sourceId,
      'layout': {
        'visibility': 'visible'
      },
      'paint': {
        'circle-radius': 6,
        'circle-stroke-width': 4,
        'circle-color': 'red',
        'circle-stroke-color': 'white'
      },
      'filter': ['==', '$type', 'Point']
    });

    map.current.setZoom(3.65);
    setLayerCounter(layerCounter + 1);


  }

  const onSubmit = async (data, e) => {
    try {
      const response = await fetch(data.url);
      responseStatus(e, response);

      const geojson = await response.json();
      const geometryType = geojson.features[0].geometry.type;

      if (geometryType === 'Polygon' || geometryType === 'MultiPolygon') {

        addPolygon(geometryType, geojson, layerCounter);

        const layerId = `urban-areas-fill-${layerCounter}`;
        const sourceId = `urban-areas-${layerCounter}`;


        dispatch({
          type: 'ADD_TEMPORARY_LAYER',
          payload: {
            id: layerId,
            sourceId: sourceId,
            visibility: 'none',
            title: `GeoJSON`,
            isVisible: false,
          },
        });

      } else if (geometryType === 'Point' || geometryType === 'MultiPoint') {

        addPoints(geometryType, geojson, layerCounter);

        const layerId = `airports-points-${layerCounter}`;
        const sourceId = `airports-${layerCounter}`;

        dispatch({
          type: 'ADD_TEMPORARY_LAYER',
          payload: {
            id: layerId,
            sourceId: sourceId,
            visibility: 'visible',
            title: `GeoJSON`,
            isVisible: false,
          },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div>
      <Modal size="lg" centered show={showModal} onHide={handleModalClose}>
        <ModalHeader closeButton>
          <Modal.Title id='contained-modal-title-vcenter'>
            Add layer from URL
          </Modal.Title>
        </ModalHeader>
        <ModalBody>
          <Container>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <Row className='d-flex justify-content-center align-items-center my-4'>
                <Col md={7}>
                  <Form.Group controlId='url' >
                    <Form.Control {...register("url", {
                      required: true,
                      validate: (value) => {
                        return validateUrl(value) && isGeoJSONUrl(value);
                      }
                    })} placeholder='https://' type='text' />

                  </Form.Group>
                </Col>
                <Col md={5}>
                  <Button type="submit">Save</Button>
                </Col>
              </Row>
              {errors.url && errors.url.type === "required" && <p className="text-danger">This field is required</p>}
              {errors.url && errors.url.type === "validate" && <p className="text-danger">Invalid URL</p>}
            </Form>
          </Container>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Layer;
