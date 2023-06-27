import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {addModel, deleteModel, getAll, updateModel} from "../../../redux-store/modelsSlice";
import {setFormData} from "./utilsSolar";
import {addLayer, removeLayer} from "../../../utils/LayerControl";
import {useForm} from "react-hook-form";
import styled from "../VjetroelektraneModal/style.module.css";
import BeatLoader from "react-spinners/BeatLoader";
import {patchCanton} from '../../../api/solarPanels.service';
const SolarModal = ({show, onHide,map, idData2, setIdData2, coordinates, setToastMessage}) => {

    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();

    const [isDisabled, setIsDisabled] = useState(false);
    const [isDisabledDelete, setIsDisabledDelete] = useState(false);
    const [showKanton, setShowKanton] = useState(false);
    const [coords, setCoords] = useState(null);

    useEffect(() => {
        const subscription = watch((value) => {
            setShowKanton(value.entity === 'FBiH');
        });
        return () => subscription.unsubscribe();
    }, [watch]);

    const dispatch = useDispatch();

    const {zone, kantoni, entiteti} = useSelector((state) => state.utils);
    const {authenticated} = useSelector((state) => state.users);

    const {solarModels} = useSelector((state) => state.models);

    useEffect(() => {
        const getData = async () => {
            if (idData2 && solarModels.edit) {
                // const res = await dispatch(getModel({value: idData2, type: 'solar'}));
                setCoords(idData2.geometry);
                setValue('entity', idData2.properties.entity);
                setValue("city", idData2.properties.city);
                setValue("elevation", idData2.properties.elevation);
                setValue("owner", idData2.properties.owner);
                setValue("note", idData2.properties.note);
                setValue("manufactured", idData2.properties.manufactured);
                setValue("power_field", idData2.properties.power_field);
                setValue("panel_degree", idData2.properties.panel_degree);
                setValue("zone", idData2.properties.zone);
            }
        };
        getData();
    }, [idData2, setValue, dispatch, solarModels.edit]);
    const onSubmit = async (dataToSend) => {
        setIsDisabled(true);
        setIsDisabledDelete(true);
        let formData;

        if(solarModels.edit) {
            if(!dataToSend.panel_degree)
                dataToSend.panel_degree = '';
            formData = setFormData(dataToSend, coords);
            const response = await dispatch(updateModel({id: idData2.id, value: formData, type: 'solar'}));
            setIsDisabled(false);
            setIsDisabledDelete(false);
            onHide();

            if (!response.error) {
                if (dataToSend.entity !== 'FBiH') {
                    await patchCanton(idData2.id, {canton: null});
                }
                setToastMessage("Update solar", "Uspjesno azuriranje", "success");
            } else {
                setToastMessage("Update solar neuspjesno", response.payload, "danger");
            }

            setIsDisabled(false);
            setIsDisabledDelete(false);
            return;
        }
        const point = {
            type: "Point",
            coordinates: []
        };
        point.coordinates.push(coordinates.lng);
        point.coordinates.push(coordinates.lat);

        formData = setFormData(dataToSend, point);
        const response = await dispatch(addModel({value: formData, type: 'solar'}));
        onHide();

        if(response.error) {
            setToastMessage("Dodavanje solar", response.payload, "danger");
        }else {
            setToastMessage("Dodavanje solar", "Uspjesno dodavanje", "success");

            removeLayer('solarLayer', map);

            const response = await dispatch(getAll({typeModel: 'solar' }));

            addLayer('solarLayer', response.payload, map);
            setIsDisabled(false);
            setIsDisabledDelete(false);
        }
    };
    const handleDelete = async () => {
        setIsDisabled(true);
        setIsDisabledDelete(true);
        const response = await dispatch(deleteModel({id: idData2.id, type: 'solar'}));
        onHide();
        if (response.error) {
            setToastMessage("Brisanje solar", response.payload, "danger");
        } else {
            setToastMessage("Brisanje solar", "Uspjesno brisanje", "success");
            removeLayer("solarLayer", map);
            const res = await dispatch(getAll({typeModel: 'solar'}));
            addLayer('solarLayer', res.payload, map);
            setIsDisabled(false);
            setIsDisabledDelete(false);
        }
    };

    return (
        <>
            <Modal
               show={show}
               onHide={onHide}
               size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Solar panel
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container>
                        {
                            solarModels.loadingData &&
                            <div className={styled.center}>
                                <BeatLoader color="#36d7b7" size={17} />
                                <span>Loading...</span>
                            </div>
                        }
                        {!solarModels.loadingData && <form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId="owner" className="mb-3" >
                                        <Form.Label>Naziv vlasnika</Form.Label>
                                        <Form.Control disabled={!authenticated} {...register("owner")} placeholder="Naziv vlasnika" type="text" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId='manufactured' className="mb-3">
                                        <Form.Label>Proizvodjac</Form.Label>
                                        <Form.Control disabled={!authenticated} {...register("manufactured")} placeholder="Proizvodjac" type="text" />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={12}>
                                    <Form.Group controlId="note" className="mb-3">
                                        <Form.Label>Napomena</Form.Label>
                                        <Form.Control disabled={!authenticated} {...register("note")} placeholder="Napomena" as="textarea" rows={1} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId='power_field' className="mb-3">
                                        <Form.Label>Snaga polja</Form.Label>
                                        <Form.Control disabled={!authenticated} {...register("power_field", {required: true})} placeholder="Snaga polja" type="number" />
                                        {errors.power_field && (<p className="text-danger">Please enter power field.</p>)}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId='panel_degree' className="mb-3">
                                        <Form.Label>Ugao panela</Form.Label>
                                        <Form.Control disabled={!authenticated} {...register("panel_degree")} placeholder="Ugao panela" type="number" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group controlId='entity' className="mb-3">
                                        <Form.Label>Entitet</Form.Label>
                                        <Form.Select disabled={!authenticated} {...register("entity")} placeholder="Entitet">
                                        {
                                                entiteti.map((entitet) => (
                                                    <option key={entitet.code} value={entitet.code}>
                                                        {entitet.name}, {entitet.code}
                                                    </option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                {
                                    showKanton && <Col md={6}>
                                    <Form.Group className="mb-3" controlId="canton">
                                        <Form.Label>Kanton</Form.Label>
                                        <Form.Select disabled={!authenticated}  {...register("canton")}  placeholder="Kanton">
                                            {
                                                kantoni.map((kan) => (
                                                    <option key={kan.code} value={kan.code}>
                                                        {kan.name}, {kan.code}
                                                    </option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                </Col>}
                            <Col md={6}>
                                    <Form.Group controlId="city" className="mb-3">
                                        <Form.Label>Grad</Form.Label>
                                        <Form.Control disabled={!authenticated} {...register("city", {required: true})}  placeholder="Grad" type="text" />
                                        {errors.city && (<p className="text-danger">Please enter name of city.</p>)}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="zone">
                                        <Form.Label>Zona</Form.Label>
                                        <Form.Select disabled={!authenticated} {...register("zone")}  placeholder="Zona">
                                            {
                                                zone.map((zona) => (
                                                    <option key={zona.code} value={zona.code}>
                                                        {zona.name}
                                                    </option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group controlId='elevation' className="mb-3">
                                        <Form.Label>Nadmorska visina</Form.Label>
                                        <Form.Control disabled={!authenticated}  {...register("elevation", {required: true})}  placeholder="Nadmorska visina" type="number" />
                                        {errors.elevation && (<p className="text-danger">Please enter elevation.</p>)}
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <Form.Group controlId='document' className="mb-3">
                                        <Form.Label>Dokument</Form.Label> <br />
                                        <input disabled={!authenticated} {...register("document")}  type="file" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            {authenticated &&   <Row>
                                <Col md={solarModels.edit ? 6 : 12} lg={solarModels.edit ? 6 : 12} xl={solarModels.edit ? 6 : 12} xs={solarModels.edit ? 6 : 12} xxl={solarModels.edit ? 6 : 12}>
                                    <div className="d-grid gap-2">
                                        <Button disabled={isDisabled || isDisabledDelete} type="submit" size="lg">
                                            {solarModels.loadingData ? <div><BeatLoader color="#36d7b7" size={17} />Loading...</div> : 'Save'}
                                        </Button>
                                    </div>
                                </Col>
                                {
                                    solarModels.edit && <Col md={6} lg={6} xl={6} xs={6} xxl={6}>
                                        <div className="d-grid gap-2">
                                            <Button disabled={isDisabledDelete || isDisabled} onClick={handleDelete} size="lg" variant="outline-danger">
                                                {solarModels.loading ? <div><BeatLoader color="#36d7b7" size={17} />Loading...</div> : 'Delete'}
                                            </Button>
                                        </div>
                                    </Col>
                                }
                            </Row>}
                        </form>}
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    );
}
export default SolarModal;
