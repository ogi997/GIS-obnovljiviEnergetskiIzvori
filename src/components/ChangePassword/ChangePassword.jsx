import {Modal} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { useForm } from "react-hook-form";
import Form from "react-bootstrap/Form";
import Alert from "react-bootstrap/Alert";
import styled from "../../pages/Login/style.module.css";
import {changePassword} from "../../api/user.service";
import {useState} from 'react';
import ToastMessage from "../ToastMessage/ToastMessage";
const ChangePassword = ({show, handleClose}) => {
    const { register, handleSubmit, getValues, reset, formState: { errors } } = useForm();
    const [showToast, setShowToast] = useState(false);
    const [headerToast, setHeaderToast] = useState('');
    const [bodyToast, setBodyToast] = useState('');
    const [variant, setVariant] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const onSubmit = async (data) => {
        setIsDisabled(true);
        try {
            await changePassword(data);
            setHeaderToast("Successfully changed password");
            setBodyToast("You have successfully changed password");
            setShowToast(true);
            setVariant('success');
            setIsDisabled(false);
        } catch(error) {
            setHeaderToast('Error');
            if(error.response?.data.old_password){
                setBodyToast(error.response?.data.old_password);
            } else if (error.response?.data.password) {
                setBodyToast(error.response?.data.password);
            } else if (error.response?.data.non_field_errors) {
                setBodyToast(error.response?.data.non_field_errors);
            } else {
                setBodyToast('There is problem with changing password');
            }
            setShowToast(true);
            setVariant('danger');
            setIsDisabled(false);
        }

        reset({
            old_password: '',
            password: '',
            password_repeated: ''
        });
        setIsDisabled(false);
        handleClose();
    }
    return (
      <>
          <Modal show={show} onHide={handleClose}>
              <Modal.Header closeButton>
                  <Modal.Title>Change password</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group className="mb-3" controlId="old_password">
                        <Form.Label>Old password</Form.Label>
                        <Form.Control autoFocus {...register("old_password", {required: true})} type="password" placeholder="Enter old password" />
                        {
                            errors.old_password &&
                            <Alert className={styled.marginTop5} variant='danger'>
                                Old password is required.
                            </Alert>
                        }
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control {...register("password", {
                            required: true,
                            minLength: 8
                        })} type="password" placeholder="Enter new password" />
                        {
                            errors.password && errors.password.type === "required" &&
                            <Alert className={styled.marginTop5} variant='danger'>
                                New password is required.
                            </Alert>
                        }
                        {
                            errors.password && errors.password.type === 'minLength' &&
                            <Alert className={styled.marginTop5} variant={"danger"}>
                                Minimal length for password is 8 character.
                            </Alert>
                        }
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="password_repeated">
                        <Form.Label>Repeat password</Form.Label>
                        <Form.Control {...register("password_repeated", {
                            required: true,
                            minLength: 8,
                            validate: (value) => {
                                const {password} = getValues();
                                return password === value;
                            }
                        })} type="password" placeholder="Repeat new password" />
                        {
                            errors.password_repeated && errors.password_repeated.type === "required" &&
                            <Alert className={styled.marginTop5} variant='danger'>
                                Repeat password is required.
                            </Alert>
                        }
                        {
                            errors.password_repeated && errors.password_repeated.type === "validate" &&
                            <Alert className={styled.marginTop5} variant={"danger"}>
                                Password should match.
                            </Alert>
                        }
                        {
                            errors.password_repeated && errors.password_repeated.type === 'minLength' &&
                            <Alert className={styled.marginTop5} variant={"danger"}>
                                Minimal length for password is 8 character.
                            </Alert>

                        }
                    </Form.Group>
                    <div style={{display: 'flex', justifyContent: 'end'}}>
                    <Button variant="secondary" onClick={handleClose} style={{marginRight: '5px'}}>
                        Close
                    </Button>
                    <Button disabled={isDisabled} variant="primary" type="submit">
                        {!isDisabled ? 'Save changes' : 'Loading...'}
                    </Button>
                    </div>
                </form>
              </Modal.Body>
          </Modal>

          {
              showToast && <ToastMessage header={headerToast} body={bodyToast} show={showToast} setShow={setShowToast} variant={variant} />
          }
          </>
    );
}

export default ChangePassword;
