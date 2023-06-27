import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {addModel, deleteModel, getAll, updateModel} from "../../../redux-store/modelsSlice";
import {setFormData} from "./utils";
import {addLayer, removeLayer} from "../../../utils/LayerControl";
import styled from './style.module.css';
import BeatLoader from "react-spinners/BeatLoader";
import {patchCanton} from "../../../api/windFarms.service";


const VjetroelektraneModal = ({setIdData, idData, map, show, onHide, coordinates, setToastMessage}) => {

    const { register, handleSubmit, watch, formState: { errors }, setValue } = useForm();
    const [isDisabled, setIsDisabled] = useState(false);
    const [isDisabledDelete, setIsDisabledDelete] = useState(false);
    const [showKanton, setShowKanton] = useState(false);
    const [coords, setCoords] = useState(null);
    useEffect(() => {
        const subscription = watch((value) => {
            if(value.entity === 'FBiH') {
                setShowKanton(true);
            } else {
                setShowKanton(false);
            }
        });
        return () => subscription.unsubscribe();
    }, [watch]);
    const dispatch = useDispatch();
    const {zone, kantoni, entiteti} = useSelector((state) => state.utils);
    const {authenticated} = useSelector((state) => state.users);

    const {windModels} = useSelector((state) => state.models);
    useEffect(() => {
        const getData = async () => {
            if (idData && windModels.edit) {
                setCoords(idData.geometry);
                setValue("city", idData.properties.city);
                setValue('entity', idData.properties.entity);
                setValue("elevation", idData.properties.elevation);
                setValue("manufactured", idData.properties.manufactured);
                setValue("note", idData.properties.note);
                setValue("owner", idData.properties.owner);
                setValue("power_energy", idData.properties.power_energy);
                setValue("wind_direction", idData.properties.wind_direction);
                setValue("zone", idData.properties.zone);
            }
        };
        getData();
    }, [idData, setValue, dispatch, windModels.edit]);

    const onSubmit = async (dataToSend) => {
        setIsDisabled(true);
        let formData;
        if(windModels.edit) {
            formData = setFormData(dataToSend, coords);

            const response = await dispatch(updateModel({id: idData.id, value: formData, type: 'windFarm'}));

            setIsDisabled(false);
            onHide();
            if (!response.error) {
                if (dataToSend.entity !== 'FBiH') {
                    await patchCanton(idData.id, {canton: null});
                }
                setToastMessage("Update vjetroelektrane", "Uspjesno azuriranje", "success");
            } else {
                setToastMessage("Update vjetroelektrane", response.payload, "danger");
            }
            setIsDisabled(false);
            return;
        }
        const point = {
            type: "Point",
            coordinates: []
        };
        point.coordinates.push(coordinates.lng);
        point.coordinates.push(coordinates.lat);
        formData = setFormData(dataToSend, point);
        const response = await dispatch(addModel({value: formData, type: 'windFarm'}));
        onHide();
        if(response.error) {
            setToastMessage("Dodavanje vjetroelektrane", response.payload, "danger");
        }else {
            setToastMessage("Dodavanje vjetroelektrane", "Uspjesno dodavanje", "success");

            removeLayer('windFarms', map);

            const response = await dispatch(getAll({typeModel: 'windFarm' }));

            addLayer('windFarms', response.payload, map);
            setIsDisabled(false);
        }
    };

    const handleDelete = async () => {
        setIsDisabled(true);
        setIsDisabledDelete(true);
        const response = await dispatch(deleteModel({id: idData.id, type: 'windFarm'}));
        onHide();
        if (response.error) {
            setToastMessage("Brisanje vjetroelektrane", response.payload, "danger");
        } else {
            setToastMessage("Brisanje vjetroelektrane", "Uspjesno brisanje", "success");
            removeLayer("windFarms", map);
            const res = await dispatch(getAll({typeModel: 'windFarm'}));
            addLayer('windFarms', res.payload, map);
            setIsDisabled(false);
            setIsDisabledDelete(false);
        }
    }
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
                        Vjetroelektrane panel
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Container>
                        {
                            windModels.loadingData &&
                            <div className={styled.center}>
                                <BeatLoader color="#36d7b7" size={17} />
                                <span>Loading...</span>
                            </div>
                        }
                        {!windModels.loadingData && <form onSubmit={handleSubmit(onSubmit)} >
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="owner">
                                        <Form.Label>Naziv vlasnika</Form.Label>
                                        <Form.Control disabled={!authenticated} {...register("owner")} placeholder="Naziv vlasnika" type="text" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="manufactured">
                                        <Form.Label>Proizvodjac</Form.Label>
                                        <Form.Control disabled={!authenticated} {...register("manufactured")} placeholder="Proizvodjac" type="text" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-3" controlId="note">
                                        <Form.Label>Napomena</Form.Label>
                                        <Form.Control disabled={!authenticated} {...register("note")} placeholder="Napomena" as="textarea" rows={1} />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="wind_direction">
                                        <Form.Label>Pravac vjetra</Form.Label>
                                        <Form.Control disabled={!authenticated} {...register("wind_direction")} placeholder="Pravac vjetra" type="text" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="entity">
                                        <Form.Label>Entitet</Form.Label>
                                        <Form.Select disabled={!authenticated}  {...register("entity")} placeholder="Entitet">
                                            {
                                                entiteti.map((en) => (
                                                    <option key={en.code} value={en.code}>
                                                        {en.name}, {en.code}
                                                    </option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                {
                                    showKanton && <Col md={6}>
                                    <Form.Group className="mb-3" controlId="canton">
                                        <Form.Label>Kanton</Form.Label>
                                        <Form.Select disabled={!authenticated} {...register("canton")}  placeholder="Kanton">
                                            {
                                                kantoni.map((kan) => (
                                                    <option key={kan.code} value={kan.code}>
                                                         {kan.name}, {kan.code}
                                                    </option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                }
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="city">
                                        <Form.Label>Grad</Form.Label>
                                        <Form.Control disabled={!authenticated} {...register("city", {required: true})} placeholder="Grad" type="text" />
                                        {errors.city && (<p className="colorRed">Please enter name of city.</p>)}
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="elevation">
                                        <Form.Label>Nadmorska visina</Form.Label>
                                        <Form.Control disabled={!authenticated} {...register("elevation", {required: true})}  placeholder="Nadmorska visina" type="number" />
                                        {errors.elevation && (<p className="colorRed">Please enter elevation.</p>)}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="power_energy">
                                        <Form.Label>Snaga isporucene energije</Form.Label>
                                        <Form.Control disabled={!authenticated} {...register("power_energy", {required: true})} placeholder="Snaga isporucene energije" type="number" />
                                        {errors.power_energy && (<p className="colorRed">Please enter power energy.</p>)}
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="zone">
                                        <Form.Label>Zona</Form.Label>
                                        <Form.Select disabled={!authenticated} {...register("zone")}  placeholder="Zona">
                                            {
                                                zone.map((zo) => (
                                                    <option key={zo.code} value={zo.code}>
                                                        {zo.name}
                                                    </option>
                                                ))
                                            }
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={12}>
                                    <Form.Group className="mb-3" controlId="document">
                                        <Form.Label>Dokument</Form.Label> <br />
                                        <input disabled={!authenticated} {...register("document")}  type="file" />
                                    </Form.Group>
                                </Col>
                            </Row>
                            {authenticated && <Row>
                                <Col md={windModels.edit ? 6 : 12} lg={windModels.edit ? 6 : 12} xl={windModels.edit ? 6 : 12} xs={windModels.edit ? 6 : 12} xxl={windModels.edit ? 6 : 12}>
                                    <div className="d-grid gap-2">
                                        <Button disabled={isDisabled || isDisabledDelete} type="submit" size="lg">
                                            {windModels.loadingData ? <div> <BeatLoader color="#36d7b7" size={17} /> Loading...</div> : 'Save'}
                                        </Button>
                                    </div>
                                </Col>
                                {
                                    windModels.edit && <Col md={6} lg={6} xl={6} xs={6} xxl={6}>
                                        <div className="d-grid gap-2">
                                            <Button disabled={isDisabledDelete || isDisabled} onClick={handleDelete} size="lg" variant="outline-danger">
                                                {windModels.loading ? <div><BeatLoader color="#36d7b7" size={17} /> Loading...</div> : 'Delete'}
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
export default VjetroelektraneModal;
