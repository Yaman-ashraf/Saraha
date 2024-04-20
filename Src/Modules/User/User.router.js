import { Router } from 'express'
import * as usreController from './Controller/user.controller.js';
import { auth } from '../../Middleware/Auth.Middleware.js';
import fileUpload, { fileValidation } from '../../Services/cloudMulter.js';
import validation from '../../Middleware/validation.js';
import * as validators from './User.validation.js';

const router = Router();

router.get('/', fileUpload(fileValidation.image).single('image'), auth
    , validation(validators.profile), usreController.profile);

router.patch('/cover', fileUpload(fileValidation.image).array('image', 5), auth, usreController.coverPic);

router.patch('/updatePassword', auth, validation(validators.updatePassword), usreController.updatePassword);
router.get('/:id/profile', validation(validators.shareProfile), usreController.shareProfile)
export default router;  