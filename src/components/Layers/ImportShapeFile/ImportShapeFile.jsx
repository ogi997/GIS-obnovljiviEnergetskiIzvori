import styled from "../../../pages/Map/LeftSidebar/style.module.css";
import ownStyled from './style.module.css';
import {ArrowDownShort, ArrowUpShort, Eye} from "react-bootstrap-icons";
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {Form, Button} from "react-bootstrap";
import {importShapeFileSolarPanel, importShapeFileWindFarm} from "../../../api/shapeFile.service";
import {getProjections} from "../../../api/utils.service";
const ImportShapeFile = ({isSliders3Clicked, setToastMessage}) => {
    const {handleSubmit,register } = useForm();
    const [isArrowHidden, setIsArrowHidden] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);

    const [projection, setProjection] = useState([]);
    useEffect(() => {
        const getData = async () => {
            const response = await getProjections();
            setProjection(response);
        };
        getData();
    }, []);
    const changeArrow = () => {
        setIsArrowHidden(prev => !prev);
    };
    const onSubmit = async (data) => {
        setIsDisabled(true);
        const formData = new FormData();
        formData.append('srid', data.projekcija);
        formData.append('shapefile', data.shapefile[0]);

        switch(data.model) {
            case 'solar':
                try {
                 const response = await importShapeFileSolarPanel(formData);
                    setToastMessage('Import shapefile solar panel', 'Shapefile has successfully imported', 'success');
                } catch (error) {
                    setToastMessage('Import shapefile solar panel', 'There is problem with importing shapefile', 'danger');
                }
                break;
            case 'wind':
                try {
                    const response = await importShapeFileWindFarm(formData);
                    setToastMessage('Import shapefile wind farms', 'Shapefile has successfully imported', 'success');
                } catch (error) {
                    setToastMessage('Import shapefile wind farms', 'There is problem with importing shapefile', 'danger');
                }
                break;
            default: setIsDisabled(false); return;
        }
        setIsDisabled(false);
    };
    return (
        <>
            {isSliders3Clicked && (
                <div data-cy="temporary" onClick={changeArrow}
                     className={`${styled.infrastructure} ${ownStyled.pointer}`}>
                    <Eye className={`${styled.eye} ${isArrowHidden ? ownStyled.active : ownStyled.transparent}`}/>
                    <p className={styled.margbottom0}>Import shape file</p>
                    {isArrowHidden ?
                        (<ArrowUpShort
                            className={`${styled.widthHeight25} ${styled.whiteBackground} ${ownStyled.marginLeftAuto}`}
                        />)
                        :
                        (<ArrowDownShort
                            className={`${styled.widthHeight25} ${styled.whiteBackground} ${ownStyled.marginLeftAuto}`}
                        />)
                    }
                </div>
            )}
            {isArrowHidden && isSliders3Clicked && (

                <div className={`${styled.antenaBase} ${ownStyled.center}`}>
                    <form className={ownStyled.formDimension} onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3" controlId="model">
                            <Form.Label column="sm">Model</Form.Label>
                            <Form.Select {...register("model")} size="sm">
                                <option value="solar">Solar panel</option>
                                <option value="wind">Wind farm</option>
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="projekcija">
                            <Form.Label column="sm">Projekcija</Form.Label>
                            <Form.Select {...register("projekcija")} size="sm">
                                {/*<option value={123}>Projekcija1</option>*/}
                                {
                                    projection.length !== 0 ? projection.map((pro) => (
                                        <option key={pro.srid} value={pro.srid}>{pro.srid_name}</option>
                                    )) : <option>Loading...</option>
                                }
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="shapefile">
                            <Form.Label column="sm">Shapefile</Form.Label>
                            <Form.Control
                                {...register("shapefile")}
                                size="sm"
                                type="file"
                                accept=".zip"
                                required={true}
                                multiple={false}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="shapefile">
                            <Button disabled={isDisabled} type="submit" size="sm">Import</Button>
                        </Form.Group>
                    </form>
                </div>
            )
            }
        </>
    );
}

export default ImportShapeFile;
